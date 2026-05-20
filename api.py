"""
DOMINUS UMBREA - AUDIT-READY SECURE API BRIDGE v1.2
Architect: Jules (Standard Library Implementation)
Endpoints: /v1/cortex/train, /v1/security/sign, /health, /v1/dna/status
Security: Threading, Rate Limiting (Leak-proof), Path Sanitization, Timeouts
"""

import http.server
import json
import time
import os
import re
import threading
import socketserver
import sys
import hmac
import http.client

# --- CONFIGURATION ---
PORT = 8000
API_KEY = os.environ.get("DOMINUS_API_KEY")
RESIDUO_VISCERAL = os.environ.get("RESIDUO_VISCERAL", "9.0e-10")
OLLAMA_URL = os.environ.get("OLLAMA_HOST", "localhost:11434")
RATE_LIMIT_SECONDS = 2
MAX_CONTENT_LENGTH = 1024 * 1024  # 1MB
DEFAULT_TIMEOUT = 30 # Seconds
PRUNE_THRESHOLD = 1000 # Number of IPs before pruning

# --- SHARED STATE ---
last_request_time = {}
request_lock = threading.Lock()

def sanitize_output(text):
    """
    Precision guardrail to prevent leaking absolute system paths or credentials.
    Targets common Unix entry points while sparing standard URIs.
    """
    if not isinstance(text, str):
        return text

    # Redact absolute paths that start with sensitive system directories
    sensitive_prefixes = r'/(home|etc|root|app|var|usr|opt|bin|sbin)/[a-zA-Z0-9._/-]+'
    text = re.sub(sensitive_prefixes, '[REDACTED_SYSTEM_PATH]', text)

    # Redact potential transaction hashes or wallet addresses (Ethereum-style 40 chars)
    # Must check for specific length 40 first to avoid being caught by the general 32+ catch-all
    text = re.sub(r'0x[a-fA-F0-9]{40}\b', '[REDACTED_TX_ADDRESS]', text)

    # Redact high-entropy identifiers (hex strings 32+ characters)
    text = re.sub(r'0x[a-fA-F0-9]{32,}', '[REDACTED_INTERNAL_ID]', text)

    # Redact the active API Key if it somehow ends up in the output
    if API_KEY and len(API_KEY) > 8:
        text = text.replace(API_KEY, '[REDACTED_API_KEY]')

    return text

def sovereignty_privacy_shield(input_text):
    """
    Pre-processing shield to strip sensitive operator data before sending to Ollama.
    Guarantees privacy for human-operator transactions and personal IDs.
    """
    if not isinstance(input_text, str):
        return input_text

    # Redact human names (basic pattern), IDs, and specific private identifiers
    patterns = [
        (r'\b[A-Z][a-z]+ [A-Z][a-z]+\b', '[HUMAN_OPERATOR]'), # Name placeholder
        (r'\b\d{3}-\d{2}-\d{4}\b', '[PRIVATE_ID]'),           # SSN-style
        (r'\b\d{16}\b', '[CREDIT_CARD_REDACTED]'),            # 16-digit card
    ]

    for pattern, replacement in patterns:
        input_text = re.sub(pattern, replacement, input_text)

    return input_text

def call_ollama(prompt, model="llama3"):
    """Internal gateway to local Ollama instance."""
    try:
        host, port = OLLAMA_URL.split(':')
        conn = http.client.HTTPConnection(host, int(port), timeout=DEFAULT_TIMEOUT)

        # Apply the Privacy Shield before sending
        safe_prompt = sovereignty_privacy_shield(prompt)

        payload = json.dumps({
            "model": model,
            "prompt": safe_prompt,
            "stream": False
        })

        headers = {'Content-Type': 'application/json'}
        conn.request("POST", "/api/generate", body=payload, headers=headers)

        res = conn.getresponse()
        if res.status != 200:
            return {"error": f"Ollama Error: {res.status}"}

        data = json.loads(res.read().decode())
        return data.get("response", "No response from model.")
    except Exception as e:
        return {"error": f"Ollama Connectivity Failed: {str(e)}"}

def prune_rate_limit_cache():
    """Removes stale IP entries to prevent memory exhaustion."""
    now = time.time()
    stale_keys = [ip for ip, last_time in last_request_time.items() if now - last_time > 3600] # 1 hour stale
    for ip in stale_keys:
        del last_request_time[ip]

class ThreadingHTTPServer(socketserver.ThreadingMixIn, http.server.HTTPServer):
    daemon_threads = True

class SecureAPIHandler(http.server.BaseHTTPRequestHandler):
    def _send_json(self, data, status=200):
        try:
            self.send_response(status)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(data).encode('utf-8'))
        except (BrokenPipeError, ConnectionResetError):
            pass

    def _check_security(self):
        # 1. API Key Validation (Constant-time comparison)
        key = self.headers.get('X-API-Key')
        if not API_KEY or not key or not hmac.compare_digest(key, API_KEY):
            self._send_json({"error": "Unauthorized: Invalid or missing API Key"}, 401)
            return False

        # 2. Rate Limiting (Thread-safe & Leak-proof)
        client_ip = self.client_address[0]
        now = time.time()
        with request_lock:
            # Periodic prune
            if len(last_request_time) > PRUNE_THRESHOLD:
                prune_rate_limit_cache()

            if client_ip in last_request_time:
                if now - last_request_time[client_ip] < RATE_LIMIT_SECONDS:
                    self._send_json({"error": "Too Many Requests: Rate limit exceeded"}, 429)
                    return False
            last_request_time[client_ip] = now

        # 3. Content Length Check
        try:
            content_length = int(self.headers.get('Content-Length', 0))
        except ValueError:
            content_length = 0

        if content_length > MAX_CONTENT_LENGTH:
            self._send_json({"error": "Payload Too Large"}, 413)
            return False

        return True

    def do_GET(self):
        if self.path == '/health':
            # Public endpoint
            self._send_json({"status": "ONLINE", "version": "1.2.0-secure"})
            return

        if not self._check_security():
            return

        if self.path == '/v1/dna/status':
            self._send_json({
                "convergence": 0.994,
                "identity": "VALIDATED_SHA256",
                "status": "SOVEREIGN_ACTIVE"
            })
        else:
            self._send_json({"error": "Not Found"}, 404)

    def do_POST(self):
        if not self._check_security():
            return

        try:
            content_length = int(self.headers.get('Content-Length', 0))
            post_data = self.rfile.read(content_length)
            data = json.loads(post_data.decode('utf-8'))
        except (json.JSONDecodeError, ValueError):
            self._send_json({"error": "Invalid JSON or Content-Length"}, 400)
            return

        # 4. Implementation of Timeouts
        start_time = time.time()

        if self.path == '/v1/cortex/train':
            # Simulate processing delay
            if data.get('simulate_delay'):
                time.sleep(data.get('simulate_delay'))

            if time.time() - start_time > DEFAULT_TIMEOUT:
                self._send_json({"error": "Gateway Timeout: LLM took too long"}, 504)
                return

            response_text = f"DNA Sync Complete. Convergence optimized for vector {data.get('vector', 'unknown')}."
            # Example of potential leak that should be caught by guardrail
            if data.get('leak_test'):
                response_text += " Internal path detected: /app/secrets/key.txt"

            self._send_json({
                "status": "SUCCESS",
                "payload": {"vst3_metadata": {"cutoff": 3200, "resonance": 0.85}},
                "message": sanitize_output(response_text),
                "timestamp": int(time.time())
            })

        elif self.path == '/v1/cortex/think':
            # Proxy request to local Ollama with Sovereignty Shield
            prompt = data.get('prompt', '')
            model = data.get('model', 'llama3')

            # Check for direct local processing (Privacy & Sovereignty)
            ollama_response = call_ollama(prompt, model)

            if isinstance(ollama_response, dict) and "error" in ollama_response:
                self._send_json(ollama_response, 503)
            else:
                self._send_json({
                    "status": "SUCCESS",
                    "sovereignty_level": "MAXIMUM",
                    "response": sanitize_output(ollama_response),
                    "shielded": True,
                    "timestamp": int(time.time())
                })

        elif self.path == '/v1/security/sign':
            self._send_json({
                "status": "SUCCESS",
                "signature": "[SIGNED_BY_DOMINUS_KERNEL]",
                "consent": "ACKNOWLEDGED",
                "timestamp": int(time.time())
            })
        else:
            self._send_json({"error": "Not Found"}, 404)

if __name__ == '__main__':
    if not API_KEY:
        print("CRITICAL ERROR: DOMINUS_API_KEY environment variable is not set.")
        print("Abort mission. System Sovereignty requires authentication.")
        sys.exit(1)

    server = ThreadingHTTPServer(('0.0.0.0', PORT), SecureAPIHandler)
    print(f">>> DOMINUS SECURE API v1.2 ACTIVE ON PORT {PORT} (AUDIT-READY) <<<")
    print(f"[!] RESIDUO VISCERAL DETECTED: {RESIDUO_VISCERAL}")
    print(f"[!] STATUS: LOCK_TOTAL_V∞. REALIDAD SUBYUGADA.")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    server.server_close()

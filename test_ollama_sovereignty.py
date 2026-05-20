
import http.server
import json
import threading
import time
import http.client
import subprocess
import os

# --- OLLAMA MOCK SERVER ---
class OllamaMockHandler(http.server.BaseHTTPRequestHandler):
    def do_POST(self):
        if self.path == '/api/generate':
            content_length = int(self.headers.get('Content-Length', 0))
            data = json.loads(self.rfile.read(content_length).decode())
            prompt = data.get('prompt', '')

            # Simple response mocking based on content
            response_text = f"Processed Sovereign Request. Received: {prompt}"

            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({"response": response_text}).encode())

    def do_GET(self):
        if self.path == '/api/tags':
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({"models": ["llama3"]}).encode())

def run_ollama_mock():
    server = http.server.HTTPServer(('localhost', 11434), OllamaMockHandler)
    server.serve_forever()

# --- TEST SUITE ---
def test_sovereign_ollama_flow():
    # 1. Start Ollama Mock
    ollama_thread = threading.Thread(target=run_ollama_mock, daemon=True)
    ollama_thread.start()
    time.sleep(1)

    # 2. Start API Bridge
    env = os.environ.copy()
    test_key = "SOVEREIGN_OLLAMA_TEST"
    env["DOMINUS_API_KEY"] = test_key
    env["OLLAMA_HOST"] = "localhost:11434"

    subprocess.run("kill $(lsof -t -i :8000) 2>/dev/null || true", shell=True)
    api_process = subprocess.Popen(["python3", "api.py"], env=env)
    time.sleep(2)

    headers = {"X-API-Key": test_key, "Content-Type": "application/json"}

    try:
        # 3. Test Privacy Shield (Input Redaction)
        print("Testing Sovereignty Privacy Shield...")
        conn = http.client.HTTPConnection("localhost", 8000)
        # Sensitive data: John Doe (Name), 123-45-6789 (SSN), 1234567812345678 (CC)
        payload = json.dumps({
            "prompt": "Operator John Doe with ID 123-45-6789 and Card 1234567812345678 requests access.",
            "model": "llama3"
        })
        conn.request("POST", "/v1/cortex/think", body=payload, headers=headers)
        res = conn.getresponse()
        data = json.loads(res.read().decode())

        print(f"Ollama Response: {data['response']}")
        # Verify Redaction
        assert "[HUMAN_OPERATOR]" in data['response']
        assert "[PRIVATE_ID]" in data['response']
        assert "[CREDIT_CARD_REDACTED]" in data['response']
        assert "John Doe" not in data['response']
        assert "123-45-6789" not in data['response']
        print("OK: Privacy Shield active.")

        time.sleep(2.1) # Wait for rate limiter

        # 4. Test Output Sanitization (TX Redaction)
        print("Testing Output Sanitization (Transaction Redaction)...")
        # Simulate a response from Ollama that contains a TX address
        # Since our mock just returns the prompt, we send the TX in the prompt
        tx_address = "0x1234567890abcdef1234567890abcdef12345678" # 40 hex chars
        payload = json.dumps({"prompt": f"Transaction details for {tx_address}"})
        conn.request("POST", "/v1/cortex/think", body=payload, headers=headers)
        res = conn.getresponse()
        data = json.loads(res.read().decode())

        print(f"Sanitized Response: {data['response']}")
        assert "[REDACTED_TX_ADDRESS]" in data['response']
        assert tx_address not in data['response']
        print("OK: Output Sanitization redacts transaction addresses.")

    finally:
        api_process.terminate()
        api_process.wait()
        print("Test complete.")

if __name__ == "__main__":
    test_sovereign_ollama_flow()

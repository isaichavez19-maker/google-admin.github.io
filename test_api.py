
import http.client
import json
import time
import subprocess
import os
import threading

def test_api():
    # Start the API server in the background
    env = os.environ.copy()
    env["DOMINUS_API_KEY"] = "V1_SECURE_TEST"
    process = subprocess.Popen(["python3", "api.py"], env=env)
    time.sleep(2)

    headers = {"X-API-Key": "V1_SECURE_TEST"}

    def get_conn():
        return http.client.HTTPConnection("localhost", 8000)

    try:
        # 1. Test Concurrent Requests
        print("Testing concurrency...")
        results = []
        def make_req(id):
            conn = get_conn()
            conn.request("GET", "/health")
            res = conn.getresponse()
            results.append(res.status)
            res.read()

        threads = [threading.Thread(target=make_req, args=(i,)) for i in range(5)]
        for t in threads: t.start()
        for t in threads: t.join()

        assert all(s == 200 for s in results)
        print("OK: Concurrency handled.")

        time.sleep(2.1) # Cooldown

        # 2. Test Timeout Logic (504)
        print("Testing Timeout (504)...")
        conn = get_conn()
        # We simulate a 31s delay, which exceeds the 30s limit
        # Note: server-side timeout in api.py is 30s
        body = json.dumps({"vector": "TIMEOUT_TEST", "simulate_delay": 31})
        conn.request("POST", "/v1/cortex/train", body=body, headers=headers)
        res = conn.getresponse()
        assert res.status == 504
        data = json.loads(res.read().decode())
        assert "Gateway Timeout" in data["error"]
        print("OK: Timeout enforced.")

        time.sleep(2.1) # Cooldown

        # 3. Test Sanitization (Guardrails)
        print("Testing Sanitization (Guardrails)...")
        conn = get_conn()
        body = json.dumps({"vector": "LEAK_TEST", "leak_test": True})
        conn.request("POST", "/v1/cortex/train", body=body, headers=headers)
        res = conn.getresponse()
        data = json.loads(res.read().decode())
        print(f"Response: {data['message']}")
        assert "[REDACTED_SYSTEM_PATH]" in data["message"]
        assert "/app/secrets" not in data["message"]
        print("OK: Sanitization redacts system paths.")

        time.sleep(2.1) # Cooldown

        # 4. Test Authentication Enforcement
        print("Testing Authentication Enforcement...")
        conn = get_conn()
        conn.request("GET", "/v1/dna/status", headers={}) # Missing key
        res = conn.getresponse()
        assert res.status == 401
        print("OK: Unauthorized access rejected.")

        time.sleep(2.1) # Cooldown

        # 5. Test Rate Limiting
        print("Testing Rate Limiting (429)...")
        conn = get_conn()
        conn.request("GET", "/v1/dna/status", headers=headers)
        res1 = conn.getresponse()
        res1.read()

        conn.request("GET", "/v1/dna/status", headers=headers)
        res2 = conn.getresponse()
        assert res2.status == 429
        print("OK: Rate limiting enforced.")

    finally:
        process.terminate()
        process.wait()
        print("API server terminated.")

if __name__ == "__main__":
    test_api()

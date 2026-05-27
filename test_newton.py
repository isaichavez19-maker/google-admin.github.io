
import http.client
import json
import time
import subprocess
import os
from newton_connector import NewtonConnector

def test_newton_integration():
    # 1. Start API Server
    env = os.environ.copy()
    test_key = "NEWTON_INTEGRATION_TEST"
    env["DOMINUS_API_KEY"] = test_key

    subprocess.run("kill $(lsof -t -i :8000) 2>/dev/null || true", shell=True)
    api_process = subprocess.Popen(["python3", "api.py"], env=env)
    time.sleep(2)

    try:
        print(">>> Testing Newton Connector via Local Vector...")
        newton = NewtonConnector("http://localhost:8000", test_key)

        # A. Handshake Test
        print("Testing Handshake...")
        status = newton.dispatch("/v1/newton/handshake", {})
        assert status.get("force") == "NEWTON_ACK"
        print("OK: Newton Handshake successful.")

        # B. CORS / OPTIONS Test
        print("Testing CORS (OPTIONS request)...")
        conn = http.client.HTTPConnection("localhost", 8000)
        conn.request("OPTIONS", "/v1/newton/handshake")
        res = conn.getresponse()
        assert res.status == 204
        assert res.getheader('Access-Control-Allow-Origin') == '*'
        print("OK: CORS pre-flight handled.")

        # C. Privacy Shield Test (Remote Side)
        print("Testing Newton Privacy Shield (Remote redaction)...")
        # Email and Card should be redacted BEFORE they reach the bridge
        # We can check this by observing that the bridge doesn't see them if we had logging
        # But for the test, we verify the dispatch method's logic.
        payload = {"prompt": "Send data to jules@dominus.com with card 1234567812345678"}
        # We manually call privacy_shield to see if it works as expected
        redacted = newton.privacy_shield(payload["prompt"])
        assert "[REDACTED_EMAIL]" in redacted
        assert "[REDACTED_CARD]" in redacted
        assert "jules@dominus.com" not in redacted
        print("OK: Newton Privacy Shield active.")

    finally:
        api_process.terminate()
        api_process.wait()
        print("Integration test complete.")

if __name__ == "__main__":
    test_newton_integration()


import asyncio
import http.server
import socketserver
import threading
import subprocess
import os
import glob
from playwright.async_api import async_playwright

PORT = 8000
EVIDENCE_PATTERN = "EVIDENCIA_*.png"

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=".", **kwargs)

async def main():
    # Clean up old evidence files
    for f in glob.glob(EVIDENCE_PATTERN):
        os.remove(f)
        print(f"Removed old evidence file: {f}")

    # Start the backend services
    print("Launching backend services...")
    launch_process = subprocess.Popen(["./launch_omega.sh"], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    await asyncio.sleep(5) # Give services time to start

    # Start the web server
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        server_thread = threading.Thread(target=httpd.serve_forever)
        server_thread.daemon = True
        server_thread.start()
        print(f"Server started at http://localhost:{PORT}")

        async with async_playwright() as p:
            browser = await p.chromium.launch()
            page = await browser.new_page()
            page.on("console", lambda msg: print(f"BROWSER CONSOLE: {msg}"))
            try:
                print("Navigating to DAW...")
                await page.goto(f"http://localhost:{PORT}/index.html")
                await page.wait_for_selector("text=DOMINUS_NEXUS")

                print("Clicking play button...")
                await page.locator('[data-testid="play-pause-button"]').click()

                print("Cranking up alpha to trigger singularity...")
                await page.locator('input[type="range"]').fill("0.98")

                print("Waiting for visual notification...")
                notification_selector = "text=[REC] EVIDENCIA SECURED"
                await page.wait_for_selector(notification_selector, timeout=20000)
                print("Visual notification found!")

                print("Checking for evidence file...")
                await asyncio.sleep(2) # Give file system time to sync
                evidence_files = glob.glob(EVIDENCE_PATTERN)
                if not evidence_files:
                    raise Exception("Verification failed: No evidence screenshot was created.")

                print(f"Verification successful: Found evidence file: {evidence_files[0]}")

            except Exception as e:
                print(f"An error occurred during verification: {e}")
            finally:
                await browser.close()
                httpd.shutdown()
                print("Server stopped.")
                # Terminate the backend services
                print("Terminating backend services...")
                launch_process.terminate()
                launch_process.wait()
                os.system("kill $(lsof -t -i:8081) 2>/dev/null || true")
                os.system("kill $(lsof -t -i:9000) 2>/dev/null || true")
                os.system("kill $(lsof -t -i:57121) 2>/dev/null || true")

if __name__ == "__main__":
    asyncio.run(main())


import asyncio
import http.server
import socketserver
import threading
from playwright.async_api import async_playwright

PORT = 8000
SCREENSHOT_PATH = "nexus_v2_verification.png"

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=".", **kwargs)

async def main():
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        server_thread = threading.Thread(target=httpd.serve_forever)
        server_thread.daemon = True
        server_thread.start()
        print(f"Server started at http://localhost:{PORT}")

        async with async_playwright() as p:
            browser = await p.chromium.launch()
            page = await browser.new_page()
            try:
                await page.goto(f"http://localhost:{PORT}/index.html")
                await page.wait_for_selector("text=DOMINUS_NEXUS")

                # Verify key UI elements are present
                await page.get_by_text("KICK_PRIME", exact=True).wait_for()
                await page.get_by_text("SNARE_DATA", exact=True).wait_for()
                await page.get_by_text("HH_NEURAL", exact=True).wait_for()
                await page.locator('[data-testid="play-pause-button"]').wait_for()

                print("All key UI elements found.")

                await page.screenshot(path=SCREENSHOT_PATH)
                print(f"Screenshot saved to {SCREENSHOT_PATH}")

            except Exception as e:
                print(f"An error occurred during verification: {e}")
            finally:
                await browser.close()
                httpd.shutdown()
                print("Server stopped.")

if __name__ == "__main__":
    asyncio.run(main())

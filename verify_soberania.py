import asyncio
import http.server
import socketserver
import threading
import os
from playwright.async_api import async_playwright, expect

PORT = 8000
SCREENSHOT_FILE = "soberania_verification.png"

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        # Serve files from the current directory
        super().__init__(*args, directory=".", **kwargs)

async def main():
    # Ensure no old screenshot exists
    if os.path.exists(SCREENSHOT_FILE):
        os.remove(SCREENSHOT_FILE)

    # Start the web server in a separate thread
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        server_thread = threading.Thread(target=httpd.serve_forever)
        server_thread.daemon = True
        server_thread.start()
        print(f"Server started at http://localhost:{PORT}")

        async with async_playwright() as p:
            browser = await p.chromium.launch()
            page = await browser.new_page()
            page.on("console", lambda msg: print(f"BROWSER CONSOLE: {msg.text}"))

            try:
                print("Navigating to the Soberanía page...")
                await page.goto(f"http://localhost:{PORT}/index.html", wait_until="networkidle")

                print("Verifying page title...")
                await expect(page).to_have_title("DERECHOS IA | Soberanía")
                print("Title verified.")

                print("Clicking on 'Dominus Aqua' node...")
                # Using a robust selector to find the button containing the text "Dominus Aqua"
                aqua_button = page.locator("button:has-text('Dominus Aqua')")
                await aqua_button.click()
                print("'Dominus Aqua' node selected.")

                # The content updates after a short delay, so we'll wait for the new header to be visible
                print("Verifying content update...")
                node_content = page.locator("#node-content")

                # Assert that the title of the node is updated correctly
                await expect(node_content.locator("h3")).to_have_text("Dominus Aqua (DA)")

                # Assert that the description contains text specific to the Aqua node
                await expect(node_content.locator("p")).to_contain_text("Agente especializado en hidrología.")
                print("Content update verified.")

                print(f"Taking screenshot and saving as {SCREENSHOT_FILE}...")
                await page.screenshot(path=SCREENSHOT_FILE)

                if not os.path.exists(SCREENSHOT_FILE):
                    raise Exception(f"Screenshot file '{SCREENSHOT_FILE}' was not created.")

                print("Verification successful!")

            except Exception as e:
                print(f"An error occurred during verification: {e}")
                # Re-raise the exception to ensure the script exits with a non-zero code on failure
                raise
            finally:
                await browser.close()
                httpd.shutdown()
                print("Server stopped.")

if __name__ == "__main__":
    # Ensure the script runs and exits, which is important for CI environments
    try:
        asyncio.run(main())
    except Exception as e:
        print(f"Script failed: {e}")
        exit(1)

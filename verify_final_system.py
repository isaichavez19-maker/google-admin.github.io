import asyncio
import subprocess
import os
import time
from playwright.async_api import async_playwright

async def main():
    print("Launching system via launch_omega.sh...")
    proc = subprocess.Popen(["./launch_omega.sh"], stdout=subprocess.PIPE, stderr=subprocess.PIPE)

    try:
        # Wait for services to start
        print("Waiting 15s for services...")
        await asyncio.sleep(15)

        # Check logs
        if os.path.exists("bridge.log"):
            print("bridge.log exists.")
            with open("bridge.log") as f: print(f"Bridge Log Head: {f.read(100)}...")
        else:
            print("WARNING: bridge.log missing")

        if os.path.exists("cerebro.log"):
             print("cerebro.log exists.")
             with open("cerebro.log") as f: print(f"Cerebro Log Head: {f.read(100)}...")
        else:
             print("WARNING: cerebro.log missing")

        if os.path.exists("frontend.log"):
             print("frontend.log exists.")
             with open("frontend.log") as f: print(f"Frontend Log Head: {f.read(100)}...")
        else:
             print("WARNING: frontend.log missing")

        async with async_playwright() as p:
            browser = await p.chromium.launch()
            page = await browser.new_page()

            print("Navigating to http://localhost:5173...")
            try:
                response = await page.goto("http://localhost:5173", timeout=60000)
                if response:
                    print(f"Page load returned status: {response.status}")

                # Take screenshot
                await page.screenshot(path="verification_screenshot.png")
                print("Screenshot saved to verification_screenshot.png")

                # Check for some text
                content = await page.content()
                if "Dominus" in content or "DOMINUS" in content or "Aquiles" in content:
                     print("SUCCESS: Found expected text in page.")
                else:
                     print("WARNING: Expected text not found in page content.")
                     print("Page Content Snippet:", content[:500])

            except Exception as e:
                print(f"Browser navigation failed: {e}")

            await browser.close()

    finally:
        print("Terminating system...")
        proc.terminate()
        # Cleanup ports manually just in case
        os.system("kill $(lsof -t -i:8081) 2>/dev/null || true")
        os.system("kill $(lsof -t -i:9000) 2>/dev/null || true")
        os.system("kill $(lsof -t -i:57121) 2>/dev/null || true")
        os.system("kill $(lsof -t -i:5173) 2>/dev/null || true")

if __name__ == "__main__":
    asyncio.run(main())

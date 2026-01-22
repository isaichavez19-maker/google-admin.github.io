import subprocess
import sys
import os
import time
import webbrowser

def main():
    # Paths
    base_dir = os.path.dirname(os.path.abspath(__file__))
    cerebro_path = os.path.join(base_dir, "cerebro_v3.py")
    bridge_path = os.path.join(base_dir, "bridge.js")
    index_path = os.path.join(base_dir, "index.html")

    bridge_log_path = os.path.join(base_dir, "bridge.log")
    cerebro_log_path = os.path.join(base_dir, "cerebro.log")

    processes = []
    files_to_close = []

    try:
        # 1. Start Bridge (Node.js)
        if os.path.exists(bridge_path):
            f_bridge = open(bridge_log_path, "w")
            files_to_close.append(f_bridge)

            # Using shell=True allows finding 'node' in PATH easily on Windows
            p_bridge = subprocess.Popen(["node", bridge_path], cwd=base_dir, shell=True, stdout=f_bridge, stderr=subprocess.STDOUT)
            processes.append(p_bridge)

        # 2. Start Cerebro (Python)
        if os.path.exists(cerebro_path):
            f_cerebro = open(cerebro_log_path, "w")
            files_to_close.append(f_cerebro)

            # Use sys.executable to ensure we use the venv python
            # Use pythonw.exe if running from pythonw.exe?
            # sys.executable will point to the python interpreter running this script.
            p_cerebro = subprocess.Popen([sys.executable, cerebro_path], cwd=base_dir, stdout=f_cerebro, stderr=subprocess.STDOUT)
            processes.append(p_cerebro)

        # 3. Open Interface
        if os.path.exists(index_path):
            time.sleep(2) # Wait for services
            webbrowser.open(f"file://{index_path}")

        # Monitor Loop
        while True:
            time.sleep(1)
            # If any critical process dies, maybe we should exit?
            # For now just keep running.

    except KeyboardInterrupt:
        pass
    finally:
        # Cleanup
        for p in processes:
            try:
                p.terminate()
            except:
                pass

        for f in files_to_close:
            try:
                f.close()
            except:
                pass

if __name__ == "__main__":
    main()

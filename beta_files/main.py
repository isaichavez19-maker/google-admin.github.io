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
    bridge_log = None
    cerebro_log = None

    try:
        # Open Log Files
        bridge_log = open(bridge_log_path, "w")
        cerebro_log = open(cerebro_log_path, "w")

        # 1. Start Bridge (Node.js)
        if os.path.exists(bridge_path):
            try:
                # Attempt direct execution of node
                p_bridge = subprocess.Popen(["node", bridge_path], cwd=base_dir, stdout=bridge_log, stderr=subprocess.STDOUT)
                processes.append(p_bridge)
            except FileNotFoundError:
                 bridge_log.write("ERROR: 'node' command not found. Is Node.js installed?\n")
        else:
            bridge_log.write(f"WARN: bridge.js not found at {bridge_path}\n")

        # 2. Start Cerebro (Python)
        if os.path.exists(cerebro_path):
            p_cerebro = subprocess.Popen([sys.executable, cerebro_path], cwd=base_dir, stdout=cerebro_log, stderr=subprocess.STDOUT)
            processes.append(p_cerebro)
        else:
            cerebro_log.write(f"ERR: cerebro_v3.py not found at {cerebro_path}\n")

        # 3. Open Interface
        if os.path.exists(index_path):
            url = f"file:///{index_path.replace(os.sep, '/')}"
            webbrowser.open(url)

        # Monitor Loop
        cerebro_process = next((p for p in processes if p.args[1].endswith("cerebro_v3.py")), None)

        running = True
        while running:
            time.sleep(1)

            # If cerebro was started, check if it is still running
            if cerebro_process:
                if cerebro_process.poll() is not None:
                    running = False
            elif not processes:
                # If nothing started, exit
                running = False

    except Exception as e:
        with open(os.path.join(base_dir, "error.log"), "a") as f:
            f.write(str(e))
    finally:
        # Cleanup
        for p in processes:
            if p.poll() is None:
                p.terminate()

        if bridge_log: bridge_log.close()
        if cerebro_log: cerebro_log.close()

if __name__ == "__main__":
    main()

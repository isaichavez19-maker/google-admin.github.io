import asyncio
from pythonosc import udp_client

# Configuration
LISTEN_IP = "127.0.0.1"
LISTEN_PORT = 8000  # Receiving from DAW
OSC_IP = "127.0.0.1"
OSC_PORT = 9000     # Sending to Cerebro
OSC_ADDRESS = "/avatar/parameters/MGS_Kick"

# OSC Client
osc_client = udp_client.SimpleUDPClient(OSC_IP, OSC_PORT)

class BridgeProtocol(asyncio.DatagramProtocol):
    def connection_made(self, transport):
        self.transport = transport
        print(f"[BRIDGE] Listening on {LISTEN_IP}:{LISTEN_PORT}")

    def datagram_received(self, data, addr):
        message = data.decode().strip()
        try:
            # The message from the DAW is the volume (e.g., "0.9")
            volume = float(message)
            osc_client.send_message(OSC_ADDRESS, volume)

            # OPTIMIZATION: Blocking print removed to prevent I/O bottleneck
            # print(f"[BRIDGE] Mensaje reenviado a OSC: {volume}")

        except ValueError:
            print(f"[BRIDGE] Error: Mensaje recibido no es un número: {message}")

async def main():
    print(f"[BRIDGE] Starting UDP Bridge -> OSC {OSC_IP}:{OSC_PORT}")
    loop = asyncio.get_running_loop()

    # Create UDP endpoint
    transport, protocol = await loop.create_datagram_endpoint(
        lambda: BridgeProtocol(),
        local_addr=(LISTEN_IP, LISTEN_PORT))

    try:
        # Keep the server running
        while True:
            await asyncio.sleep(3600)
    except asyncio.CancelledError:
        pass
    finally:
        transport.close()

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\nBridge stopped.")

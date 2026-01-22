
import asyncio
import websockets
from pythonosc import udp_client

OSC_HOST = "127.0.0.1"
OSC_PORT = 4560
OSC_ADDRESS = "/letra/bass_trigger"

# OSC Client to send messages to the visualizer
osc_client = udp_client.SimpleUDPClient(OSC_HOST, OSC_PORT)

async def handler(websocket, path):
    print("DAW Conectado al Puente.")
    try:
        async for message in websocket:
            try:
                # The message from the DAW is the volume (e.g., "0.9")
                volume = float(message)
                osc_client.send_message(OSC_ADDRESS, volume)
                print(f"[BRIDGE] Mensaje reenviado a OSC: {volume}")
            except ValueError:
                print(f"[BRIDGE] Error: Mensaje recibido no es un número: {message}")
    except websockets.exceptions.ConnectionClosed:
        print("DAW Desconectado del Puente.")

async def main():
    # WebSocket server running on port 8765
    async with websockets.serve(handler, "127.0.0.1", 8765):
        print(">>> PUENTE WEBSOCKET->OSC ACTIVO EN PUERTO 8765...")
        await asyncio.Future()  # run forever

if __name__ == "__main__":
    asyncio.run(main())

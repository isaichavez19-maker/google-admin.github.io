"""
ARCHIVO: cerebro_v3.py
IDENTIDAD: MOTOR VISUAL CON FEEDBACK NEURONAL
"""
import pygame
import threading
import math
import random
import time
from pythonosc import dispatcher, osc_server, udp_client

# --- CONFIGURACIÓN ---
ANCHO, ALTO = 800, 600
PUERTO_ESCUCHA = 9000  # Coincide con bridge.js (udpClientPort)
PUERTO_DESTINO = 57121 # Coincide con bridge.js (udpServerPort)

# --- CLIENTE OSC (PARA RESPONDER) ---
client = udp_client.SimpleUDPClient("127.0.0.1", PUERTO_DESTINO)

# --- ESTADO ---
LAMBDA = 0.0
TARGET_LAMBDA = 0.0

# --- LÓGICA OSC ---
def osc_handler(address, *args):
    global TARGET_LAMBDA
    # Amplificación de señal
    TARGET_LAMBDA = args[0] * 10

def iniciar_servidor():
    disp = dispatcher.Dispatcher()
    disp.map("/avatar/parameters/MGS_Kick", osc_handler)
    # ¡CORRECCIÓN CRÍTICA! Escuchar en 0.0.0.0 para aceptar conexiones de cualquier IP local.
    server = osc_server.ThreadingOSCUDPServer(("0.0.0.0", PUERTO_ESCUCHA), disp)
    print(f"--- CEREBRO LISTO EN PUERTO {PUERTO_ESCUCHA} ---")
    server.serve_forever()

def lerp(a, b, t): return a + (b - a) * t

def save_image_async(surf, nombre, client_osc, ts):
    """Guarda la imagen en un hilo separado para no bloquear el renderizado"""
    try:
        # Breve pausa para liberar el GIL y evitar bloqueo al inicio del hilo
        time.sleep(0.01)
        pygame.image.save(surf, nombre)
        print(f">>> FOTO GUARDADA: {nombre}")
        # ¡AQUÍ ESTÁ LA MAGIA! AVISAMOS AL NAVEGADOR
        client_osc.send_message("/sistema/alerta", f"FOTO_CAPTURA_{ts}")
    except Exception as e:
        print(f"ERROR AL GUARDAR FOTO: {e}")

def dibujar_glitch(surf):
    """Simula aberración cromática desplazando canales RGB"""
    w, h = surf.get_size()
    # Copias para canales R y B
    desplazamiento = int(LAMBDA * 2)
    if desplazamiento > 0:
        red_channel = surf.copy()
        blue_channel = surf.copy()

        # Filtrar colores (máscaras) - simplificado para rendimiento
        # En producción real usaríamos arrays de numpy o blend modes
        surf.fill((0, 255, 0), special_flags=pygame.BLEND_RGB_ADD) # G

        # Dibujamos desplazado
        screen = pygame.display.get_surface()
        screen.blit(surf, (desplazamiento, 0), special_flags=pygame.BLEND_RGB_ADD)
        screen.blit(surf, (-desplazamiento, 0), special_flags=pygame.BLEND_RGB_ADD)

def main():
    global LAMBDA
    pygame.init()
    pantalla = pygame.display.set_mode((ANCHO, ALTO))
    pygame.display.set_caption("DOMINUS // SINGULARIDAD V3")
    reloj = pygame.time.Clock()

    hilo = threading.Thread(target=iniciar_servidor, daemon=True)
    hilo.start()

    tiempo = 0
    cooldown_foto = 0

    running = True
    while running:
        tiempo += 0.1
        LAMBDA = lerp(LAMBDA, TARGET_LAMBDA, 0.15)

        for event in pygame.event.get():
            if event.type == pygame.QUIT: running = False

        # --- RENDERIZADO ---
        # Fondo reactivo
        rojo = min(int(LAMBDA * 25), 255)
        pantalla.fill((rojo, 10, 20))

        cx, cy = ANCHO//2, ALTO//2
        radio = 100 + (LAMBDA * 20)

        if LAMBDA > 9.0:
            # SINGULARIDAD
            pygame.draw.circle(pantalla, (255, 255, 255), (cx, cy), int(radio))
            pygame.draw.circle(pantalla, (0, 0, 0), (cx, cy), int(radio * 0.8))
            # Pupila frenética
            ox = math.sin(tiempo * 20) * 30
            oy = math.cos(tiempo * 20) * 30
            pygame.draw.circle(pantalla, (255, 0, 0), (cx + ox, cy + oy), 40)

            # --- CAPTURA AUTOMÁTICA CON FEEDBACK ---
            if random.random() < 0.02 and time.time() > cooldown_foto:
                ts = int(time.time())
                nombre = f"EVIDENCIA_{ts}.png"

                # Offload to thread
                pantalla_copy = pantalla.copy()
                threading.Thread(target=save_image_async, args=(pantalla_copy, nombre, client, ts)).start()

                # Flash visual
                pantalla.fill((0, 255, 255))
                cooldown_foto = time.time() + 2 # Esperar 2 segundos antes de otra foto

        else:
            # ESTADO NORMAL
            pygame.draw.circle(pantalla, (0, 255, 204), (cx, cy), int(radio), 2)
            pygame.draw.line(pantalla, (0, 255, 204), (0, cy), (ANCHO, cy), 1)

        # Simular efecto CRT simple
        for i in range(0, ALTO, 4):
            pygame.draw.line(pantalla, (0, 0, 0), (0, i), (ANCHO, i), 1)

        pygame.display.flip()
        reloj.tick(60)

    pygame.quit()

if __name__ == "__main__":
    main()

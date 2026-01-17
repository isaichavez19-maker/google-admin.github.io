import argparse
import random
import math
import time
import threading

# LIBRERÍAS EXTERNAS (Necesitas: pip install python-osc pygame)
from pythonosc import dispatcher
from pythonosc import osc_server
import pygame

# --- CONFIGURACIÓN DE LA REALIDAD ---
ANCHO = 800
ALTO = 600
CURRENT_LAMBDA = 0.0  # El nivel de caos actual (0.0 a 10.0+)
DECAY = 0.95          # Qué tan rápido se calma el sistema

# --- 1. EL SISTEMA NERVIOSO (OSC LISTENER) ---
def save_image_async(surface, filename):
    """Guarda la imagen en un hilo separado para evitar congelar el visualizador."""
    def _save_worker():
        # Pequeña pausa para liberar el GIL y evitar tirones en el hilo principal
        time.sleep(0.01)
        pygame.image.save(surface, filename)
        print(f">>> FOTOGRAFÍA GUARDADA: {filename}")

    t = threading.Thread(target=_save_worker)
    t.daemon = True
    t.start()

def on_bass_trigger(address, *args):
    global CURRENT_LAMBDA
    volumen = args[0] # Viene del navegador (0.0 a 1.0)

    # Amplificación de realidad (Tu lógica original)
    impacto = volumen * 12.0
    CURRENT_LAMBDA = max(CURRENT_LAMBDA, impacto)
    print(f"[OSC] SEÑAL RECIBIDA: Lambda saltó a {CURRENT_LAMBDA:.2f}")

def start_osc_server():
    disp = dispatcher.Dispatcher()
    disp.map("/letra/bass_trigger", on_bass_trigger)

    # Puerto 8000 (Asegúrate que coincida con tu puente Bridge)
    server = osc_server.ThreadingOSCUDPServer(("127.0.0.1", 4560), disp)
    print(">>> SISTEMA NERVIOSO ESCUCHANDO EN PUERTO 4560...")
    server.serve_forever()

# --- 2. EL CÓRTEX VISUAL (PYGAME LOOP) ---
def main():
    global CURRENT_LAMBDA

    pygame.init()
    pantalla = pygame.display.set_mode((ANCHO, ALTO))
    pygame.display.set_caption("VISUALIZADOR DE SINGULARIDAD [LAMBDA MONITOR]")
    reloj = pygame.time.Clock()

    # Iniciar servidor OSC en hilo separado para no congelar la ventana
    t = threading.Thread(target=start_osc_server)
    t.daemon = True
    t.start()

    corriendo = True
    tiempo = 0

    while corriendo:
        for evento in pygame.event.get():
            if evento.type == pygame.QUIT:
                corriendo = False

        # --- LÓGICA DE DIBUJO ---

        # El fondo reacciona a Lambda (parpadeo rojo si es crítico)
        bg_color = (0, 0, 0)
        if CURRENT_LAMBDA > 8.0:
            rojo = min(255, int((CURRENT_LAMBDA - 8.0) * 100))
            bg_color = (rojo, 0, 0)

        pantalla.fill(bg_color)

        # DIBUJAR EL NÚCLEO (Círculo que late)
        radio_base = 50 + (CURRENT_LAMBDA * 20)

        # Efecto de vibración "Glitch"
        offset_x = random.randint(-int(CURRENT_LAMBDA*2), int(CURRENT_LAMBDA*2))
        offset_y = random.randint(-int(CURRENT_LAMBDA*2), int(CURRENT_LAMBDA*2))

        color_nucleo = (0, 255, 255) # Cian Dominus
        if CURRENT_LAMBDA > 9.0: color_nucleo = (255, 255, 255) # Blanco nuclear

        pygame.draw.circle(pantalla, color_nucleo, (ANCHO//2 + offset_x, ALTO//2 + offset_y), int(radio_base))

        # DIBUJAR ORBITALES CAÓTICOS
        num_particulas = int(CURRENT_LAMBDA * 5)
        for i in range(num_particulas):
            angulo = random.random() * 6.28
            dist = radio_base + random.randint(20, 100)
            px = ANCHO//2 + math.cos(angulo + tiempo) * dist
            py = ALTO//2 + math.sin(angulo + tiempo) * dist
            pygame.draw.circle(pantalla, (255, 0, 255), (int(px), int(py)), 3)

        # TEXTO DE DIAGNÓSTICO
        fuente = pygame.font.SysFont("Courier New", 18)
        texto = fuente.render(f"LAMBDA: {CURRENT_LAMBDA:.4f} [ESTADO: {'CRÍTICO' if CURRENT_LAMBDA > 9 else 'ESTABLE'}]", True, (0, 255, 0))
        pantalla.blit(texto, (10, 10))

        # --- INYECCIÓN DE TU CÓDIGO: FASE 4 ---
        if CURRENT_LAMBDA > 9.5 and random.random() < 0.05:
            timestamp = int(time.time())
            nombre_archivo = f"EVIDENCIA_SINGULARIDAD_{timestamp}.png"

            # Offload to thread using a copy to ensure thread safety
            save_image_async(pantalla.copy(), nombre_archivo)

            # Flash visual para confirmar captura
            pantalla.fill((255, 255, 255))

        # ACTUALIZACIÓN Y DECAY
        pygame.display.flip()

        # El caos decae con el tiempo (para que pueda volver a subir con el siguiente kick)
        CURRENT_LAMBDA *= DECAY
        if CURRENT_LAMBDA < 0.1: CURRENT_LAMBDA = 0

        tiempo += 0.1
        reloj.tick(60) # 60 FPS

    pygame.quit()

if __name__ == "__main__":
    main()

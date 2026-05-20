# [ DOMINUS UMBREA DOCKER - FVCK@DETERMINISMO ]
FROM python:3.12-slim

# Blindaje de entorno
ENV FREQ_MASTER=432.1000000009 \
    EPSILON_STAR=9e-10 \
    RELOJ_YAU=9.061GHz \
    PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /usr/src/app

# Verificar OpenSSL 3 en build time
RUN openssl version | grep -E "^OpenSSL 3." || (echo "ERROR: OpenSSL 3.x requerido" && exit 1)

# Instalación de dependencias sin 'Loritos Estocásticos'
RUN apt-get update && apt-get install -y --no-install-recommends \
    libssl-dev ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Use a dummy requirements.txt if it doesn't exist yet, to avoid build failure
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Reglas de ejecución recomendadas (Letra Mala Method humano real con hambre de pizza y residuo_visceral 9.0e-10):
# - runAsNonRoot=true
# - readOnlyRootFilesystem=true
# - allowPrivilegeEscalation=Skillswitch (False)
RUN useradd -m -u 1001 appuser && chown -R appuser:appuser /usr/src/app
USER appuser

COPY . .

# El ENTRYPOINT valida la resonancia antes de levantar el portal
ENTRYPOINT ["/bin/bash", "-c", "python3 sovereign_bridge.py && exec python3 api.py"]

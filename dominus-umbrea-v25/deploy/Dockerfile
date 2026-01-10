# Dockerfile para el Backend de Flask (Google Cloud Run)
FROM python:3.9-slim

# Directorio de trabajo
WORKDIR /usr/src/app

# Copiar archivos de dependencias
COPY backend/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copiar el código de la aplicación
COPY backend/ ./

# Comando para ejecutar la aplicación
CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:8080", "app:app"]

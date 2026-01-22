@echo off
title [ DOMINUS UMBREA // SYSTEM INTEGRITY ]
color 0b

:: --- FASE 0: VERIFICACIÓN DE JERARQUÍA (ADMIN) ---
net session >nul 2>&1
if %errorLevel% == 0 (
    echo [ ACCESO ROOT CONFIRMADO: PERMISOS CONCEDIDOS ]
) else (
    echo [!] SOLICITANDO ELEVACION DE PRIVILEGIOS...
    echo     El sistema requiere confirmacion administrativa.
    powershell -Command "Start-Process '%~0' -Verb RunAs"
    exit /b
)

:: --- FASE 1: INYECCIÓN DEL PROTOCOLO ---
set "SCRIPT_PATH=%~dp0installer_core.ps1"

echo.
echo ========================================================
echo   INICIANDO PROTOCOLO DE DESPLIEGUE: DOMINUS UMBREA
echo ========================================================
echo.
echo [1] Bypass de politicas de ejecucion... ACTIVO.
echo [2] Cargando nucleo logico (PowerShell)...
echo.

:: Ejecuta el script PS1 saltándose las restricciones de Windows
powershell -NoProfile -ExecutionPolicy Bypass -File "%SCRIPT_PATH%"

echo.
echo ========================================================
echo   OPERACION FINALIZADA. PRESIONE CUALQUIER TECLA.
echo ========================================================
pause >nul

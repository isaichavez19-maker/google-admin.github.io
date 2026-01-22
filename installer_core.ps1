param(
    [string]$InstallPath = "$env:LOCALAPPDATA\DominusUmbrea",
    [string]$RepoSource = $PSScriptRoot
)

# --- SISTEMA DE LOGS VISUALES ---
function Log-System ($type, $msg) {
    switch ($type) {
        "INFO" { Write-Host " [INFO] $msg" -ForegroundColor Cyan }
        "OK"   { Write-Host "  [OK]  $msg" -ForegroundColor Green }
        "WARN" { Write-Host " [WARN] $msg" -ForegroundColor Yellow }
        "FAIL" { Write-Host " [FAIL] $msg" -ForegroundColor Red }
    }
}

Write-Host "`n=== CARGANDO PROTOCOLO OMEGA v5.0 ===`n" -ForegroundColor Magenta

# --- FASE 1: SALVAGUARDA DEL TRONO (SEGURIDAD CRÍTICA) ---
$RutasProhibidas = @("C:\", "C:\Windows", "C:\Windows\System32", "C:\Program Files", "$env:SystemRoot")
foreach ($ruta in $RutasProhibidas) {
    if ($InstallPath -eq $ruta) {
        Log-System "FAIL" "VIOLACIÓN DE SEGURIDAD: INTENTO DE SOBRESCRIBIR $ruta"
        exit 99
    }
}

# --- FASE 2: PURGA Y PREPARACIÓN ---
Log-System "INFO" "Escaneando sector de despliegue: $InstallPath"
if (Test-Path $InstallPath) {
    Log-System "WARN" "Estructura antigua detectada. Purgando..."
    try {
        Remove-Item $InstallPath -Recurse -Force -ErrorAction Stop
        Log-System "OK" "Sector limpiado."
    } catch {
        Log-System "FAIL" "Error al limpiar. Cierre la aplicación y reintente."
        exit 1
    }
}
New-Item -ItemType Directory -Path $InstallPath -Force | Out-Null
Log-System "OK" "Infraestructura creada."

# --- FASE 3: GÉNESIS DEL ENTORNO (PYTHON VENV) ---
Log-System "INFO" "Verificando motor Python..."
try {
    $null = Get-Command python -ErrorAction Stop
    Log-System "OK" "Motor Python detectado."
} catch {
    Log-System "FAIL" "Python no está instalado o no está en el PATH."
    exit 1
}

Log-System "INFO" "Construyendo matriz de aislamiento (VENV)..."
python -m venv "$InstallPath\venv"
if (-not (Test-Path "$InstallPath\venv\Scripts\python.exe")) {
    Log-System "FAIL" "Fallo crítico al crear VENV."
    exit 1
}

# --- FASE 4: INYECCIÓN DE DEPENDENCIAS ---
$ReqFile = "$RepoSource\requirements.txt"
if (Test-Path $ReqFile) {
    Log-System "INFO" "Asimilando librerías..."
    & "$InstallPath\venv\Scripts\python.exe" -m pip install --upgrade pip | Out-Null
    & "$InstallPath\venv\Scripts\pip.exe" install -r "$ReqFile" --no-warn-script-location | Out-Null
    Log-System "OK" "Dependencias instaladas."
} else {
    Log-System "WARN" "No se detectó requirements.txt. Omitiendo fase 4."
}

# --- FASE 5: TRANSFERENCIA DE ARCHIVOS ---
Log-System "INFO" "Migrando código fuente..."
# Copia el contenido de beta_files a la raíz de instalación
$SourcePath = "$RepoSource\beta_files"
if (Test-Path $SourcePath) {
    Get-ChildItem -Path $SourcePath | Copy-Item -Destination $InstallPath -Recurse -Force
    Log-System "OK" "Datos transferidos."
} else {
    Log-System "WARN" "Carpeta 'beta_files' no encontrada. Se copió la raíz."
    Get-ChildItem -Path $RepoSource -Exclude ".git",".vscode","venv","*.bat","*.ps1" | Copy-Item -Destination $InstallPath -Recurse -Force
}

# --- FASE 6: LA ILUSIÓN LOCAL (PHANTOM METHOD) ---
Log-System "INFO" "Configurando DNS Fantasma (dominus.umbrea)..."
$HostsPath = "$env:SystemRoot\System32\drivers\etc\hosts"
try {
    if (Test-Path $HostsPath) {
        # Backup
        Copy-Item $HostsPath "$HostsPath.bak" -Force

        # Verificar si ya existe
        if (-not (Select-String -Path $HostsPath -Pattern "dominus.umbrea" -SimpleMatch)) {
            Add-Content -Path $HostsPath -Value "`r`n127.0.0.1`tdominus.umbrea # PROYECTO DOMINUS" -Force
            Log-System "OK" "Dominio local inyectado."
        } else {
            Log-System "OK" "Dominio ya existente."
        }
    } else {
        Log-System "WARN" "Archivo HOSTS no encontrado."
    }
} catch {
    Log-System "FAIL" "No se pudo modificar HOSTS (¿Faltan permisos Admin?)."
}

# --- FASE 7: ENLACE NEURONAL (ACCESO DIRECTO) ---
Log-System "INFO" "Forjando acceso directo..."
$WshShell = New-Object -comObject WScript.Shell
$Shortcut = $WshShell.CreateShortcut("$env:USERPROFILE\Desktop\Dominus Umbrea.lnk")
$Shortcut.TargetPath = "$InstallPath\venv\Scripts\pythonw.exe"
$Shortcut.Arguments = """$InstallPath\main.py"""
$Shortcut.WorkingDirectory = $InstallPath
$Shortcut.Description = "Iniciar Dominus Umbrea"
if (Test-Path "$InstallPath\assets\icon.ico") {
    $Shortcut.IconLocation = "$InstallPath\assets\icon.ico"
}
$Shortcut.Save()
Log-System "OK" "Enlace establecido en el Escritorio."

Write-Host "`n[ SISTEMA ESTABLECIDO CON ÉXITO ]" -ForegroundColor Green

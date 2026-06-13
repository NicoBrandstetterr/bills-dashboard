@echo off
REM run-dev.bat — Inicia Backend y Frontend en nuevas ventanas y abre el navegador
setlocal
REM Obtener el directorio del script (sin barra final)
set "SCRIPT_DIR=%~dp0"
if "%SCRIPT_DIR:~-1%"=="\" set "SCRIPT_DIR=%SCRIPT_DIR:~0,-1%"

set "BACKEND_DIR=%SCRIPT_DIR%\Backend"
set "FRONTEND_DIR=%SCRIPT_DIR%\Frontend"

echo Iniciando servicios desde %SCRIPT_DIR%

REM Iniciar backend en una ventana nueva
if exist "%BACKEND_DIR%\backend-start.bat" (
  start "Backend" /D "%BACKEND_DIR%" cmd /k "backend-start.bat"
) else if exist "%BACKEND_DIR%\manage.py" (
  start "Backend" /D "%BACKEND_DIR%" cmd /k "python manage.py runserver 8000"
) else (
  echo Backend no encontrado en "%BACKEND_DIR%"; omitiendo backend.
)

REM Iniciar frontend en una ventana nueva
if exist "%FRONTEND_DIR%\frontend-start.bat" (
  start "Frontend" /D "%FRONTEND_DIR%" cmd /k "frontend-start.bat"
) else if exist "%FRONTEND_DIR%\package.json" (
  start "Frontend" /D "%FRONTEND_DIR%" cmd /k "npm run dev"
) else (
  echo Frontend no encontrado en "%FRONTEND_DIR%"; omitiendo frontend.
)

REM Esperar y abrir el navegador en la URL por defecto de Vite (5173)
echo Esperando unos segundos para que arranque el frontend...
timeout /t 6 /nobreak >nul
start "" "http://localhost:5173"

echo Servicios lanzados en ventanas separadas.
echo Esta ventana permanecerá abierta. Presiona cualquier tecla para cerrar.
pause >nul

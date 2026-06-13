@echo off
REM backend-start.bat — activa entorno virtual si existe y arranca Django
cd /d "%~dp0"
REM Activar virtualenv si existe
if exist "venv\Scripts\activate.bat" (
  call "venv\Scripts\activate.bat"
) else if exist ".venv\Scripts\activate.bat" (
  call ".venv\Scripts\activate.bat"
)
python manage.py runserver 8000

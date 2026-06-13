@echo off
REM frontend-start.bat — instala deps si hace falta y arranca Vite
cd /d "%~dp0"
if not exist "node_modules" (
  echo node_modules no encontrado — instalando dependencias...
  npm install
)
npm run dev

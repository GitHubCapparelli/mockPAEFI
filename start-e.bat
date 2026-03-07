@echo off
REM Certifique-se de ter o utilitário 'tee' instalado e disponível no PATH.
REM Em um terminal Power Shell, com privilégios de administrador, execute:
REM choco install grep

set ROOT=C:\.Capparelli\Work\hosted\SEDES\gervis\poc\PAEFI\mockPAEFI
set DOMAIN=demiurgic-london-postepileptic.ngrok-free.dev
set LOG=%ROOT%\logs

if not exist %LOG% mkdir %LOG%

echo Iniciando servicos...

:: Janela 1 — API (canto superior esquerdo)
start "mockPAEFI | API" cmd /k ^
    "mode con: cols=80 lines=20 && ^
     cd /d %ROOT%\packages\api && ^
     npm run dev 2>&1 | tee %LOG%\api.log"

timeout /t 4 /nobreak > nul

:: Janela 2 — ngrok (canto superior direito)
start "mockPAEFI | ngrok" cmd /k ^
    "mode con: cols=80 lines=20 && ^
     ngrok http --domain=%DOMAIN% 3001 2>&1 | tee %LOG%\ngrok.log"

timeout /t 6 /nobreak > nul

:: Janela 3 — Status (esta janela)
cls
echo ============================================
echo  mockPAEFI ^| Status
echo ============================================
echo.
echo [%date% %time%] Verificando API publica...
echo.
curl -s https://%DOMAIN%/health
echo.
echo.
echo [%date% %time%] Sistema no ar.
echo.
echo  API local  : http://localhost:3001/health
echo  API publica: https://%DOMAIN%/health
echo.
echo ============================================
echo  Use stop.bat para encerrar os servicos.
echo ============================================
pause

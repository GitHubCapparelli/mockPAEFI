@echo off
set ROOT=C:\.Capparelli\Work\hosted\SEDES\gervis\poc\PAEFI\mockPAEFI
set DOMAIN=demiurgic-london-postepileptic.ngrok-free.dev

echo ============================================
echo  mockPAEFI - Iniciando servicos
echo ============================================
echo.
echo [1/3] Iniciando API...
cd /d %ROOT%\packages\api
start /b cmd /c "npm run dev > %ROOT%\logs\api.log 2>&1"

echo [2/3] Iniciando ngrok...
start /b cmd /c "ngrok http --url=%DOMAIN% 3001 > %ROOT%\logs\ngrok.log 2>&1"

echo [3/3] Aguardando servicos...
timeout /t 6 /nobreak > nul

echo.
echo Verificando status...
echo.
curl -s https://%DOMAIN%/health
echo.
echo.
echo ============================================
echo  Sistema no ar!
echo.
echo  Local   : http://localhost:3001/health
echo  Publico : https://%DOMAIN%/health
echo.
echo ============================================
echo [%date% %time%] 
echo.
pause
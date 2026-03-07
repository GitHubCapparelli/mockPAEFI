@echo off
set ROOT=C:\.Capparelli\Work\hosted\SEDES\gervis\poc\PAEFI\mockPAEFI
set DOMAIN=demiurgic-london-postepileptic.ngrok-free.dev

echo ============================================
echo  mockPAEFI - Iniciando API
echo ============================================
echo.
echo [1/3] Iniciando serviços...
cd /d %ROOT%\packages\api
start /b cmd /c "npm run dev > %ROOT%\logs\api.log 2>&1"
start /b cmd /c "ngrok http --url=%DOMAIN% 3001 > %ROOT%\logs\ngrok.log 2>&1"

echo [2/3] Aguardando servicos...
timeout /t 6 /nobreak > nul

echo [3/3] Verificando status...
curl -s https://%DOMAIN%/health
echo.
echo.
echo ============================================
echo  Serviços iniciados com sucesso! 
echo  Acesso seguro.
echo.
echo  Local   : http://localhost:3001/health
echo  Publico : https://%DOMAIN%/health
echo.
echo ============================================
echo Logs em %ROOT%\logs\
echo [%date% %time%] 
pause
@echo off
set ROOT=C:\.Capparelli\Work\hosted\SEDES\gervis\poc\PAEFI\mockPAEFI
set DOMAIN=demiurgic-london-postepileptic.ngrok-free.dev

echo Iniciando API...
start "mockPAEFI API" cmd /k "cd /d %ROOT%\packages\api && npm run dev"

echo Aguardando API subir...
timeout /t 4 /nobreak > nul

echo Iniciando ngrok com dominio fixo...
start "ngrok tunnel" cmd /k "ngrok http --domain=%DOMAIN% 3001"

echo Aguardando ngrok conectar...
timeout /t 5 /nobreak > nul

echo.
echo Verificando status...
echo.
curl -s https://%DOMAIN%/health
echo.
echo.
echo Sistema no ar!
echo API local   : http://localhost:3001/health
echo API publica : https://%DOMAIN%/health
echo.
pause
@echo off
chcp 65001 > nul
set ROOT=C:\.Capparelli\Work\hosted\SEDES\gervis\poc\PAEFI\mockPAEFI
set DOMAIN=demiurgic-london-postepileptic.ngrok-free.dev

echo ============================================
echo  mockPAEFI - Iniciando Serviços
echo ============================================
echo.
cd /d %ROOT%\packages\api

:: [1/3] 
<nul set /p="[1/3] Iniciando API"
start /b cmd /c "npm run dev > %ROOT%\logs\api.log 2>&1"
for /l %%x in (1, 1, 3) do (
    <nul set /p="."
    timeout /t 1 /nobreak > nul
)
echo.

:: Verificando se a API iniciou corretamente
findstr /C:"ERR_MODULE_NOT_FOUND" "%ROOT%\logs\api.log" > nul
if %errorlevel% equ 0 (
    echo [ERRO] A API falhou ao iniciar - Modulo nao encontrado.
    echo Abrindo log...
    start notepad "%ROOT%\logs\api.log"
    pause
    exit /b
)

:: [2/3]
<nul set /p="[2/3] Iniciando tunel (seguro)"
start /b cmd /c "ngrok http --url=%DOMAIN% 3001 > %ROOT%\logs\ngrok.log 2>&1"
for /l %%x in (1, 1, 3) do (
    <nul set /p="."
    timeout /t 1 /nobreak > nul
)
echo.

echo [3/3] Verificando status...
curl -s https://%DOMAIN%/health
echo.
echo.
echo ============================================
echo  Serviços iniciados com sucesso! 
echo  Acesso seguro.
echo.
echo  Local   : http://localhost:3001/health
echo  Público : https://%DOMAIN%/health
echo.
echo ============================================
echo Logs em %ROOT%\logs\
echo.
echo [%date% %time%] 
pause
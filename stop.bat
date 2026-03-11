@echo off
chcp 65001 > nul
echo ============================================
echo  mockPAEFI - Encerrando serviços
echo ============================================
echo.
echo Fechando tunel...
taskkill /f /im ngrok.exe > nul 2>&1
echo Finalizando APIs...
taskkill /f /im node.exe > nul 2>&1
echo.
echo Serviços encerrados.
echo ============================================
echo [%date% %time%] 
echo.
pause
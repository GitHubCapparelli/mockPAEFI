@echo off
echo ============================================
echo  mockPAEFI - Parando servicos
echo ============================================
echo.
echo Parando API (node)...
taskkill /f /im node.exe > nul 2>&1
echo Parando ngrok...
taskkill /f /im ngrok.exe > nul 2>&1
echo.
echo Servicos encerrados.
echo ============================================
pause
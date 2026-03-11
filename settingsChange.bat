@echo off
chcp 65001 >nul
echo ============================================================
echo  mockPAEFI ^| settingsChange.bat
echo  Desabilita hibernação, oculta barra de tarefas e ícones.
echo  Execute como Administrador.
echo ============================================================
echo.
echo Configurando o comporamento do sistema...
:: --- Configurações de Energia ---
powercfg /hibernate off
powercfg /change monitor-timeout-ac 0
powercfg /change standby-timeout-ac 0
powercfg /setacvalueindex SCHEME_CURRENT 19caa947-efe9-4728-8702-b53b5dc2a5ab 12bbebe6-58d6-4636-95bb-3217ef867c1a 2
powercfg /setactive SCHEME_CURRENT
echo Hibernação e Suspensão      : DESATIVADAS

:: --- Ocultar Barra de Tarefas (Auto-hide) ---
reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\Explorer\StuckRects3" /v Settings /t REG_BINARY /d 30000000feffffff03000000030000003e000000280000000000000000000000f0070000f0030000fffffffff0070000f0030000 /f >nul
echo Barra de Tarefas            : OCULTA

:: --- Ocultar Ícones da Área de Trabalho ---
reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced" /v HideIcons /t REG_DWORD /d 1 /f >nul
echo Ícones da Área de Trabalho  : OCULTOS

:: --- Reiniciar Explorer para aplicar mudanças visuais ---
echo.
echo Reiniciando o Explorer para aplicar as mudanças visuais...
taskkill /f /im explorer.exe >nul
start explorer.exe

echo.
echo [%date% %time%] Tudo pronto!
echo O sistema não irá suspender, e a área de trabalho está vazia.
echo.
pause
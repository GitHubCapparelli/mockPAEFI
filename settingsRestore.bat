@echo off
chcp 65001 >nul
echo ============================================================
echo  mockPAEFI ^| settingsRestore.bat
echo  Execute como Administrador.
echo  Restaura configurações padrão de energia, barra e ícones.
echo ============================================================
echo.
echo Restaurando configurações padrão do sistema...
echo.
:: --- Restaurar Energia ---
powercfg /hibernate on
powercfg /change monitor-timeout-ac 15
powercfg /change standby-timeout-ac 30
powercfg /setacvalueindex SCHEME_CURRENT 19caa947-efe9-4728-8702-b53b5dc2a5ab 12bbebe6-58d6-4636-95bb-3217ef867c1a 0
powercfg /setactive SCHEME_CURRENT
echo Hibernação e Suspensão     : RESTAURADAS

:: --- Mostrar Barra de Tarefas ---
reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\Explorer\StuckRects3" /v Settings /t REG_BINARY /d 30000000feffffff02000000030000003e000000280000000000000000000000f0070000f0030000fffffffff0070000f0030000 /f >nul
echo Barra de Tarefas           : VISÍVEL

:: --- Mostrar Ícones da Área de Trabalho ---
reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced" /v HideIcons /t REG_DWORD /d 0 /f >nul
echo Ícones da Área de Trabalho : VISÍVEIS

:: --- Reiniciar Explorer para aplicar mudanças visuais ---
echo.
echo Reiniciando o Explorer para aplicar as mudanças visuais...
taskkill /f /im explorer.exe >nul
start explorer.exe

echo.
echo [%date% %time%] Concluído. 
echo O Windows voltou ao comportamento normal.
pause
@echo off
set ROOT=C:\.Capparelli\Work\hosted\SEDES\gervis\poc\PAEFI\mockPAEFI

echo Iniciando API...
start "mockPAEFI API" cmd /k "cd /d %ROOT%\packages\api && npm run dev"

echo Aguardando API subir...
timeout /t 4 /nobreak > nul

echo Iniciando ngrok...
start "ngrok tunnel" cmd /k "ngrok http 3001"

echo Aguardando ngrok conectar...
timeout /t 5 /nobreak > nul

echo Obtendo URL do ngrok e atualizando api.config.json...
curl -s http://localhost:4040/api/tunnels > %TEMP%\ngrok.json
node -e "const f=require('fs');const d=JSON.parse(f.readFileSync('%TEMP%\\ngrok.json'));const url=d.tunnels.find(t=>t.proto==='https').public_url;f.writeFileSync('%ROOT%\\docs\\api.config.json',JSON.stringify({apiBase:url},null,2));console.log('URL: '+url);"

echo Fazendo push do api.config.json...
cd /d %ROOT%
git add docs/api.config.json
git commit -m "chore: update ngrok URL"
git push origin main

echo.
echo Sistema PAEFI no ar! 
echo Pressione qualquer tecla para fechar.
pause
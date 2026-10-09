# 改了網頁程式(trade-tracker-mobile)後執行:重新打包網頁,並重建桌面 App 的 web 容器。
$ErrorActionPreference = 'Stop'
$root = Split-Path $PSScriptRoot -Parent

Push-Location (Join-Path $root 'trade-tracker-mobile')
try { npx expo export -p web; if ($LASTEXITCODE -ne 0) { throw 'expo export 失敗' } }
finally { Pop-Location }

$docker = (Get-Command docker -ErrorAction SilentlyContinue).Source
if (-not $docker) { $docker = "$env:LOCALAPPDATA\Programs\DockerDesktop\resources\bin\docker.exe" }
& $docker compose -f (Join-Path $root 'infra\docker-compose.yml') up -d --build web
if ($LASTEXITCODE -ne 0) { throw 'docker compose 失敗' }
Write-Output '完成:重新開啟協定追蹤即可看到新版。'

# 協定追蹤:開啟桌面 App(由桌面捷徑透過 launch.vbs 呼叫,不會跳出黑色視窗)
#
# 1. 確認 http://localhost:8080 有回應;沒有的話啟動 Docker Desktop 並等待(最多約 3 分鐘)
# 2. 用 Edge 的 App 模式開啟(獨立視窗、沒有網址列)
#
#   -CheckOnly  只檢查與啟動 Docker,不開視窗(測試用)
param([switch]$CheckOnly)

$url = 'http://localhost:8080'

function Test-App {
    try { return (Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 3).StatusCode -eq 200 }
    catch { return $false }
}

function Show-Message([string]$text) {
    Add-Type -AssemblyName PresentationFramework
    [void][System.Windows.MessageBox]::Show($text, '協定追蹤')
}

if (-not (Test-App)) {
    $candidates = @(
        "$env:LOCALAPPDATA\Programs\DockerDesktop\Docker Desktop.exe",
        "$env:ProgramFiles\Docker\Docker\Docker Desktop.exe"
    )
    $docker = $candidates | Where-Object { Test-Path $_ } | Select-Object -First 1
    if (-not $docker) {
        Show-Message '找不到 Docker Desktop。請先安裝並啟動 Docker Desktop,再開啟協定追蹤。'
        exit 1
    }
    if (-not (Get-Process -Name 'Docker Desktop' -ErrorAction SilentlyContinue)) {
        Start-Process -FilePath $docker
    }
    for ($i = 0; $i -lt 90 -and -not (Test-App); $i++) { Start-Sleep -Seconds 2 }
    if (-not (Test-App)) {
        Show-Message "Docker 已啟動,但協定追蹤沒有回應。`n請開啟 Docker Desktop 確認 trade-tracker 的 web 容器是否在執行。"
        exit 1
    }
}

if ($CheckOnly) { Write-Output 'ok'; exit 0 }

$edge = @(
    "${env:ProgramFiles(x86)}\Microsoft\Edge\Application\msedge.exe",
    "$env:ProgramFiles\Microsoft\Edge\Application\msedge.exe"
) | Where-Object { Test-Path $_ } | Select-Object -First 1
if ($edge) {
    Start-Process -FilePath $edge -ArgumentList "--app=$url", '--window-size=1440,900'
} else {
    Start-Process $url   # 沒有 Edge:用預設瀏覽器開啟
}

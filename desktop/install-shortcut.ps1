# 在桌面建立「協定追蹤」捷徑(雙擊開啟桌面 App)。重複執行會覆蓋同名捷徑。
$desktop = [Environment]::GetFolderPath('Desktop')
$link = Join-Path $desktop '協定追蹤.lnk'
$shell = New-Object -ComObject WScript.Shell
$s = $shell.CreateShortcut($link)
$s.TargetPath = Join-Path $env:WINDIR 'System32\wscript.exe'
$s.Arguments = '"' + (Join-Path $PSScriptRoot 'launch.vbs') + '"'
$s.WorkingDirectory = $PSScriptRoot
$s.IconLocation = (Join-Path $PSScriptRoot 'app.ico') + ',0'
$s.Description = '協定追蹤:全球貿易協定追蹤工具(只在本機執行)'
$s.Save()
Write-Output "已建立:$link"

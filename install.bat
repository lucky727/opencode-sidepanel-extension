@echo off
setlocal
echo OpenCode Side Panel - Brave installer
echo.
set /p EXTID="Enter the extension ID from brave://extensions: "
if "%EXTID%"=="" (
  echo Extension ID required.
  exit /b 1
)

set "HOSTDIR=%~dp0"
set "HOSTBAT=%HOSTDIR%host.bat"
set "MANIFEST=%HOSTDIR%com.opencode.sidepanel.json"

powershell -NoProfile -Command ^
  "$m = Get-Content '%MANIFEST%' -Raw; ^
   $m = $m -replace 'HOST_PATH_PLACEHOLDER', '%HOSTBAT:\=\\%'; ^
   $m = $m -replace 'EXTENSION_ID_PLACEHOLDER', '%EXTID%'; ^
   Set-Content -Path '%MANIFEST%' -Value $m -NoNewline"

REM Register native messaging host for Brave (and Chrome fallback)
reg add "HKCU\Software\BraveSoftware\Brave-Browser\NativeMessagingHosts\com.opencode.sidepanel" /ve /t REG_SZ /d "%MANIFEST%" /f >nul
reg add "HKCU\Software\Google\Chrome\NativeMessagingHosts\com.opencode.sidepanel" /ve /t REG_SZ /d "%MANIFEST%" /f >nul

echo.
echo Registered native messaging host for Brave.
echo Next: open brave://extensions, enable Developer mode, click "Load unpacked",
echo and select this folder: %HOSTDIR%
echo Then click the OpenCode toolbar icon to open the Side Panel.
pause
@echo off
setlocal
echo === OpenCode Side Panel - Auto Setup ===
echo.

REM Check Node.js
where node >nul 2>&1
if errorlevel 1 (
  echo [ERROR] Node.js not found. Install from https://nodejs.org and re-run.
  pause & exit /b 1
)
for /f "delims=" %%v in ('node --version') do echo Node.js: %%v

REM Check OpenCode
where opencode >nul 2>&1
if errorlevel 1 (
  echo [WARN] opencode not found on PATH. Install OpenCode first.
) else (
  for /f "delims=" %%v in ('opencode --version') do echo OpenCode: %%v
)

echo.
set /p EXTID="Enter the Extension ID from brave://extensions (load unpacked first): "
if "%EXTID%"=="" (
  echo Extension ID required.
  pause & exit /b 1
)

REM Register native host
set "HOSTDIR=%~dp0"
set "HOSTBAT=%HOSTDIR%host.bat"
set "MANIFEST=%HOSTDIR%com.opencode.sidepanel.json"

powershell -NoProfile -Command ^
  "$m = Get-Content '%MANIFEST%' -Raw; ^
   $m = $m -replace 'HOST_PATH_PLACEHOLDER', '%HOSTBAT:\=\\%'; ^
   $m = $m -replace 'EXTENSION_ID_PLACEHOLDER', '%EXTID%'; ^
   Set-Content -Path '%MANIFEST%' -Value $m -NoNewline" 2>nul

REM If placeholders already replaced (re-run), rewrite cleanly
node -e "
const fs=require('fs');
const id='%EXTID%';
const p='%MANIFEST:\=/%';
const obj={name:'com.opencode.sidepanel',description:'OpenCode Side Panel native messaging host',path:'%HOSTBAT:\=/%'.replace(/\\\\/g,'\\\\'),type:'stdio',allowed_origins:['chrome-extension://'+id+'/']};
fs.writeFileSync(p,JSON.stringify(obj,null,2));
"

reg add "HKCU\Software\BraveSoftware\Brave-Browser\NativeMessagingHosts\com.opencode.sidepanel" /ve /t REG_SZ /d "%MANIFEST%" /f >nul
reg add "HKCU\Software\Google\Chrome\NativeMessagingHosts\com.opencode.sidepanel" /ve /t REG_SZ /d "%MANIFEST%" /f >nul

echo.
echo [OK] Native messaging host registered.
echo.
echo Next steps:
echo   1. Open brave://extensions and click the OpenCode toolbar icon to open the Side Panel.
echo   2. If OpenCode is not running, start it: opencode serve --port 4096 --hostname 127.0.0.1
echo.
pause
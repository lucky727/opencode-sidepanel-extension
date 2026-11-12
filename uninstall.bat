@echo off
reg delete "HKCU\Software\BraveSoftware\Brave-Browser\NativeMessagingHosts\com.opencode.sidepanel" /f >nul 2>&1
reg delete "HKCU\Software\Google\Chrome\NativeMessagingHosts\com.opencode.sidepanel" /f >nul 2>&1
echo Native messaging host unregistered.
echo Remove the unpacked extension from brave://extensions manually.
pause
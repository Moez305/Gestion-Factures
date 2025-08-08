@echo off
title Create Desktop Shortcut

echo ========================================
echo    Creating Desktop Shortcut
echo ========================================
echo.

REM Get the current directory (where this script is located)
set "SCRIPT_DIR=%~dp0"
set "PROJECT_NAME=Client Billing App"

REM Create the shortcut on desktop
echo Creating desktop shortcut...
echo.

REM Create VBS script to create shortcut
echo Set oWS = WScript.CreateObject("WScript.Shell") > "%TEMP%\CreateShortcut.vbs"
echo sLinkFile = "%USERPROFILE%\Desktop\%PROJECT_NAME%.lnk" >> "%TEMP%\CreateShortcut.vbs"
echo Set oLink = oWS.CreateShortcut(sLinkFile) >> "%TEMP%\CreateShortcut.vbs"
echo oLink.TargetPath = "%SCRIPT_DIR%start-app.bat" >> "%TEMP%\CreateShortcut.vbs"
echo oLink.WorkingDirectory = "%SCRIPT_DIR%" >> "%TEMP%\CreateShortcut.vbs"
echo oLink.Description = "Start Client Billing Application" >> "%TEMP%\CreateShortcut.vbs"
echo oLink.IconLocation = "%SCRIPT_DIR%start-app.bat,0" >> "%TEMP%\CreateShortcut.vbs"
echo oLink.Save >> "%TEMP%\CreateShortcut.vbs"

REM Run the VBS script
cscript //nologo "%TEMP%\CreateShortcut.vbs"

REM Clean up
del "%TEMP%\CreateShortcut.vbs"

echo.
echo ========================================
echo    Shortcut Created Successfully!
echo ========================================
echo.
echo A shortcut called "%PROJECT_NAME%" has been created on your desktop.
echo.
echo You can now:
echo 1. Double-click the desktop shortcut to start the app
echo 2. Pin it to your Start Menu for easy access
echo 3. Pin it to your Taskbar
echo.
echo The shortcut will automatically:
echo - Check if Docker is running
echo - Start the application
echo - Open your browser to the app
echo.
pause

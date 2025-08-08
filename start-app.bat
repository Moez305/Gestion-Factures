@echo off
title Client Billing Application

echo ========================================
echo    Client Billing Application
echo ========================================
echo.

REM Check if Docker is running
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Docker Desktop is not running!
    echo.
    echo Please start Docker Desktop first, then try again.
    echo.
    pause
    exit /b 1
)

echo Starting the application...
echo This may take a few minutes on first run.
echo.

REM Navigate to the script directory
cd /d "%~dp0"

REM Start the application
docker-compose up --build -d

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo    Application Started Successfully!
    echo ========================================
    echo.
    echo Opening your browser...
    echo.
    echo If the browser doesn't open automatically,
    echo go to: http://localhost:3000
    echo.
    
    REM Wait a moment for services to fully start
    timeout /t 5 /nobreak >nul
    
    REM Open the application in default browser
    start http://localhost:3000
    
    echo Application is running!
    echo.
    echo To stop the application, run: docker-stop.bat
    echo.
    pause
) else (
    echo.
    echo ERROR: Failed to start the application!
    echo.
    echo Please check:
    echo 1. Docker Desktop is running
    echo 2. No other applications are using ports 3000, 5000, or 3306
    echo 3. You have enough disk space
    echo.
    pause
)

@echo off
echo ========================================
echo Client Billing App Setup Script
echo ========================================
echo.

echo Checking if Node.js is installed...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)
echo ✓ Node.js is installed

echo.
echo Checking if MySQL is accessible...
mysql --version >nul 2>&1
if %errorlevel% neq 0 (
    echo WARNING: MySQL command not found in PATH
    echo.
    echo Please install MySQL using one of these options:
    echo 1. MySQL Installer: https://dev.mysql.com/downloads/installer/
    echo 2. XAMPP: https://www.apachefriends.org/
    echo 3. Docker: docker run --name mysql-billing -e MYSQL_ROOT_PASSWORD=password -e MYSQL_DATABASE=client_billing_db -p 3306:3306 -d mysql:8.0
    echo.
    echo After installation, make sure to:
    echo - Add MySQL to your system PATH
    echo - Create the database: CREATE DATABASE client_billing_db;
    echo.
    pause
) else (
    echo ✓ MySQL is accessible
)

echo.
echo Installing dependencies...
call npm run install-all
if %errorlevel% neq 0 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)
echo ✓ Dependencies installed

echo.
echo Creating .env file...
if not exist "server\.env" (
    echo Creating server\.env file...
    (
        echo DB_HOST=localhost
        echo DB_USER=root
        echo DB_PASSWORD=your_mysql_password
        echo DB_NAME=client_billing_db
        echo DB_PORT=3306
        echo PORT=5000
    ) > server\.env
    echo ✓ Created server\.env file
    echo.
    echo IMPORTANT: Please edit server\.env and update DB_PASSWORD with your MySQL password
) else (
    echo ✓ .env file already exists
)

echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Edit server\.env and set your MySQL password
echo 2. Make sure MySQL is running
echo 3. Run: npm run dev
echo.
echo The application will be available at:
echo - Frontend: http://localhost:3000
echo - Backend: http://localhost:5000
echo.
pause 
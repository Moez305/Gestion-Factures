@echo off
title Starting Docker Application...

echo Building and starting the application with Docker Compose...
echo.

REM Build and start all services
docker-compose up --build -d

echo.
echo Application is starting up...
echo.
echo Services:
echo - Frontend: http://localhost:3000
echo - Backend API: http://localhost:5000
echo - Database: localhost:3306
echo.
echo To view logs: docker-compose logs -f
echo To stop: docker-compose down
echo.

pause

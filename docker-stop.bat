@echo off
title Stopping Docker Application...

echo Stopping all Docker services...
echo.

REM Stop and remove all services
docker-compose down

echo.
echo All services have been stopped and removed.
echo.

pause

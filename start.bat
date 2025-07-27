@echo off
echo Starting BookRead AI Application...
echo.

echo Starting Backend Server...
start "Backend Server" cmd /k "cd server && npm start"

echo Waiting for backend to start...
timeout /t 3 /nobreak > nul

echo Starting Frontend Development Server...
start "Frontend Server" cmd /k "cd client && npm run dev"

echo.
echo BookRead AI is starting up!
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Press any key to close this window...
pause > nul

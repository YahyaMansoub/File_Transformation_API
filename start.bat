@echo off
echo 🚀 Starting File Transformation API...
echo.

echo 📦 Starting Go Backend on :8080...
start "Go Backend" cmd /k "cd golang_Backend && go run cmd/api/main.go"

timeout /t 2 /nobreak >nul

echo ⚛️  Starting React Frontend on :3000...
start "React Frontend" cmd /k "cd React_Frontend && npm run dev"

echo.
echo ✅ Services started!
echo.
echo 📱 Open http://localhost:3000 in your browser
echo.
echo Close the terminal windows to stop the services.

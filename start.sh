#!/bin/bash

echo "🚀 Starting File Transformation API..."
echo ""

# Start backend
echo "📦 Starting Go Backend on :8080..."
cd golang_Backend
go run cmd/api/main.go &
BACKEND_PID=$!

# Wait a bit for backend to start
sleep 2

# Start frontend
echo "⚛️  Starting React Frontend on :3000..."
cd ../React_Frontend
npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ Services started!"
echo "   Backend PID: $BACKEND_PID"
echo "   Frontend PID: $FRONTEND_PID"
echo ""
echo "📱 Open http://localhost:3000 in your browser"
echo ""
echo "Press Ctrl+C to stop both services..."

# Wait for Ctrl+C
trap "kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait

#!/bin/bash

# IZWI Development Startup Script

echo "🚀 Starting IZWI App..."
echo ""

# Check if server dependencies are installed
if [ ! -d "server/node_modules" ]; then
    echo "📦 Installing server dependencies..."
    cd server && npm install && cd ..
fi

# Check if frontend dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    npm install
fi

echo ""
echo "✅ Starting backend server on http://localhost:3001"
cd server && npm start &
SERVER_PID=$!

sleep 3

echo ""
echo "✅ Starting frontend dev server on http://localhost:5173"
cd ..
npm run dev &
FRONTEND_PID=$!

echo ""
echo "════════════════════════════════════════════"
echo "🎉 IZWI is running!"
echo "════════════════════════════════════════════"
echo "📱 Frontend: http://localhost:5173"
echo "🔧 Backend:  http://localhost:3001"
echo ""
echo "Press Ctrl+C to stop both servers"
echo "════════════════════════════════════════════"

# Wait for both processes
wait $SERVER_PID $FRONTEND_PID

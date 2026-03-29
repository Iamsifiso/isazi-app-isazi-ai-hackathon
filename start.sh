#!/bin/bash

# Start IZWI 3.0 - Frontend Only
echo "🚀 Starting IZWI 3.0..."

# Check if .env exists
if [ ! -f .env ]; then
    echo "❌ Error: .env file not found"
    echo "Please create .env from .env.example and add your API keys"
    exit 1
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Start frontend dev server
echo "🌐 Starting frontend on http://localhost:5173"
npm run dev

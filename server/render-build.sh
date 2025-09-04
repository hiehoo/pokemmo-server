#!/usr/bin/env bash
# Build script for Render
# This script runs during the build phase on Render

echo "🚀 Starting Render build process..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Create logs directory if needed
mkdir -p logs

echo "✅ Build completed successfully!"
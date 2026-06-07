#!/bin/bash

# Production Build & Deploy Script
# This script builds and prepares the application for production

set -e  # Exit on error

echo "🏗️  Missed-Opportunity Agent - Production Build"
echo "============================================="
echo ""

# Step 1: Verify Node.js
echo "✅ Checking Node.js version..."
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js 18+ is required. Current: $(node -v)"
    exit 1
fi
echo "   Node.js: $(node -v)"
echo ""

# Step 2: Check environment
echo "🔐 Checking environment configuration..."
if [ ! -f ".env.local" ] && [ -z "$GEMINI_API_KEY" ]; then
    echo "⚠️  Warning: GEMINI_API_KEY not found in .env.local or environment"
    echo "   The app will run in mock mode without API features"
fi
echo ""

# Step 3: Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf dist/ build/
echo "   ✅ Cleaned"
echo ""

# Step 4: Install dependencies
echo "📦 Installing dependencies..."
npm ci --omit=dev
echo "   ✅ Dependencies installed"
echo ""

# Step 5: TypeScript type check
echo "✔️  Running TypeScript type check..."
npm run typecheck || true
echo ""

# Step 6: Build
echo "🏗️  Building application..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi
echo "   ✅ Build complete"
echo ""

# Step 7: Verify build output
echo "✓ Verifying build output..."
if [ ! -d "dist" ]; then
    echo "❌ dist directory not found after build"
    exit 1
fi
echo "   ✅ Build artifacts verified"
echo ""

# Step 8: Display build info
echo "📊 Build Summary:"
echo "   Frontend: dist/index.html"
echo "   Server: dist/server.cjs"
DIST_SIZE=$(du -sh dist/ | cut -f1)
echo "   Total size: $DIST_SIZE"
echo ""

echo "✅ Build complete!"
echo ""
echo "🚀 To run in production:"
echo "   npm start"
echo ""
echo "📝 Environment variables needed:"
echo "   - GEMINI_API_KEY (optional for mock mode)"
echo "   - PORT (default: 3000)"
echo ""

#!/bin/bash

# Setup Script for Missed-Opportunity Agent
# This script handles local development setup

echo "🚀 Missed-Opportunity Agent - Development Setup"
echo "=================================================="
echo ""

# Step 1: Check Node.js
echo "✅ Checking Node.js installation..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ from https://nodejs.org"
    exit 1
fi
echo "   Node.js version: $(node -v)"
echo ""

# Step 2: Install dependencies
echo "📦 Installing dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi
echo "✅ Dependencies installed"
echo ""

# Step 3: Create .env.local if it doesn't exist
echo "🔐 Checking environment configuration..."
if [ ! -f ".env.local" ]; then
    echo "   Creating .env.local file..."
    cat > .env.local << 'EOF'
# Gemini API Configuration
GEMINI_API_KEY=your_gemini_api_key_here
PORT=3000
NODE_ENV=development
EOF
    echo "   ⚠️  Please update .env.local with your GEMINI_API_KEY"
    echo "   Get your key from: https://aistudio.google.com/app/apikey"
else
    echo "   ✅ .env.local already exists"
fi
echo ""

# Step 4: Verify TypeScript
echo "✔️  Running TypeScript type-check..."
npm run typecheck
if [ $? -ne 0 ]; then
    echo "⚠️  TypeScript errors found (non-blocking for dev)"
fi
echo ""

echo "✅ Setup complete!"
echo ""
echo "🎯 Next steps:"
echo "   1. Update .env.local with your GEMINI_API_KEY"
echo "   2. Run: npm run dev"
echo "   3. Open: http://localhost:3000"
echo ""

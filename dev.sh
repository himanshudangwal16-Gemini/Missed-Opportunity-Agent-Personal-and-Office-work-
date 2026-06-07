#!/bin/bash

# Development Start Script
# Runs the development server with hot reload

echo "🎯 Starting Missed-Opportunity Agent (Development Mode)"
echo "======================================================="
echo ""

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "⚠️  Warning: .env.local not found"
    echo "   Creating from template..."
    cat > .env.local << 'EOF'
GEMINI_API_KEY=your_gemini_api_key_here
PORT=3000
NODE_ENV=development
EOF
    echo "   ✅ Created .env.local"
    echo "   📝 Please update with your GEMINI_API_KEY"
    echo ""
fi

# Check for API key
if ! grep -q "GEMINI_API_KEY=" .env.local || grep "^GEMINI_API_KEY=your_gemini_api_key_here" .env.local > /dev/null; then
    echo "⚠️  GEMINI_API_KEY not configured in .env.local"
    echo "   App will run in mock mode"
    echo "   Get your key from: https://aistudio.google.com/app/apikey"
fi

echo ""
echo "📝 Starting server..."
echo "✅ Access at: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop"
echo ""

# Start dev server
npm run dev

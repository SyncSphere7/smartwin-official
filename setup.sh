#!/bin/bash

# Smart-Win Setup Script
# This script sets up your development environment

echo "🚀 Smart-Win Setup Starting..."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

echo "✓ Node.js version: $(node -v)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ npm install failed. Please check the errors above."
    exit 1
fi

echo "✓ Dependencies installed"
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "⚠️  .env.local not found. Creating from .env.example..."
    cp .env.example .env.local
    echo "✓ Created .env.local - Please edit this file with your credentials"
    echo ""
    echo "📝 You need to add:"
    echo "   - Supabase URL and keys"
    echo "   - Pesapal credentials"
    echo "   - OpenRouter API key"
    echo "   - Resend API key"
    echo ""
else
    echo "✓ .env.local exists"
    echo ""
fi

# Create node_modules if it doesn't exist
if [ ! -d "node_modules" ]; then
    echo "⚠️  node_modules not found"
else
    echo "✓ node_modules exists"
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit .env.local with your API credentials"
echo "2. Set up Supabase database (see DEPLOYMENT.md)"
echo "3. Run 'npm run dev' to start development server"
echo ""
echo "📚 Documentation:"
echo "   - README.md - Project overview"
echo "   - QUICKSTART.md - Local development guide"
echo "   - DEPLOYMENT.md - Production deployment guide"
echo ""

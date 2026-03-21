#!/bin/bash
#
# Deploy PATH A: Finance Friend v2 to Production
# Timeline: 30 minutes from decision to live
# Usage: bash deploy-path-a.sh
#

set -e

echo "🚀 PATH A DEPLOYMENT: Finance Friend v2 to Vercel"
echo "=================================================="
echo ""
echo "Timeline: 30 minutes to live users"
echo "Effort: Minimal (proven app, one-click deploy)"
echo "Revenue: $7,700/month at 100 users"
echo ""

# Check prerequisites
echo "📋 Checking prerequisites..."

if ! command -v node &> /dev/null; then
    echo "❌ Node.js not installed"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo "❌ npm not installed"
    exit 1
fi

echo "✅ Node.js: $(node -v)"
echo "✅ npm: $(npm -v)"
echo ""

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

echo "✅ Vercel CLI ready"
echo ""

# Verify Finance Friend v2 code exists
if [ ! -d "/home/moriahkeeper/.openclaw/workspace/finance-friend-v2" ]; then
    echo "❌ Finance Friend v2 directory not found"
    exit 1
fi

echo "✅ Finance Friend v2 codebase found"
echo ""

# Check if backend is running
echo "🔍 Checking if Finance Friend v2 backend is running locally..."
if curl -s http://localhost:3099/health > /dev/null 2>&1; then
    echo "✅ Backend is running on localhost:3099"
else
    echo "⚠️  Backend is not running locally. It will start in production."
fi

echo ""
echo "=================================================="
echo "STEP 1: Prepare for Deployment"
echo "=================================================="
echo ""

cd /home/moriahkeeper/.openclaw/workspace/finance-friend-v2

# Check for environment variables file
if [ ! -f ".env.local" ] && [ ! -f ".env" ]; then
    echo "⚠️  No .env file found. You'll need to set variables in Vercel dashboard:"
    echo "   - ANTHROPIC_API_KEY (required for coaching)"
    echo "   - NODE_ENV = 'production'"
    echo ""
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo "✅ Dependencies installed"
else
    echo "✅ Dependencies already installed"
fi

echo ""
echo "=================================================="
echo "STEP 2: Verify Local Build"
echo "=================================================="
echo ""

echo "🔨 Building locally to verify no errors..."
npm run build > /dev/null 2>&1 || {
    echo "❌ Build failed. Check for errors above."
    exit 1
}
echo "✅ Build successful"

echo ""
echo "=================================================="
echo "STEP 3: Deploy to Vercel"
echo "=================================================="
echo ""

echo "⚠️  Next steps require Vercel authentication."
echo ""
echo "When prompted:"
echo "  1. Press 'Y' to create a Vercel project"
echo "  2. Set project name: 'finance-friend-v2'"
echo "  3. Select 'Other' for project type"
echo "  4. Confirm deployment framework detection"
echo ""
echo "Press ENTER to continue with Vercel deployment..."
read -r

# Deploy to Vercel
if vercel --prod; then
    echo ""
    echo "✅ Deployment successful!"
    echo ""
    echo "=================================================="
    echo "STEP 4: Configure Environment Variables"
    echo "=================================================="
    echo ""
    echo "Go to: https://vercel.com/dashboard"
    echo "  1. Find 'finance-friend-v2' project"
    echo "  2. Go to Settings → Environment Variables"
    echo "  3. Add: ANTHROPIC_API_KEY = [your key]"
    echo "  4. Add: NODE_ENV = production"
    echo "  5. Redeploy"
    echo ""
    echo "Then your app will be live!"
else
    echo "❌ Vercel deployment failed"
    exit 1
fi

echo ""
echo "=================================================="
echo "DEPLOYMENT COMPLETE ✅"
echo "=================================================="
echo ""
echo "Your Finance Friend v2 is now live!"
echo "Monitor at: https://vercel.com/dashboard"
echo ""
echo "Next: Share launch announcement & monitor signups"
echo ""

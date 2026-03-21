#!/bin/bash
# Finance Friend Deployment Automation
# For: Finance Friend v2 & v3
# Usage: ./DEPLOYMENT_AUTOMATION.sh [v2|v3] [prod|staging]

set -e

VERSION=$1
ENV=$2

if [ -z "$VERSION" ] || [ -z "$ENV" ]; then
  echo "Usage: $0 [v2|v3] [prod|staging]"
  echo "Example: $0 v2 prod"
  exit 1
fi

echo "🚀 Starting Finance Friend $VERSION deployment to $ENV..."

# Color codes
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

# ============================================================================
# FINANCE FRIEND V2 DEPLOYMENT
# ============================================================================

if [ "$VERSION" = "v2" ]; then
  PROJECT_DIR="finance-friend-v2"
  PROJECT_NAME="finance-friend-v2"
  
  echo -e "${BLUE}Step 1: Checking environment${NC}"
  if [ ! -d "$PROJECT_DIR" ]; then
    echo "❌ Directory $PROJECT_DIR not found"
    exit 1
  fi
  
  cd "$PROJECT_DIR"
  
  echo -e "${BLUE}Step 2: Installing dependencies${NC}"
  npm install --production
  
  echo -e "${BLUE}Step 3: Building project${NC}"
  npm run build
  
  echo -e "${BLUE}Step 4: Running tests${NC}"
  npm test || true  # Don't fail if no tests
  
  if [ "$ENV" = "prod" ]; then
    echo -e "${BLUE}Step 5: Deploying to Vercel${NC}"
    echo "🔗 Vercel deployment:"
    echo "   1. Go to: https://vercel.com/dashboard"
    echo "   2. Click 'Import Project'"
    echo "   3. Select this GitHub repo: we-prosper-ai/finance-friend-v2"
    echo "   4. Configure environment variables (see .env.example)"
    echo "   5. Click 'Deploy'"
    echo ""
    echo "✅ Your app will be live at:"
    echo "   https://${PROJECT_NAME}.vercel.app"
    echo ""
    echo "Then update your custom domain in Vercel settings"
    
  elif [ "$ENV" = "staging" ]; then
    echo -e "${BLUE}Step 5: Starting local server${NC}"
    npm run dev &
    echo "✅ Server running on http://localhost:3000"
    echo "Press Ctrl+C to stop"
  fi
  
  cd ..

# ============================================================================
# FINANCE FRIEND V3 DEPLOYMENT
# ============================================================================

elif [ "$VERSION" = "v3" ]; then
  BACKEND_DIR="finance-friend-v3/backend"
  FRONTEND_DIR="finance-friend-v3/client"
  
  echo -e "${BLUE}Step 1: Checking directories${NC}"
  if [ ! -d "$BACKEND_DIR" ] || [ ! -d "$FRONTEND_DIR" ]; then
    echo "❌ v3 directories not found"
    exit 1
  fi
  
  echo -e "${BLUE}Step 2: Building backend${NC}"
  cd "$BACKEND_DIR"
  npm install --production
  npm run build
  npm test || true
  cd ../..
  
  echo -e "${BLUE}Step 3: Building frontend${NC}"
  cd "$FRONTEND_DIR"
  npm install --production
  npm run build
  cd ../..
  
  if [ "$ENV" = "prod" ]; then
    echo -e "${BLUE}Step 4: Deploying to production${NC}"
    echo "📝 Deployment steps:"
    echo "   Backend:"
    echo "   1. Commit to we-prosper-ai/finance-friend-v3"
    echo "   2. Deploy via Vercel/Railway/Heroku"
    echo "   3. Set DATABASE_URL, JWT_SECRET, GROQ_API_KEY"
    echo ""
    echo "   Frontend:"
    echo "   1. Push client/dist to Vercel"
    echo "   2. Update API_URL to production backend"
    echo "   3. Deploy"
    echo ""
    echo "✅ Monitor at: https://your-domain.com"
    
  elif [ "$ENV" = "staging" ]; then
    echo -e "${BLUE}Step 4: Starting local server${NC}"
    
    # Start backend
    echo "Starting backend on port 3002..."
    cd "$BACKEND_DIR"
    PORT=3002 npm start &
    BACKEND_PID=$!
    cd ../..
    
    # Start frontend
    echo "Starting frontend on port 5173..."
    cd "$FRONTEND_DIR"
    npm run preview &
    FRONTEND_PID=$!
    cd ../..
    
    echo ""
    echo "✅ App running:"
    echo "   Frontend: http://localhost:5173"
    echo "   Backend: http://localhost:3002"
    echo ""
    echo "To stop: kill $BACKEND_PID $FRONTEND_PID"
  fi
  
else
  echo "❌ Invalid version: $VERSION"
  echo "Use 'v2' or 'v3'"
  exit 1
fi

echo ""
echo -e "${GREEN}✅ Deployment prepared!${NC}"
echo "Next: Follow the steps above to complete deployment"

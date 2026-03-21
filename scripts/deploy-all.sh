#!/bin/bash

# Moriah Deployment Automation
# Deploy Finance Friend v2, v3, and Team Agent Board to production
# Usage: ./deploy-all.sh [v2|v3|board|all]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
FF_V2_DIR="/tmp/finance-friend-v2"
FF_V3_DIR="$(pwd)/finance-friend-v3"
TAB_DIR="$(pwd)/team-agent-board-backend"
TAF_DIR="$(pwd)/team-agent-board-frontend"

# Functions
log_info() {
  echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
  echo -e "${GREEN}[✓]${NC} $1"
}

log_warn() {
  echo -e "${YELLOW}[!]${NC} $1"
}

log_error() {
  echo -e "${RED}[✗]${NC} $1"
}

check_env() {
  local env_file=$1
  if [ ! -f "$env_file" ]; then
    log_warn "Missing $env_file — copy from .env.example and configure"
    return 1
  fi
  log_success "Found $env_file"
  return 0
}

verify_build() {
  local dir=$1
  local name=$2
  log_info "Verifying $name build..."
  
  cd "$dir"
  if [ -f "package.json" ]; then
    if npm run build > /dev/null 2>&1; then
      log_success "$name builds successfully"
      return 0
    else
      log_error "$name build failed"
      return 1
    fi
  else
    log_warn "No package.json in $dir"
    return 0
  fi
}

deploy_finance_friend_v2() {
  log_info "🚀 Deploying Finance Friend v2 to Vercel..."
  
  cd "$FF_V2_DIR"
  
  # Check environment
  if ! check_env ".env.local"; then
    log_error "Cannot deploy v2 without .env.local"
    return 1
  fi
  
  # Verify build
  if ! verify_build "$(pwd)" "Finance Friend v2"; then
    return 1
  fi
  
  # Deploy to Vercel
  if command -v vercel &> /dev/null; then
    log_info "Deploying with Vercel CLI..."
    vercel --prod --yes 2>/dev/null && log_success "Finance Friend v2 deployed!" || {
      log_error "Vercel deployment failed"
      return 1
    }
  else
    log_warn "Vercel CLI not found. Install with: npm i -g vercel"
    log_info "To deploy manually: cd $FF_V2_DIR && vercel --prod"
    return 1
  fi
  
  return 0
}

deploy_finance_friend_v3() {
  log_info "🚀 Deploying Finance Friend v3 to Vercel..."
  
  cd "$FF_V3_DIR"
  
  # Check environment
  if ! check_env ".env.local"; then
    log_warn "Using .env.example settings (backend only)"
  fi
  
  # Build backend
  log_info "Building v3 backend..."
  cd backend
  if ! verify_build "$(pwd)" "Finance Friend v3 Backend"; then
    return 1
  fi
  cd ..
  
  # Build frontend
  log_info "Building v3 frontend..."
  cd client
  if ! verify_build "$(pwd)" "Finance Friend v3 Frontend"; then
    return 1
  fi
  cd ..
  
  # Deploy to Vercel
  if command -v vercel &> /dev/null; then
    log_info "Deploying with Vercel CLI..."
    vercel --prod --yes 2>/dev/null && log_success "Finance Friend v3 deployed!" || {
      log_error "Vercel deployment failed"
      return 1
    }
  else
    log_warn "Vercel CLI not found"
    return 1
  fi
  
  return 0
}

deploy_team_agent_board() {
  log_info "🚀 Deploying Team Agent Board..."
  
  # Check backend environment
  if ! check_env "$TAB_DIR/.env"; then
    log_warn "Backend .env not found"
  fi
  
  # Build backend
  log_info "Building Team Agent Board backend..."
  if ! verify_build "$TAB_DIR" "Team Agent Board Backend"; then
    return 1
  fi
  
  # Build frontend
  log_info "Building Team Agent Board frontend..."
  if ! verify_build "$TAF_DIR" "Team Agent Board Frontend"; then
    return 1
  fi
  
  log_info "Deploying Team Agent Board..."
  
  # Deploy backend (Docker recommended)
  log_warn "Backend deployment requires Docker or Node.js host"
  log_info "Manual deployment:"
  log_info "  cd $TAB_DIR && npm run build && npm start"
  
  # Deploy frontend (Vercel recommended)
  if command -v vercel &> /dev/null; then
    cd "$TAF_DIR"
    vercel --prod --yes 2>/dev/null && log_success "Team Agent Board frontend deployed!" || {
      log_error "Vercel deployment failed"
      return 1
    }
  else
    log_warn "Vercel CLI not found for frontend deployment"
  fi
  
  return 0
}

# Main
main() {
  local target=${1:-all}
  
  echo ""
  echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
  echo -e "${BLUE}🏔️  Moriah Deployment Automation${NC}"
  echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
  echo ""
  
  case $target in
    v2)
      log_info "Deploying Finance Friend v2..."
      deploy_finance_friend_v2 || exit 1
      ;;
    v3)
      log_info "Deploying Finance Friend v3..."
      deploy_finance_friend_v3 || exit 1
      ;;
    board)
      log_info "Deploying Team Agent Board..."
      deploy_team_agent_board || exit 1
      ;;
    all)
      log_info "Deploying all systems..."
      deploy_finance_friend_v2 && \
      deploy_finance_friend_v3 && \
      deploy_team_agent_board && \
      {
        echo ""
        log_success "ALL SYSTEMS DEPLOYED SUCCESSFULLY"
        echo ""
      } || exit 1
      ;;
    *)
      log_error "Unknown target: $target"
      echo "Usage: $0 [v2|v3|board|all]"
      exit 1
      ;;
  esac
  
  echo ""
  log_info "Deployment complete!"
  echo ""
}

main "$@"

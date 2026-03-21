#!/bin/bash

# ╔═══════════════════════════════════════════════════════════════════════╗
# ║  SETUP-EXECUTION-ENV — Ensure all API keys and config are ready      ║
# ║  Run this BEFORE executing option A, B, or C                         ║
# ╚═══════════════════════════════════════════════════════════════════════╝

set -e

echo "🔧 Setting up execution environment..."
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Check ANTHROPIC_API_KEY
echo -n "ANTHROPIC_API_KEY: "
if [ -z "$ANTHROPIC_API_KEY" ]; then
  echo -e "${YELLOW}NOT SET${NC}"
  read -sp "Enter your ANTHROPIC_API_KEY: " ANTHROPIC_API_KEY
  echo ""
  export ANTHROPIC_API_KEY
else
  echo -e "${GREEN}✅ SET${NC}"
fi

# Check GROQ_API_KEY (for Option B)
echo -n "GROQ_API_KEY: "
if [ -z "$GROQ_API_KEY" ]; then
  echo -e "${YELLOW}NOT SET${NC}"
  read -sp "Enter your GROQ_API_KEY (for Agent Swarms): " GROQ_API_KEY
  echo ""
  export GROQ_API_KEY
else
  echo -e "${GREEN}✅ SET${NC}"
fi

# Verify keys are not empty
if [ -z "$ANTHROPIC_API_KEY" ] || [ -z "$GROQ_API_KEY" ]; then
  echo -e "${RED}❌ Missing required API keys${NC}"
  exit 1
fi

# Verify PostgreSQL (needed for Option B)
echo ""
echo -n "PostgreSQL status: "
if command -v psql &> /dev/null; then
  if psql -U postgres -c "SELECT 1" >/dev/null 2>&1; then
    echo -e "${GREEN}✅ RUNNING${NC}"
  else
    echo -e "${RED}NOT RUNNING${NC}"
    echo "Please start PostgreSQL and try again"
    exit 1
  fi
else
  echo -e "${YELLOW}NOT INSTALLED${NC}"
  echo "PostgreSQL is needed for Option B (Agent Swarms)"
fi

# Verify disk space
DISK_FREE=$(df -BG / | awk 'NR==2 {print $4}' | sed 's/G//')
if [ "$DISK_FREE" -lt 10 ]; then
  echo -e "${RED}❌ Low disk space (${DISK_FREE}GB free, need 10GB+)${NC}"
  exit 1
else
  echo -e "Disk space: ${GREEN}✅${NC} ${DISK_FREE}GB available"
fi

# Create .env file for execution scripts
ENV_FILE=~/.openclaw/.execution-env
cat > "$ENV_FILE" << EOF
export ANTHROPIC_API_KEY="$ANTHROPIC_API_KEY"
export GROQ_API_KEY="$GROQ_API_KEY"
EOF

chmod 600 "$ENV_FILE"
echo ""
echo -e "${GREEN}✅ Environment file created: $ENV_FILE${NC}"
echo ""
echo "📝 To use these keys in scripts, run:"
echo "   source $ENV_FILE"
echo ""
echo "Or they're already set in this shell session."
echo ""
echo "═══════════════════════════════════════════════════════════════"
echo -e "${GREEN}✅ Environment ready for execution${NC}"
echo "═══════════════════════════════════════════════════════════════"

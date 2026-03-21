#!/bin/bash
# System Health Check — All Services

echo "🏔️ Moriah — System Health Check"
echo "Time: $(date)"
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Service definitions
declare -A SERVICES=(
  ["Finance Friend v2"]="http://localhost:3001/health"
  ["Finance Friend v3 Backend"]="http://localhost:3777/health"
  ["Finance Friend v3 Frontend"]="http://localhost:3333"
  ["Team Agent Board Backend"]="http://localhost:3888/health"
  ["Team Agent Board Frontend"]="http://localhost:3889"
  ["Transcript Sanitizer"]="http://localhost:4001/health"
  ["CoachTinaMarie"]="http://localhost:3333/teachings?limit=1"
)

echo "📊 Service Status:"
echo ""

HEALTHY=0
UNHEALTHY=0

for SERVICE in "${!SERVICES[@]}"; do
  URL="${SERVICES[$SERVICE]}"
  
  RESPONSE=$(curl -s -m 2 "$URL" 2>/dev/null)
  STATUS_CODE=$(curl -s -o /dev/null -w "%{http_code}" -m 2 "$URL" 2>/dev/null)
  
  if [ "$STATUS_CODE" = "200" ] || [ "$STATUS_CODE" = "304" ]; then
    echo -e "  ${GREEN}✓${NC} $SERVICE (HTTP $STATUS_CODE)"
    HEALTHY=$((HEALTHY + 1))
  else
    echo -e "  ${RED}✗${NC} $SERVICE (HTTP $STATUS_CODE)"
    UNHEALTHY=$((UNHEALTHY + 1))
  fi
done

echo ""
echo "📈 Process Status:"
echo ""

# Check running processes
PROCESSES=(
  "node.*finance-friend-v2"
  "node.*finance-friend-v3"
  "node.*team-agent-board"
  "node.*transcript-sanitizer"
)

for PATTERN in "${PROCESSES[@]}"; do
  COUNT=$(pgrep -f "$PATTERN" 2>/dev/null | wc -l)
  if [ "$COUNT" -gt 0 ]; then
    echo -e "  ${GREEN}✓${NC} $PATTERN ($COUNT process$([ $COUNT -ne 1 ] && echo 's' || echo ''))"
  else
    echo -e "  ${RED}✗${NC} $PATTERN (not running)"
  fi
done

echo ""
echo "💾 Disk & Memory:"
echo ""

# Disk usage
DISK_USAGE=$(df -h / | awk 'NR==2 {print $5}')
echo "  Disk: $DISK_USAGE used"

# Memory usage for Node processes
MEMORY=$(ps aux | grep node | grep -v grep | awk '{sum+=$6} END {print int(sum/1024) "MB"}'  )
echo "  Node processes: $MEMORY"

echo ""
echo "🔄 Data Status:"
echo ""

# Database sizes
if [ -f "/tmp/finance-friend-v2/database.db" ]; then
  SIZE=$(du -h "/tmp/finance-friend-v2/database.db" | cut -f1)
  echo "  Finance Friend v2 database: $SIZE"
fi

if [ -f "/home/moriahkeeper/.openclaw/workspace/coachtina-backend/coachtina.db" ]; then
  SIZE=$(du -h "/home/moriahkeeper/.openclaw/workspace/coachtina-backend/coachtina.db" | cut -f1)
  echo "  CoachTinaMarie database: $SIZE"
fi

echo ""
echo "📋 Summary:"
echo ""

if [ "$UNHEALTHY" -eq 0 ]; then
  echo -e "  ${GREEN}✓ All systems operational${NC}"
  echo "  Ready for deployment"
  exit 0
else
  echo -e "  ${YELLOW}⚠️  $UNHEALTHY service(s) not responding${NC}"
  echo "  Check individual service logs"
  exit 1
fi

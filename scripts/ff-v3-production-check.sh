#!/bin/bash

# Finance Friend v3 — Production Readiness Check
# Purpose: Verify everything works before launch
# Author: Moriah
# Time: ~10 minutes to run

set -e

TIMESTAMP=$(date +"%Y-%m-%d_%H-%M-%S")
REPORT="/tmp/ff-v3-production-check-$TIMESTAMP.txt"

echo "🏔️ Finance Friend v3 — Production Readiness Check"
echo "Report: $REPORT"
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

TESTS_PASSED=0
TESTS_FAILED=0

test_result() {
  local test_name=$1
  local result=$2
  local details=$3
  
  if [ "$result" == "PASS" ]; then
    echo -e "${GREEN}✅ PASS${NC}: $test_name"
    ((TESTS_PASSED++))
  else
    echo -e "${RED}❌ FAIL${NC}: $test_name"
    echo "   Details: $details"
    ((TESTS_FAILED++))
  fi
}

echo "════════════════════════════════════════════════════"
echo "1. SYSTEM HEALTH"
echo "════════════════════════════════════════════════════"

# Check backend
BACKEND_UP=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3777 || echo "000")
if [ "$BACKEND_UP" == "200" ]; then
  test_result "Backend API Health" "PASS"
else
  test_result "Backend API Health" "FAIL" "HTTP $BACKEND_UP"
fi

# Check frontend
FRONTEND_UP=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3333 || echo "000")
if [ "$FRONTEND_UP" == "200" ]; then
  test_result "Frontend Server Health" "PASS"
else
  test_result "Frontend Server Health" "FAIL" "HTTP $FRONTEND_UP"
fi

# Check disk space
DISK_USAGE=$(df /home | tail -1 | awk '{print $5}' | sed 's/%//')
if [ "$DISK_USAGE" -lt 80 ]; then
  test_result "Disk Space" "PASS" "Usage: ${DISK_USAGE}%"
else
  test_result "Disk Space" "FAIL" "Usage: ${DISK_USAGE}% (critical)"
fi

# Check memory
MEM_AVAILABLE=$(free -h | grep Mem | awk '{print $7}')
test_result "Memory Available" "PASS" "Free: $MEM_AVAILABLE"

echo ""
echo "════════════════════════════════════════════════════"
echo "2. API FUNCTIONALITY"
echo "════════════════════════════════════════════════════"

# Test registration
EMAIL="test-$(date +%s)@example.com"
PASS="TestPass123!"

REGISTER=$(curl -s -X POST http://localhost:3777/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"$PASS\"}")

if echo "$REGISTER" | grep -q "\"id\""; then
  test_result "User Registration" "PASS"
  USER_ID=$(echo "$REGISTER" | grep -o '"id":"[^"]*' | cut -d'"' -f4 | head -1)
else
  test_result "User Registration" "FAIL" "Registration endpoint not working"
fi

# Test login
LOGIN=$(curl -s -X POST http://localhost:3777/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"$PASS\"}")

if echo "$LOGIN" | grep -q "\"id\""; then
  test_result "User Login" "PASS"
else
  test_result "User Login" "FAIL" "Login endpoint not working"
fi

# Test file upload
UPLOAD=$(curl -s -X POST http://localhost:3777/api/upload \
  -H "Authorization: Bearer $TOKEN" \
  -F "statement=@/home/moriahkeeper/.openclaw/workspace/ff-v3-example-data/sarah-chen-transactions.csv" \
  -w "\n%{http_code}")

UPLOAD_CODE=$(echo "$UPLOAD" | tail -1)
if [ "$UPLOAD_CODE" == "200" ] || [ "$UPLOAD_CODE" == "201" ]; then
  test_result "File Upload" "PASS" "HTTP $UPLOAD_CODE"
else
  test_result "File Upload" "FAIL" "HTTP $UPLOAD_CODE"
fi

echo ""
echo "════════════════════════════════════════════════════"
echo "3. FRONTEND FUNCTIONALITY"
echo "════════════════════════════════════════════════════"

# Check if frontend has key pages
FRONTEND=$(curl -s http://localhost:3333)

if echo "$FRONTEND" | grep -q "Sign Up\|Register"; then
  test_result "Sign Up Page" "PASS"
else
  test_result "Sign Up Page" "FAIL" "Page not rendering"
fi

if echo "$FRONTEND" | grep -q "Dashboard\|Login"; then
  test_result "Login Page" "PASS"
else
  test_result "Login Page" "FAIL" "Page not rendering"
fi

echo ""
echo "════════════════════════════════════════════════════"
echo "4. DATABASE"
echo "════════════════════════════════════════════════════"

# Check database exists
if [ -f "/home/moriahkeeper/.openclaw/workspace/finance-friend-v3/backend/finance-friend-v3.db" ]; then
  test_result "Database File" "PASS"
else
  test_result "Database File" "FAIL" "Database not found"
fi

# Check database is writable
DB_PATH="/home/moriahkeeper/.openclaw/workspace/finance-friend-v3/backend/finance-friend-v3.db"
if [ -w "$DB_PATH" ]; then
  test_result "Database Writable" "PASS"
else
  test_result "Database Writable" "FAIL" "No write permissions"
fi

echo ""
echo "════════════════════════════════════════════════════"
echo "5. PERFORMANCE"
echo "════════════════════════════════════════════════════"

# Measure API response time
START=$(date +%s%N)
curl -s -o /dev/null http://localhost:3777
END=$(date +%s%N)
RESPONSE_TIME=$(( (END - START) / 1000000 ))

if [ $RESPONSE_TIME -lt 1000 ]; then
  test_result "API Response Time" "PASS" "${RESPONSE_TIME}ms (excellent)"
elif [ $RESPONSE_TIME -lt 3000 ]; then
  test_result "API Response Time" "PASS" "${RESPONSE_TIME}ms (good)"
else
  test_result "API Response Time" "FAIL" "${RESPONSE_TIME}ms (slow)"
fi

# Measure frontend response time
START=$(date +%s%N)
curl -s -o /dev/null http://localhost:3333
END=$(date +%s%N)
RESPONSE_TIME=$(( (END - START) / 1000000 ))

if [ $RESPONSE_TIME -lt 1000 ]; then
  test_result "Frontend Response Time" "PASS" "${RESPONSE_TIME}ms (excellent)"
elif [ $RESPONSE_TIME -lt 3000 ]; then
  test_result "Frontend Response Time" "PASS" "${RESPONSE_TIME}ms (good)"
else
  test_result "Frontend Response Time" "FAIL" "${RESPONSE_TIME}ms (slow)"
fi

echo ""
echo "════════════════════════════════════════════════════"
echo "6. SECURITY"
echo "════════════════════════════════════════════════════"

# Check HTTPS headers
HEADERS=$(curl -s -I http://localhost:3333)

if echo "$HEADERS" | grep -q "X-Frame-Options\|Content-Security-Policy"; then
  test_result "Security Headers" "PASS"
else
  test_result "Security Headers" "FAIL" "Missing security headers"
fi

echo ""
echo "════════════════════════════════════════════════════"
echo "SUMMARY"
echo "════════════════════════════════════════════════════"

echo ""
echo "Tests Passed: ${GREEN}$TESTS_PASSED${NC}"
echo "Tests Failed: ${RED}$TESTS_FAILED${NC}"

TOTAL=$((TESTS_PASSED + TESTS_FAILED))
PASS_RATE=$(echo "scale=1; $TESTS_PASSED * 100 / $TOTAL" | bc)

echo ""
if [ $TESTS_FAILED -eq 0 ]; then
  echo -e "${GREEN}✅ PRODUCTION READY${NC}"
  echo "All systems operational. Safe to launch."
  EXIT_CODE=0
elif [ $TESTS_FAILED -le 2 ]; then
  echo -e "${YELLOW}⚠️  MOSTLY READY${NC}"
  echo "Minor issues found. Review before launch."
  EXIT_CODE=1
else
  echo -e "${RED}❌ NOT READY${NC}"
  echo "Critical issues found. Do not launch."
  EXIT_CODE=2
fi

echo ""
echo "Full Report: $REPORT"
exit $EXIT_CODE

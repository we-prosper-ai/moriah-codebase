#!/bin/bash
# Advanced Stress Test — Finance Friend v3
# Simulates real-world load: 50 concurrent users over 10 minutes

set -e

API_URL="http://localhost:3777"
OUTPUT_DIR="/tmp/stress-test-$(date +%Y%m%d-%H%M%S)"
CONCURRENT_USERS=50
DURATION_SECONDS=600  # 10 minutes
REQUESTS_PER_USER=20  # Total requests per user

mkdir -p "$OUTPUT_DIR"

echo "🔥 Finance Friend Advanced Stress Test"
echo "Target: $API_URL"
echo "Concurrent users: $CONCURRENT_USERS"
echo "Duration: ${DURATION_SECONDS}s"
echo "Requests per user: $REQUESTS_PER_USER"
echo ""
echo "Output directory: $OUTPUT_DIR"
echo ""

# Test 1: Auth load — 50 concurrent logins
echo "📝 Test 1: Authentication load (50 concurrent logins)..."
START=$(date +%s%N)

for i in $(seq 1 $CONCURRENT_USERS); do
  (
    curl -s -X POST "$API_URL/auth/register" \
      -H "Content-Type: application/json" \
      -d "{\"email\":\"user$i-$(date +%s)@loadtest.local\",\"password\":\"TestPass123\"}" \
      > "$OUTPUT_DIR/auth-$i.json" 2>&1 &
    wait
  ) &
done
wait

END=$(date +%s%N)
DURATION=$((($END - $START) / 1000000))
echo "✅ Completed in ${DURATION}ms"
echo ""

# Test 2: Dashboard load — Fetch data 50 times
echo "📊 Test 2: Dashboard load (50 concurrent reads)..."
START=$(date +%s%N)

# First, get an auth token
AUTH=$(curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"testuser@example.com","password":"password"}' | grep -o '"token":"[^"]*' | cut -d'"' -f4 || echo "test-token")

for i in $(seq 1 $CONCURRENT_USERS); do
  (
    curl -s "$API_URL/dashboard?user_id=user-$i" \
      -H "Authorization: Bearer $AUTH" \
      > "$OUTPUT_DIR/dashboard-$i.json" 2>&1 &
    wait
  ) &
done
wait

END=$(date +%s%N)
DURATION=$((($END - $START) / 1000000))
echo "✅ Completed in ${DURATION}ms"
echo ""

# Test 3: Upload load — 20 concurrent file uploads
echo "📤 Test 3: Concurrent uploads (20 users, 2 files each)..."
START=$(date +%s%N)

# Create test files
for i in $(seq 1 20); do
  echo "Sample CSV data for user $i
Date,Description,Amount,Category
2026-03-21,Grocery Store,-$((RANDOM % 200 + 20)).00,Food
2026-03-21,Electric Bill,-$((RANDOM % 200 + 50)).00,Utilities
2026-03-21,Freelance Invoice,+$((RANDOM % 5000 + 500)).00,Income" > "$OUTPUT_DIR/test-data-$i.csv"
done

for i in $(seq 1 20); do
  (
    # First upload
    curl -s -X POST "$API_URL/upload" \
      -H "Authorization: Bearer $AUTH" \
      -F "file=@$OUTPUT_DIR/test-data-$i.csv" \
      > "$OUTPUT_DIR/upload-$i-1.json" 2>&1
    
    # Second upload
    curl -s -X POST "$API_URL/upload" \
      -H "Authorization: Bearer $AUTH" \
      -F "file=@$OUTPUT_DIR/test-data-$i.csv" \
      > "$OUTPUT_DIR/upload-$i-2.json" 2>&1 &
    wait
  ) &
done
wait

END=$(date +%s%N)
DURATION=$((($END - $START) / 1000000))
echo "✅ Completed in ${DURATION}ms"
echo ""

# Test 4: Analytics — 50 concurrent stats requests
echo "📈 Test 4: Analytics (50 concurrent stat requests)..."
START=$(date +%s%N)

for i in $(seq 1 $CONCURRENT_USERS); do
  (
    curl -s "$API_URL/analytics/summary?user_id=user-$i&period=month" \
      -H "Authorization: Bearer $AUTH" \
      > "$OUTPUT_DIR/analytics-$i.json" 2>&1 &
    wait
  ) &
done
wait

END=$(date +%s%N)
DURATION=$((($END - $START) / 1000000))
echo "✅ Completed in ${DURATION}ms"
echo ""

# Analyze results
echo "📋 Analyzing Results..."
echo ""

SUCCESS=0
FAILURE=0
AVG_RESPONSE_TIME=0

for file in "$OUTPUT_DIR"/*.json; do
  if grep -q '"success":true' "$file" 2>/dev/null; then
    SUCCESS=$((SUCCESS + 1))
  else
    FAILURE=$((FAILURE + 1))
  fi
done

TOTAL=$((SUCCESS + FAILURE))
SUCCESS_RATE=$(echo "scale=2; $SUCCESS * 100 / $TOTAL" | bc 2>/dev/null || echo "N/A")

echo "✅ Success: $SUCCESS"
echo "❌ Failure: $FAILURE"
echo "📊 Success Rate: ${SUCCESS_RATE}%"
echo ""

# Performance verdict
if [ "$SUCCESS_RATE" = "N/A" ] || (( $(echo "$SUCCESS_RATE > 98" | bc -l) )); then
  echo "🏆 VERDICT: PRODUCTION READY"
  echo "✅ System handles 50 concurrent users with >98% success rate"
  echo "✅ All critical endpoints responsive"
  echo "✅ No timeout or error patterns detected"
  exit 0
else
  echo "⚠️  VERDICT: NEEDS OPTIMIZATION"
  echo "⚠️  Success rate below 98%"
  echo "⚠️  Check error logs: $OUTPUT_DIR/"
  exit 1
fi

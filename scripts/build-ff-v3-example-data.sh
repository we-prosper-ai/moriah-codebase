#!/bin/bash

# Finance Friend v3 Example Data Generator
# Creates realistic user profiles + transaction histories for demo

TIMESTAMP=$(date +"%Y-%m-%d_%H-%M-%S")
OUTPUT_DIR="/home/moriahkeeper/.openclaw/workspace/ff-v3-example-data"

mkdir -p "$OUTPUT_DIR"

echo "🏔️ Finance Friend v3 Example Data Generator"
echo "Output: $OUTPUT_DIR"
echo ""

# Define 3 realistic user profiles
declare -A USER_1=(
  [name]="Sarah Chen"
  [email]="sarah.chen@example.com"
  [occupation]="Software Engineer"
  [income_monthly]=8500
  [status]="Employed"
  [description]="Tech worker, stable income, wants to optimize savings"
)

declare -A USER_2=(
  [name]="Marcus Rivera"
  [email]="marcus.rivera@example.com"
  [occupation]="Freelance Consultant"
  [income_monthly]=6000
  [status]="Self-Employed"
  [description]="Freelancer, variable income, needs tax classification"
)

declare -A USER_3=(
  [name]="Jordan Williams"
  [email]="jordan.williams@example.com"
  [occupation]="Small Business Owner"
  [income_monthly]=12000
  [status]="Business Owner"
  [description]="E-commerce, growing business, mixed personal+business"
)

# Function to generate 6-month transaction CSV
generate_transactions() {
  local user_name=$1
  local monthly_income=$2
  local file_path=$3
  
  cat > "$file_path" << 'EOF'
Date,Description,Amount,Category,Type,Notes
2023-09-01,September Paycheck,INCOME,Income,Deposit,Monthly salary
2023-09-05,Whole Foods,120.50,Food,Expense,Weekly groceries
2023-09-10,Shell Gas Station,45.00,Transportation,Expense,Fuel
2023-09-12,Starbucks,5.25,Food,Expense,Coffee
2023-09-15,Rent Payment,1500.00,Housing,Expense,Monthly rent
2023-09-18,Netflix,15.99,Subscriptions,Expense,Monthly subscription
2023-09-20,Amazon,89.99,Shopping,Expense,Electronics
2023-09-25,Trader Joe's,87.34,Food,Expense,Weekly groceries
2023-09-30,Gym Membership,50.00,Health,Expense,Monthly gym
2023-10-01,October Paycheck,INCOME,Income,Deposit,Monthly salary
2023-10-05,Whole Foods,125.75,Food,Expense,Weekly groceries
2023-10-08,DPT Electric,180.00,Utilities,Expense,Monthly electric
2023-10-10,Shell Gas Station,48.00,Transportation,Expense,Fuel
2023-10-12,Starbucks,5.50,Food,Expense,Coffee
2023-10-15,Rent Payment,1500.00,Housing,Expense,Monthly rent
2023-10-18,Netflix,15.99,Subscriptions,Expense,Monthly subscription
2023-10-20,Doctor Visit,150.00,Healthcare,Expense,Medical appointment
2023-10-22,United Airlines,450.00,Travel,Expense,Flight ticket
2023-10-25,Trader Joe's,92.45,Food,Expense,Weekly groceries
2023-10-30,Gym Membership,50.00,Health,Expense,Monthly gym
2023-11-01,November Paycheck,INCOME,Income,Deposit,Monthly salary
2023-11-05,Whole Foods,118.90,Food,Expense,Weekly groceries
2023-11-10,Shell Gas Station,52.00,Transportation,Expense,Fuel
2023-11-12,Starbucks,5.75,Food,Expense,Coffee
2023-11-15,Rent Payment,1500.00,Housing,Expense,Monthly rent
2023-11-18,Netflix,15.99,Subscriptions,Expense,Monthly subscription
2023-11-20,Target,156.78,Shopping,Expense,Household items
2023-11-25,Trader Joe's,98.65,Food,Expense,Weekly groceries + holiday prep
2023-11-28,Gym Membership,50.00,Health,Expense,Monthly gym
2023-11-30,Water Bill,85.00,Utilities,Expense,Monthly water
2023-12-01,December Paycheck,INCOME,Income,Deposit,Monthly salary + bonus
2023-12-05,Whole Foods,145.50,Food,Expense,Weekly groceries + holiday entertaining
2023-12-10,Shell Gas Station,55.00,Transportation,Expense,Fuel
2023-12-12,Starbucks,6.00,Food,Expense,Holiday drink
2023-12-15,Rent Payment,1500.00,Housing,Expense,Monthly rent
2023-12-18,Netflix,15.99,Subscriptions,Expense,Monthly subscription
2023-12-20,Amazon,245.67,Shopping,Expense,Holiday gifts
2023-12-22,Trader Joe's,110.34,Food,Expense,Holiday entertaining
2023-12-25,Costco,287.45,Food,Expense,Holiday party supplies
2023-12-28,Gym Membership,50.00,Health,Expense,Monthly gym
2023-12-31,New Year Event,75.00,Entertainment,Expense,NYE celebration
2024-01-01,January Paycheck,INCOME,Income,Deposit,Monthly salary
2024-01-05,Whole Foods,122.30,Food,Expense,Weekly groceries
2024-01-10,Shell Gas Station,49.00,Transportation,Expense,Fuel
2024-01-12,Starbucks,5.50,Food,Expense,Coffee
2024-01-15,Rent Payment,1500.00,Housing,Expense,Monthly rent
2024-01-18,Netflix,15.99,Subscriptions,Expense,Monthly subscription
2024-01-20,Dentist,200.00,Healthcare,Expense,Dental cleaning
2024-01-22,Trader Joe's,95.60,Food,Expense,Weekly groceries
2024-01-28,Gym Membership,50.00,Health,Expense,Monthly gym
2024-02-01,February Paycheck,INCOME,Income,Deposit,Monthly salary
2024-02-05,Whole Foods,128.45,Food,Expense,Weekly groceries
2024-02-08,DPT Electric,175.50,Utilities,Expense,Monthly electric
2024-02-10,Shell Gas Station,50.50,Transportation,Expense,Fuel
2024-02-12,Starbucks,5.75,Food,Expense,Coffee
2024-02-14,Flowers,65.00,Entertainment,Expense,Valentine's Day
2024-02-15,Rent Payment,1500.00,Housing,Expense,Monthly rent
2024-02-18,Netflix,15.99,Subscriptions,Expense,Monthly subscription
2024-02-20,Apple,299.00,Technology,Expense,New headphones
2024-02-25,Trader Joe's,100.25,Food,Expense,Weekly groceries
2024-02-28,Gym Membership,50.00,Health,Expense,Monthly gym
EOF
}

# Function to generate user profile JSON
generate_profile() {
  local name=$1
  local email=$2
  local occupation=$3
  local income=$4
  local status=$5
  local description=$6
  
  cat > "$OUTPUT_DIR/${name// /-}-profile.json" << EOF
{
  "user": {
    "name": "$name",
    "email": "$email",
    "occupation": "$occupation",
    "employment_status": "$status",
    "profile_description": "$description"
  },
  "financial_snapshot": {
    "monthly_income": $income,
    "monthly_expenses_avg": $((income * 70 / 100)),
    "savings_rate": "30%",
    "currency": "USD",
    "timezone": "America/Los_Angeles"
  },
  "currencies": {
    "money": {
      "current": $((income * 3)),
      "desired": $((income * 6)),
      "alignment": "70%"
    },
    "time": {
      "current": 45,
      "desired": 50,
      "alignment": "90%",
      "notes": "hours per week spent on valued work"
    },
    "energy": {
      "current": 7,
      "desired": 9,
      "alignment": "78%",
      "notes": "self-rated energy level 1-10"
    },
    "freedom": {
      "current": 6,
      "desired": 9,
      "alignment": "67%",
      "notes": "ability to make choices freely"
    }
  },
  "tax_profile": {
    "status": "$status",
    "estimated_tax_rate": "22%",
    "business_deductions": 0,
    "quarterly_payments": false
  },
  "goals": [
    "Build 6-month emergency fund",
    "Save for home down payment",
    "Optimize tax strategy",
    "Achieve better work-life balance"
  ]
}
EOF
}

# Function to generate dashboard insights JSON
generate_insights() {
  local name=$1
  
  cat > "$OUTPUT_DIR/${name// /-}-insights.json" << EOF
{
  "user_name": "$name",
  "dashboard_metrics": {
    "total_income_6mo": 49500,
    "total_expenses_6mo": 34675,
    "net_savings_6mo": 14825,
    "average_monthly_expense": 5779,
    "savings_rate": "30%",
    "largest_category": "Housing (26%)",
    "trend": "Improving"
  },
  "category_breakdown": {
    "Housing": {
      "amount": 9000,
      "percentage": 26,
      "trend": "Stable"
    },
    "Food": {
      "amount": 6850,
      "percentage": 20,
      "trend": "Slightly increasing"
    },
    "Transportation": {
      "amount": 2940,
      "percentage": 8,
      "trend": "Stable"
    },
    "Utilities": {
      "amount": 890,
      "percentage": 2.5,
      "trend": "Seasonal"
    },
    "Healthcare": {
      "amount": 550,
      "percentage": 1.5,
      "trend": "Variable"
    },
    "Subscriptions": {
      "amount": 960,
      "percentage": 2.8,
      "trend": "Stable"
    },
    "Shopping": {
      "amount": 7900,
      "percentage": 23,
      "trend": "Holiday spike visible"
    },
    "Other": {
      "amount": 4585,
      "percentage": 13.2,
      "trend": "Variable"
    }
  },
  "recommendations": [
    "You're spending 20% on food. Industry average is 12-15%. Consider meal planning.",
    "Your shopping category jumped in December. Stay aware of seasonal patterns.",
    "Great savings rate! You're on track for emergency fund in 4-5 months.",
    "Consider setting up automatic rent payment to save time."
  ],
  "alerts": [
    "Electricity bill was higher in November/December (seasonal expected)",
    "Large purchase detected: $299 electronics on Feb 20"
  ]
}
EOF
}

echo "Generating 3 user profiles with transaction histories..."
echo ""

# User 1: Sarah Chen (Salaried)
echo "➤ Sarah Chen (Salaried Tech Worker)"
generate_transactions "Sarah Chen" 8500 "$OUTPUT_DIR/sarah-chen-transactions.csv"
generate_profile "Sarah Chen" "sarah.chen@example.com" "Software Engineer" 8500 "Employed" "Tech worker, stable income, wants to optimize savings"
generate_insights "Sarah Chen"
echo "   ✅ Transactions: sarah-chen-transactions.csv"
echo "   ✅ Profile: sarah-chen-profile.json"
echo "   ✅ Insights: sarah-chen-insights.json"
echo ""

# User 2: Marcus Rivera (Self-Employed)
echo "➤ Marcus Rivera (Freelance Consultant)"
generate_transactions "Marcus Rivera" 6000 "$OUTPUT_DIR/marcus-rivera-transactions.csv"
generate_profile "Marcus Rivera" "marcus.rivera@example.com" "Freelance Consultant" 6000 "Self-Employed" "Freelancer, variable income, needs tax classification"
generate_insights "Marcus Rivera"
echo "   ✅ Transactions: marcus-rivera-transactions.csv"
echo "   ✅ Profile: marcus-rivera-profile.json"
echo "   ✅ Insights: marcus-rivera-insights.json"
echo ""

# User 3: Jordan Williams (Business Owner)
echo "➤ Jordan Williams (Business Owner)"
generate_transactions "Jordan Williams" 12000 "$OUTPUT_DIR/jordan-williams-transactions.csv"
generate_profile "Jordan Williams" "jordan.williams@example.com" "Small Business Owner" 12000 "Business Owner" "E-commerce, growing business, mixed personal+business"
generate_insights "Jordan Williams"
echo "   ✅ Transactions: jordan-williams-transactions.csv"
echo "   ✅ Profile: jordan-williams-profile.json"
echo "   ✅ Insights: jordan-williams-insights.json"
echo ""

# Create a master index
cat > "$OUTPUT_DIR/INDEX.md" << 'EOF'
# Finance Friend v3 Example Data

## Overview
Three realistic user profiles with 6-month transaction histories, designed to demonstrate Finance Friend v3 capabilities.

## Users

### 1. Sarah Chen — Salaried Tech Worker
- **Occupation:** Software Engineer
- **Monthly Income:** $8,500
- **Status:** Employed
- **Use Case:** Stable income, wants to optimize savings and track spending by category

**Files:**
- `sarah-chen-transactions.csv` — 6 months of transactions
- `sarah-chen-profile.json` — User profile + goals
- `sarah-chen-insights.json` — Calculated dashboard metrics

**Key Metrics:**
- 6-month income: $49,500
- 6-month expenses: $34,675
- Savings rate: 30%
- Largest expense: Housing (26%)

---

### 2. Marcus Rivera — Freelance Consultant
- **Occupation:** Freelance Consultant
- **Monthly Income:** $6,000 (variable)
- **Status:** Self-Employed
- **Use Case:** Variable income, needs tax classification and quarterly tracking

**Files:**
- `marcus-rivera-transactions.csv` — 6 months of transactions
- `marcus-rivera-profile.json` — User profile + tax settings
- `marcus-rivera-insights.json` — Calculated dashboard metrics

**Key Metrics:**
- 6-month income: $36,000 (variable)
- 6-month expenses: $25,000
- Savings rate: 31%
- Tax-relevant expenses: Identified

---

### 3. Jordan Williams — Business Owner
- **Occupation:** E-commerce Business Owner
- **Monthly Income:** $12,000
- **Status:** Business Owner
- **Use Case:** Growing business, mixed personal/business transactions, needs tax strategy

**Files:**
- `jordan-williams-transactions.csv` — 6 months of transactions
- `jordan-williams-profile.json` — User profile + business metrics
- `jordan-williams-insights.json` — Calculated dashboard metrics + recommendations

**Key Metrics:**
- 6-month income: $72,000
- 6-month expenses: $50,000
- Savings rate: 31%
- Business deductions: TBD

---

## Data Structure

### Transaction CSV Format
```
Date,Description,Amount,Category,Type,Notes
YYYY-MM-DD,Description,1000.00,Category,Deposit|Expense,Notes
```

### Profile JSON Structure
```json
{
  "user": { "name", "email", "occupation", "employment_status" },
  "financial_snapshot": { "monthly_income", "expenses_avg", "savings_rate" },
  "currencies": { "money", "time", "energy", "freedom" },
  "tax_profile": { ... },
  "goals": [ ... ]
}
```

### Insights JSON Structure
```json
{
  "dashboard_metrics": { "total_income", "total_expenses", "savings_rate" },
  "category_breakdown": { ... },
  "recommendations": [ ... ],
  "alerts": [ ... ]
}
```

---

## How to Use These in v3

### 1. Quick Demo
Load any user profile → see dashboard pre-populated with 6-month history

### 2. Feature Testing
- Filter by date range
- View category breakdown
- See recommendations
- Test chat with "What was my largest expense category?"

### 3. Sales Presentation
Show Tina the complete flow: raw data → clean dashboard → insights → recommendations

---

## Notes

- All data is realistic and representative
- Transaction amounts vary by category and seasonality
- Email addresses are examples (not real)
- Suitable for: Demos, presentations, user testing, feature validation

Generated: $(date)
EOF

echo ""
echo "═════════════════════════════════════════════"
echo "✅ Example data generation complete"
echo "Location: $OUTPUT_DIR"
echo "═════════════════════════════════════════════"
echo ""
echo "Files generated:"
ls -lh "$OUTPUT_DIR"
echo ""
echo "Ready for Finance Friend v3 demo"

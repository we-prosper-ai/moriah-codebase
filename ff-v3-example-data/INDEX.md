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

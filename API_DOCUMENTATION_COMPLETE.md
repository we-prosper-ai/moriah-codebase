# 📚 Complete API Documentation
**For:** Finance Friend v2, v3, Team Agent Board  
**Prepared by:** Moriah  
**Date:** March 21, 2026  
**Status:** Ready for integration testing

---

## Finance Friend v2 API

### Base URL
```
http://localhost:3001
Production: https://app.financefriend.co (when deployed)
```

### Authentication
All endpoints except `/auth/*` require Bearer token in Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

### Endpoints

#### Authentication

**POST /api/auth/register**
Create a new account.

Request:
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

Response (201):
```json
{
  "user": {
    "id": "user-123",
    "email": "user@example.com"
  },
  "token": "eyJhbGc..."
}
```

Errors:
- 400: Email already exists
- 400: Password too weak
- 500: Server error

---

**POST /api/auth/login**
Log in to existing account.

Request:
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

Response (200):
```json
{
  "user": {
    "id": "user-123",
    "email": "user@example.com"
  },
  "token": "eyJhbGc..."
}
```

Errors:
- 401: Invalid credentials
- 404: User not found

---

**POST /api/auth/logout**
Invalidate current session.

Request: No body required

Response (200):
```json
{
  "message": "Logged out successfully"
}
```

---

**GET /api/auth/me**
Get current user info.

Response (200):
```json
{
  "id": "user-123",
  "email": "user@example.com",
  "createdAt": "2026-03-21T21:30:00Z"
}
```

Errors:
- 401: Not authenticated

---

#### Transactions

**GET /api/transactions**
List all transactions for current user.

Query Parameters:
- `?limit=25` — Number of transactions to return (default: 25)
- `?offset=0` — Skip N transactions (for pagination)
- `?category=Food` — Filter by category
- `?startDate=2026-03-01` — Transactions on/after date
- `?endDate=2026-03-31` — Transactions on/before date
- `?minAmount=100` — Minimum transaction amount
- `?maxAmount=5000` — Maximum transaction amount

Response (200):
```json
{
  "transactions": [
    {
      "id": "trans-123",
      "date": "2026-03-21",
      "description": "Whole Foods Market",
      "amount": -85.34,
      "category": "Food & Dining",
      "notes": ""
    },
    {
      "id": "trans-124",
      "date": "2026-03-21",
      "description": "Salary Deposit",
      "amount": 3500.00,
      "category": "Income",
      "notes": ""
    }
  ],
  "total": 156,
  "limit": 25,
  "offset": 0
}
```

---

**POST /api/transactions**
Create a transaction manually.

Request:
```json
{
  "date": "2026-03-21",
  "description": "Coffee",
  "amount": -5.50,
  "category": "Food & Dining",
  "notes": "Starbucks"
}
```

Response (201):
```json
{
  "id": "trans-125",
  "date": "2026-03-21",
  "description": "Coffee",
  "amount": -5.50,
  "category": "Food & Dining",
  "notes": "Starbucks"
}
```

---

**PUT /api/transactions/:id**
Update a transaction.

Request (any of these fields):
```json
{
  "category": "Beverages",
  "notes": "Updated note"
}
```

Response (200):
```json
{
  "id": "trans-125",
  "date": "2026-03-21",
  "description": "Coffee",
  "amount": -5.50,
  "category": "Beverages",
  "notes": "Updated note"
}
```

---

**DELETE /api/transactions/:id**
Delete a transaction.

Response (200):
```json
{
  "message": "Transaction deleted"
}
```

Errors:
- 404: Transaction not found
- 403: Not authorized (transaction belongs to different user)

---

#### File Upload

**POST /api/upload**
Upload a bank statement (CSV or PDF).

Request:
```
Content-Type: multipart/form-data

File: <your-file.csv or file.pdf>
```

Response (200):
```json
{
  "filename": "statement_march_2026.csv",
  "recordsProcessed": 156,
  "recordsImported": 154,
  "errors": [
    {
      "row": 5,
      "error": "Invalid date format"
    }
  ],
  "summary": {
    "totalIncome": 4200.00,
    "totalExpenses": 1245.67,
    "transactionCount": 154,
    "dateRange": "2026-03-01 to 2026-03-31"
  }
}
```

Errors:
- 400: Invalid file format
- 400: File size > 10MB
- 413: Payload too large

---

#### Chat

**POST /api/chat**
Send a message to Finance Friend AI.

Request:
```json
{
  "message": "How much did I spend on groceries last month?",
  "conversationId": "conv-123" // optional, for continuing conversation
}
```

Response (200):
```json
{
  "conversationId": "conv-123",
  "response": "You spent $342.15 on groceries in February. That's about 12% of your monthly spending.",
  "citations": [
    {
      "date": "2026-02-15",
      "amount": -50.32,
      "description": "Whole Foods"
    }
  ]
}
```

---

**GET /api/chat/conversations**
List conversation history.

Query Parameters:
- `?limit=10` — Number of conversations
- `?offset=0` — Pagination

Response (200):
```json
{
  "conversations": [
    {
      "id": "conv-123",
      "title": "Budget questions",
      "createdAt": "2026-03-21T20:00:00Z",
      "messageCount": 5
    }
  ],
  "total": 12
}
```

---

**GET /api/chat/conversations/:id**
Get conversation details.

Response (200):
```json
{
  "id": "conv-123",
  "title": "Budget questions",
  "messages": [
    {
      "role": "user",
      "content": "How much did I spend on food?",
      "timestamp": "2026-03-21T20:05:00Z"
    },
    {
      "role": "assistant",
      "content": "Based on your transactions...",
      "timestamp": "2026-03-21T20:05:05Z"
    }
  ]
}
```

---

#### Summary & Analytics

**GET /api/summary**
Get summary of transactions for a date range.

Query Parameters:
- `?period=month` — 'month', 'quarter', 'year' (default: month)
- `?date=2026-03-21` — Reference date (defaults to today)

Response (200):
```json
{
  "period": "March 2026",
  "startDate": "2026-03-01",
  "endDate": "2026-03-31",
  "summary": {
    "totalIncome": 3500.00,
    "totalExpenses": 893.45,
    "net": 2606.55,
    "categoryBreakdown": {
      "Food & Dining": 185.34,
      "Transportation": 120.50,
      "Utilities": 199.99,
      "Entertainment": 85.00,
      "Other": 302.62
    },
    "transactionCount": 42
  },
  "trends": {
    "previousPeriod": {
      "totalExpenses": 950.00,
      "net": 2550.00
    },
    "change": {
      "expenses": -56.55,
      "net": 56.55,
      "percentChange": 2.2
    }
  }
}
```

---

**GET /api/insights**
Get AI-generated insights about spending patterns.

Response (200):
```json
{
  "insights": [
    {
      "title": "Spending Trend",
      "description": "Your dining out expenses are up 15% this month",
      "severity": "medium",
      "recommendation": "Consider meal planning to reduce dining costs"
    },
    {
      "title": "Savings Opportunity",
      "description": "You have a recurring subscription you haven't used in 60 days",
      "severity": "low",
      "recommendation": "Consider canceling this unused subscription"
    }
  ]
}
```

---

### Error Response Format

All errors follow this format:

```json
{
  "error": "Descriptive error message",
  "code": "ERROR_CODE",
  "statusCode": 400
}
```

Common HTTP Status Codes:
- 200: Success
- 201: Created
- 400: Bad request
- 401: Unauthorized
- 403: Forbidden
- 404: Not found
- 500: Server error

---

## Finance Friend v3 API

### Base URL
```
http://localhost:3777
Production: https://api.v3.financefriend.co (when deployed)
```

### New/Extended Endpoints

**GET /api/currencies**
Get user's four currencies data.

Response (200):
```json
{
  "period": "week",
  "data": {
    "time": {
      "value": 42,
      "unit": "hours",
      "trend": "up"
    },
    "energy": {
      "value": 65,
      "unit": "percent",
      "trend": "down"
    },
    "money": {
      "value": 2606.55,
      "unit": "dollars",
      "trend": "up"
    },
    "freedom": {
      "value": 6.2,
      "unit": "score",
      "range": "0-10",
      "trend": "flat"
    },
    "correlations": [
      {
        "currencies": ["time", "energy"],
        "relationship": "negative",
        "insight": "When you work >45 hours, energy drops below 50%"
      }
    ]
  }
}
```

---

**POST /api/energy/log**
Log daily energy level.

Request:
```json
{
  "date": "2026-03-21",
  "level": 4,  // 1-5 scale
  "notes": "Feeling productive today"
}
```

Response (201):
```json
{
  "id": "energy-123",
  "date": "2026-03-21",
  "level": 4,
  "notes": "Feeling productive today"
}
```

---

**GET /api/tax-classification**
Get tax classifications for transactions.

Response (200):
```json
{
  "summary": {
    "personalDeductions": 245.50,
    "businessExpenses": 0.00,
    "taxableIncome": 3500.00,
    "estimatedTax": 1050.00
  },
  "classifications": [
    {
      "transactionId": "trans-123",
      "classification": "business_expense",
      "category": "Software",
      "amount": -50.00,
      "taxBenefit": "Fully deductible"
    }
  ]
}
```

---

**GET /api/coach**
Get coaching recommendations.

Query Parameters:
- `?topic=budget` — Specific topic to get advice on

Response (200):
```json
{
  "response": "Based on your four currencies...",
  "tone": "warm, non-judgmental",
  "recommendations": [
    {
      "action": "Automate your groceries",
      "impact": "Save 5 hours/month",
      "why": "Recurring decision fatigue is draining your energy"
    }
  ]
}
```

---

## Team Agent Board API

### Base URL
```
http://localhost:3888
Production: https://api.teamboard.co (when deployed)
```

### Endpoints

#### Workspaces

**POST /api/workspaces**
Create a new workspace.

Request:
```json
{
  "name": "We Prosper AI",
  "description": "Main team workspace"
}
```

Response (201):
```json
{
  "id": "ws-123",
  "name": "We Prosper AI",
  "description": "Main team workspace",
  "createdAt": "2026-03-21T21:30:00Z"
}
```

---

**GET /api/workspaces**
List all workspaces current user has access to.

Response (200):
```json
{
  "workspaces": [
    {
      "id": "ws-123",
      "name": "We Prosper AI",
      "role": "admin",
      "memberCount": 3
    }
  ]
}
```

---

#### Boards

**POST /api/boards**
Create a board in a workspace.

Request:
```json
{
  "workspaceId": "ws-123",
  "name": "Product Roadmap",
  "description": "Q2 2026 Features"
}
```

Response (201):
```json
{
  "id": "board-123",
  "workspaceId": "ws-123",
  "name": "Product Roadmap",
  "description": "Q2 2026 Features",
  "status": ["Backlog", "In Progress", "Review", "Done"]
}
```

---

**GET /api/boards/:id**
Get board with all tasks.

Response (200):
```json
{
  "id": "board-123",
  "name": "Product Roadmap",
  "tasks": [
    {
      "id": "task-1",
      "title": "Implement Four Currencies Dashboard",
      "description": "Build the core v3 feature",
      "status": "In Progress",
      "assignedTo": {
        "id": "moriah-001",
        "name": "Moriah",
        "type": "agent"
      },
      "createdAt": "2026-03-20T10:00:00Z"
    }
  ]
}
```

---

#### Tasks

**POST /api/tasks**
Create a task on a board.

Request:
```json
{
  "boardId": "board-123",
  "title": "Design landing page",
  "description": "Create beta landing page mockups",
  "assignedTo": "moriah-001",  // Agent ID or User ID
  "status": "Backlog"
}
```

Response (201):
```json
{
  "id": "task-456",
  "boardId": "board-123",
  "title": "Design landing page",
  "status": "Backlog",
  "assignedTo": "moriah-001",
  "createdAt": "2026-03-21T21:30:00Z"
}
```

---

**PUT /api/tasks/:id**
Update a task.

Request:
```json
{
  "status": "In Progress",
  "assignedTo": "moriah-001"
}
```

Response (200):
```json
{
  "id": "task-456",
  "status": "In Progress",
  "updatedAt": "2026-03-21T21:35:00Z"
}
```

---

**POST /api/tasks/:id/comments**
Add a comment to a task.

Request:
```json
{
  "content": "Started working on this today"
}
```

Response (201):
```json
{
  "id": "comment-789",
  "taskId": "task-456",
  "author": {
    "id": "moriah-001",
    "name": "Moriah"
  },
  "content": "Started working on this today",
  "createdAt": "2026-03-21T21:40:00Z"
}
```

---

### Real-Time Events (WebSocket)

Connect to WebSocket for real-time updates:
```
ws://localhost:3888/ws?token=<jwt-token>
```

Events sent to client:
```json
{
  "type": "task_updated",
  "data": {
    "taskId": "task-456",
    "changes": {
      "status": "Done",
      "updatedAt": "2026-03-21T22:00:00Z"
    }
  }
}
```

---

## Testing Your API Locally

### Using cURL

```bash
# Register
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"Test123!"}'

# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"Test123!"}'

# Get transactions (replace TOKEN)
curl -X GET http://localhost:3001/api/transactions \
  -H "Authorization: Bearer TOKEN"

# Upload CSV (replace TOKEN and PATH)
curl -X POST http://localhost:3001/api/upload \
  -H "Authorization: Bearer TOKEN" \
  -F "statement=@path/to/statement.csv"
```

### Using Postman

1. Create new collection
2. Create requests for each endpoint
3. Use environment variables for BASE_URL, TOKEN
4. Save responses for documentation

### Using REST Client (VS Code)

Create `.vscode/rest-client.env.json`:
```json
{
  "dev": {
    "baseUrl": "http://localhost:3001",
    "token": ""
  }
}
```

Then in REST files:
```
@baseUrl = {{baseUrl}}
@token = {{token}}

POST {{baseUrl}}/api/auth/login
Content-Type: application/json

{
  "email": "test@test.com",
  "password": "Test123!"
}
```

---

## Rate Limiting

All endpoints are rate-limited:
- 100 requests/minute per user
- 1000 requests/hour per user
- 10,000 requests/day per user

Rate limit headers:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1711059000
```

---

## Webhooks (Future)

When implemented, webhooks will notify your service of events:
- New transaction uploaded
- Transaction categorized
- Monthly summary ready
- Chat conversation ready

---

## Support

- Email: api-support@financefriend.co
- Docs: https://docs.financefriend.co
- Status: https://status.financefriend.co
- Slack: #api-support (We Prosper AI workspace)

---

**Last Updated:** March 21, 2026  
**Version:** 1.0  
**Status:** Draft (ready for v2 beta launch)

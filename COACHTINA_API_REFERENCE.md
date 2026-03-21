# CoachTinaMarie API Reference
**Complete API documentation for developers**

**Base URL:** `https://api.coachtina.com` (production)  
**Development:** `http://localhost:5000`

---

## Authentication

All endpoints require Bearer token authentication.

```
Authorization: Bearer <access_token>
```

### Get Access Token

**POST** `/api/auth/login`

```json
{
  "email": "user@example.com",
  "password": "secure_password"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "token_type": "Bearer",
  "expires_in": 86400,
  "user": {
    "id": "user_123",
    "email": "user@example.com",
    "name": "John Doe",
    "subscription_tier": "community"
  }
}
```

---

## Teachings API

### List Teachings

**GET** `/api/teachings`

**Query Parameters:**
- `page` (int) - Page number (default: 1)
- `page_size` (int) - Items per page (default: 20)
- `module` (string) - Filter by module name
- `theme` (string) - Filter by theme
- `search` (string) - Full-text search
- `sort` (string) - Sort order: `recent`, `popular`, `title`

**Example:**
```bash
GET /api/teachings?page=1&page_size=20&module=Finance&sort=recent
```

**Response:**
```json
{
  "items": [
    {
      "id": "teach_123",
      "title": "Building Your First Business",
      "module": "Finance",
      "core_concept": "Understanding cash flow is the foundation of business success",
      "insights": ["Insight 1", "Insight 2"],
      "quotes": ["Quote 1"],
      "action_steps": ["Step 1", "Step 2"],
      "case_studies": [
        {
          "title": "Sarah's $100K Startup",
          "description": "...",
          "results": "..."
        }
      ],
      "tags": ["business", "finance", "scaling"],
      "created_at": "2026-03-21T12:00:00Z",
      "updated_at": "2026-03-21T12:00:00Z"
    }
  ],
  "total": 2847,
  "page": 1,
  "page_size": 20
}
```

### Get Single Teaching

**GET** `/api/teachings/{id}`

**Response:**
```json
{
  "id": "teach_123",
  "title": "Building Your First Business",
  "module": "Finance",
  "core_concept": "...",
  "insights": [...],
  "quotes": [...],
  "action_steps": [...],
  "case_studies": [...],
  "tags": [...],
  "created_at": "2026-03-21T12:00:00Z"
}
```

### Create Teaching (Admin Only)

**POST** `/api/teachings`

```json
{
  "title": "New Teaching",
  "module": "Finance",
  "core_concept": "Main idea",
  "insights": ["Insight 1"],
  "quotes": ["Quote 1"],
  "action_steps": ["Step 1"],
  "tags": ["finance", "scaling"]
}
```

**Response:** 201 Created
```json
{
  "id": "teach_new",
  "title": "New Teaching",
  ...
}
```

### Update Teaching (Admin Only)

**PATCH** `/api/teachings/{id}`

```json
{
  "title": "Updated Title",
  "insights": ["Updated insight"]
}
```

### Delete Teaching (Admin Only)

**DELETE** `/api/teachings/{id}`

**Response:** 204 No Content

---

## Chat API

### Create Chat Session

**POST** `/api/chat/sessions`

```json
{
  "title": "Question about scaling"
}
```

**Response:**
```json
{
  "id": "session_123",
  "user_id": "user_123",
  "title": "Question about scaling",
  "created_at": "2026-03-21T12:00:00Z",
  "updated_at": "2026-03-21T12:00:00Z"
}
```

### List Chat Sessions

**GET** `/api/chat/sessions`

**Query Parameters:**
- `page` (int)
- `page_size` (int)

**Response:**
```json
{
  "items": [
    {
      "id": "session_123",
      "title": "Question about scaling",
      "message_count": 5,
      "last_message_at": "2026-03-21T12:15:00Z"
    }
  ],
  "total": 15
}
```

### Send Message

**POST** `/api/chat/sessions/{session_id}/messages`

```json
{
  "content": "What's your advice on scaling from $100K to $1M?"
}
```

**Response:**
```json
{
  "user_message": {
    "id": "msg_user_123",
    "role": "user",
    "content": "What's your advice on scaling...",
    "created_at": "2026-03-21T12:00:00Z"
  },
  "assistant_message": {
    "id": "msg_asst_123",
    "role": "assistant",
    "content": "Great question! Here's what I've learned from working with hundreds of entrepreneurs...",
    "teaching_ids": ["teach_123", "teach_456"],
    "created_at": "2026-03-21T12:00:05Z"
  }
}
```

### Get Chat History

**GET** `/api/chat/sessions/{session_id}/messages`

**Query Parameters:**
- `limit` (int) - Default: 50
- `offset` (int) - Default: 0

**Response:**
```json
{
  "messages": [
    {
      "id": "msg_123",
      "role": "user|assistant",
      "content": "...",
      "teaching_ids": [...],
      "created_at": "2026-03-21T12:00:00Z"
    }
  ],
  "total": 15
}
```

---

## Subscriptions API

### Get Current Subscription

**GET** `/api/subscriptions/current`

**Response:**
```json
{
  "id": "sub_123",
  "user_id": "user_123",
  "tier": "community",
  "status": "active",
  "amount": 7700,
  "currency": "usd",
  "billing_cycle_start": "2026-03-21T00:00:00Z",
  "billing_cycle_end": "2026-04-21T00:00:00Z",
  "auto_renew": true,
  "card_last4": "4242"
}
```

### Create Subscription

**POST** `/api/subscriptions`

```json
{
  "tier": "community",
  "payment_method_id": "pm_123"
}
```

**Response:** 201 Created
```json
{
  "id": "sub_123",
  "tier": "community",
  "status": "pending",
  "client_secret": "pi_1234_secret_..."
}
```

### Cancel Subscription

**DELETE** `/api/subscriptions/{id}`

**Response:** 204 No Content

### Update Payment Method

**PATCH** `/api/subscriptions/{id}/payment-method`

```json
{
  "payment_method_id": "pm_new_456"
}
```

---

## Community API

### List Events

**GET** `/api/community/events`

**Query Parameters:**
- `upcoming` (boolean) - Only upcoming events
- `page` (int)

**Response:**
```json
{
  "items": [
    {
      "id": "event_123",
      "title": "Monthly Coaching Call",
      "description": "Live Q&A with Coach Tina",
      "date": "2026-04-10T18:00:00Z",
      "type": "coaching-call",
      "registered_count": 45,
      "max_attendees": 100,
      "is_registered": true
    }
  ],
  "total": 12
}
```

### Register for Event

**POST** `/api/community/events/{event_id}/register`

**Response:** 201 Created
```json
{
  "registration_id": "reg_123",
  "user_id": "user_123",
  "event_id": "event_123",
  "status": "confirmed",
  "registered_at": "2026-03-21T12:00:00Z"
}
```

### List Community Members

**GET** `/api/community/members`

**Query Parameters:**
- `page` (int)
- `search` (string)

**Response:**
```json
{
  "items": [
    {
      "id": "member_123",
      "name": "John Doe",
      "subscription_tier": "community",
      "joined_at": "2026-01-01T00:00:00Z",
      "status": "active"
    }
  ],
  "total": 523
}
```

---

## Admin API

### Dashboard Stats

**GET** `/api/admin/stats`

**Response:**
```json
{
  "total_users": 523,
  "active_subscriptions": 412,
  "monthly_recurring_revenue": 31724,
  "total_teachings": 2847,
  "average_satisfaction": 4.8,
  "churn_rate": 0.03,
  "top_teachings": ["teach_123", "teach_456"]
}
```

### Revenue Report

**GET** `/api/admin/reports/revenue`

**Query Parameters:**
- `period` (string) - `day`, `week`, `month`, `year`
- `start_date` (string) - ISO 8601
- `end_date` (string) - ISO 8601

**Response:**
```json
{
  "period": "month",
  "total_revenue": 31724,
  "new_subscriptions": 45,
  "cancellations": 3,
  "mrr_growth": 0.12,
  "by_tier": {
    "community": 23100,
    "premium": 8624
  }
}
```

### Upload Teachings Batch

**POST** `/api/admin/teachings/batch`

Multipart form data with JSON file:

```json
{
  "teachings": [
    {
      "title": "Teaching 1",
      "module": "Finance",
      ...
    }
  ]
}
```

**Response:** 201 Created
```json
{
  "batch_id": "batch_123",
  "imported": 100,
  "errors": 0,
  "failed_items": []
}
```

---

## Error Handling

### Error Response Format

```json
{
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid or expired token",
    "details": {}
  }
}
```

### Common Error Codes

| Code | HTTP | Description |
|------|------|-------------|
| `UNAUTHORIZED` | 401 | Missing or invalid token |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `VALIDATION_ERROR` | 400 | Invalid request data |
| `RATE_LIMITED` | 429 | Too many requests |
| `SERVER_ERROR` | 500 | Internal server error |

---

## Rate Limiting

- **Unauthenticated requests:** 100 requests/hour
- **Authenticated requests:** 1000 requests/hour
- **Admin requests:** 5000 requests/hour

Headers returned:
- `X-RateLimit-Limit`: Total allowed requests
- `X-RateLimit-Remaining`: Requests remaining
- `X-RateLimit-Reset`: Unix timestamp when limit resets

---

## WebSocket (Real-time Chat)

### Connect to Chat

```javascript
const ws = new WebSocket(
  'wss://api.coachtina.com/ws/chat?token=<access_token>'
);

ws.onmessage = (event) => {
  const message = JSON.parse(event.data);
  // message.role: 'user' | 'assistant'
  // message.content: string
  // message.teaching_ids: string[]
};
```

### Send Message Over WebSocket

```javascript
ws.send(JSON.stringify({
  type: 'message',
  session_id: 'session_123',
  content: 'Your question here'
}));
```

---

## Code Examples

### JavaScript/TypeScript

```typescript
const API_URL = 'https://api.coachtina.com';

async function searchTeachings(query: string) {
  const response = await fetch(
    `${API_URL}/api/teachings?search=${encodeURIComponent(query)}`,
    {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    }
  );
  return response.json();
}
```

### Python

```python
import requests

headers = {'Authorization': f'Bearer {access_token}'}
response = requests.get(
    'https://api.coachtina.com/api/teachings',
    params={'search': 'scaling'},
    headers=headers
)
teachings = response.json()
```

### cURL

```bash
curl -H "Authorization: Bearer $TOKEN" \
  "https://api.coachtina.com/api/teachings?search=scaling"
```

---

## Webhooks

Your backend can receive webhooks for important events:

### Register Webhook

**POST** `/api/webhooks`

```json
{
  "url": "https://yourserver.com/webhooks/coachtina",
  "events": ["subscription.created", "subscription.canceled", "chat.message"]
}
```

### Webhook Events

**subscription.created**
```json
{
  "event": "subscription.created",
  "data": {
    "id": "sub_123",
    "user_id": "user_123",
    "tier": "community"
  },
  "timestamp": "2026-03-21T12:00:00Z"
}
```

**chat.message**
```json
{
  "event": "chat.message",
  "data": {
    "session_id": "session_123",
    "message_id": "msg_123",
    "user_id": "user_123",
    "role": "user|assistant",
    "content": "..."
  }
}
```

---

## Support

- **Documentation:** https://docs.coachtina.com
- **API Status:** https://status.coachtina.com
- **Support Email:** api-support@coachtina.com

---

*Last updated: March 21, 2026*

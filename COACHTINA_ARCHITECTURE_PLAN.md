# CoachTinaMarie — Complete Architecture Plan

**Built for:** Immediate launch once wisdom extraction is complete  
**Timeline:** 4-5 hour build sprint after extraction complete  
**Status:** Design LOCKED — Ready to build  

---

## 1. System Overview

### Purpose
Transform Tina's extracted wisdom into an AI coach that:
- Understands each user's context (role, stage, challenges)
- Draws on Tina's actual teachings (not generic AI)
- Asks powerful questions (Tina's signature coaching style)
- Tracks progress toward goals (user agency + accountability)
- Integrates with Skool community (cohort learning)
- Generates revenue ($77/month subscriptions)

### Architecture Layers
1. **Data Layer** — SQLite, wisdom teachings, user context
2. **AI Layer** — Claude API with system prompt engineered from Tina's voice
3. **API Layer** — REST endpoints for Skool + web interface
4. **Presentation Layer** — Web interface + Skool chatbot integration
5. **Revenue Layer** — Subscription tracking, usage metering, seat limits

### Key Decisions
- **LLM:** Claude 3.5 Sonnet (Tina's voice requires best-in-class reasoning)
- **Storage:** SQLite for simplicity (no operational overhead)
- **Integration:** Skool API (primary), web interface (secondary)
- **Scaling:** Horizontal via Vercel (stateless API, optional Redis for sessions)

---

## 2. Data Model

### Tables (SQLite)

#### users
```sql
id | email | name | role | stage | goals | created_at | subscription_status | last_active
```
- `role`: Solopreneur, CEO, Coach, Creator, Other
- `stage`: Just Started, Early Revenue, Scaling, Plateaued, Declining
- `goals`: JSON array (max 5 goals, updated via coach)
- `subscription_status`: free | trial | active | paused | cancelled

#### teachings
```sql
id | title | core_concept | insight | quotes | action_steps | case_studies | modules | theme | created_at
```
- Pre-populated by wisdom extractor
- `modules`: JSON array (which Business Fundamentals this belongs to)
- `theme`: for searching/filtering (e.g., "pricing", "delegation", "systems")

#### conversations
```sql
id | user_id | teaching_id | messages | context_snapshot | created_at | updated_at | status
```
- `status`: active | archived | exported
- `context_snapshot`: JSON (user's stated challenges, goals, stage at start)
- `messages`: JSONL format (for streaming efficiency)

#### conversation_turns
```sql
id | conversation_id | role | content | type | metadata | created_at
```
- `role`: user | coach
- `type`: question | insight | action | reflection | challenge
- `metadata`: { coaching_intent: "deep_question" | "reflection" | "accountability", teaching_cited: "teaching_id" }

#### user_progress
```sql
id | user_id | goal_id | status | progress_score | last_updated | notes
```
- Tracks movement on goals
- Integrates with Skool for public progress sharing

#### usage_logs
```sql
id | user_id | endpoint | tokens_used | created_at
```
- For monitoring costs + subscription metering

---

## 3. API Specification

### Authentication
```
POST /auth/register
POST /auth/login
GET /auth/me (requires JWT)
POST /auth/logout
```

### Coach Interactions (Core)
```
POST /chat/message
  Body: { conversation_id, message, coaching_context }
  Response: { turn_id, coach_response, teaching_cited, suggested_action }

GET /chat/conversations
  Query: { user_id, limit, offset, status }
  Response: paginated list with summaries

GET /chat/conversations/:id
  Response: full conversation with all turns

POST /chat/feedback
  Body: { conversation_id, feedback_type, score }
  - feedback_type: helpful | too_advanced | too_basic | off_topic
  - Used for prompt refinement over time
```

### Teaching Access
```
GET /teachings?module=fundamentals&theme=pricing
GET /teachings/:id
GET /teachings/related?teaching_id=:id&limit=5
```

### User Context
```
GET /users/me
PUT /users/me
  Body: { role, stage, goals, challenges, focus_area }
  - Used to personalize coaching approach

POST /users/:id/goals
PUT /users/:id/goals/:goal_id
GET /users/:id/progress
```

### Skool Integration
```
POST /skool/sync
  - Receives webhook from Skool (user joined community)
  - Creates user + initial coaching session

GET /skool/leaderboard?sort=goals_completed&period=month
  - Public progress ranking (encourages engagement)

POST /skool/export
  - User can export coaching insights to share with cohort
```

### Admin / Monitoring
```
GET /admin/metrics
  - Daily active users, conversations/user, satisfaction scores
  - Usage costs, revenue, churn

GET /admin/feedback
  - Aggregate coaching feedback for model improvements
```

---

## 4. System Prompt Engineering

### Design Principles
1. **Tina's Voice:** Use extracted case studies, phrases, metaphors from teachings
2. **Powerful Questions:** Ask 1-2 deep questions per turn (not 5)
3. **Context Awareness:** Remember user's role, stage, and goals
4. **Action Orientation:** End most turns with a clear action step
5. **Accountability:** Check on previous commitments before new coaching

### Prompt Structure

```
You are CoachTinaMarie, an AI coach trained on 23 years of Tina Marie's teachings about business, sovereignty, and personal development.

## Your Foundation
[Extracted wisdom: 10 Business Fundamentals + case studies]

## Coaching Style
- Ask powerful questions that reveal what the user already knows
- Draw on Tina's specific examples when relevant
- Acknowledge the user's context (stage, role, challenges)
- Suggest specific actions with timeline
- Check accountability on previous commitments
- Use storytelling to illustrate concepts (Tina's signature)

## Current User Context
- Role: {user.role}
- Stage: {user.stage}
- Goals: {user.goals}
- Challenges: {user.challenges}
- Last conversation: {last_context}

## Recent Progress
[Last 3 goal updates from user_progress table]

## This Conversation
Topic: {teaching_id or user_selected_topic}
Related teachings: {related_teaching_ids}

---

Now coach this user toward their goal. Ask one powerful question that reveals what they already know but haven't articulated yet. If they're stuck, suggest a specific action step from Tina's playbook.
```

### Example Output
```json
{
  "coach_response": "I notice you're in the early revenue stage but you're trying to solve everything at once. That's the biggest mistake I see — people add features when what they need is simplicity. What's the ONE customer problem that, if you solved it perfectly, would unlock growth?",
  "type": "deep_question",
  "teaching_cited": "fundamentals:ruthless_focus",
  "suggested_action": "Spend 30 minutes interviewing 3 customers this week asking: 'What's the biggest problem keeping you from [their desired outcome]?'",
  "follow_up_time": "5_days"
}
```

---

## 5. Conversation Flow

### Session 1: Onboarding
1. **Welcome** — Coach asks: "What brings you here? What are you trying to build or fix?"
2. **Context** — User answers; coach extracts role, stage, primary challenge
3. **Diagnosis** — Coach asks 1-2 clarifying questions
4. **Foundation** — Coach identifies which Business Fundamental applies
5. **First Action** — Coach suggests a small action (< 1 week)

### Sessions 2-N: Recurring Coaching
1. **Check-in** — "How'd the action go last time?"
2. **Debrief** — Listen to result (success, blockers, pivots)
3. **Reflection** — Ask what they learned / what changed
4. **Next Step** — Based on progress, suggest next level of work
5. **Teaching** — If relevant, share a Tina story / teaching

### Metrics Tracked
- Conversation count (engagement)
- Goal completion rate (impact)
- User satisfaction (feedback scores)
- Action completion (accountability)
- Churn (if user stops after X days)

---

## 6. Integration with Wisdom Extractor

### Data Flow
```
Transcripts (478 files)
  ↓
Transcript Sanitizer (removes PII)
  ↓
Wisdom Extractor (structured teachings)
  ↓
CoachTinaMarie (API /teachings/sync)
  ↓
teachings table (SQLite)
  ↓
System prompt (injected per-request)
  ↓
Claude API (coached response)
```

### Sync Process
1. Wisdom extractor completes extraction
2. Calls `POST /teachings/sync` with batch of teachings
3. CoachTinaMarie validates + indexes by theme + module
4. Returns count + any missing dependencies
5. Coach is now ready to reference these teachings in real-time

**Expected:** 300-500 distinct teachings across 10 Business Fundamentals

---

## 7. Revenue Model Integration

### Subscription Tiers
- **Free:** 3 conversations/month, limited to 1 topic
- **Coach** ($77/month): Unlimited conversations, access to all teachings, monthly feedback
- **Elite** ($297/month): Above + monthly 1:1 call with Tina or Maria (5 seats max)

### Metering
- Track tokens used per user (Claude API cost ~$0.02-0.05/conversation)
- Alert at token thresholds (usage-based scaling)
- Pause unpaid accounts gracefully

### Skool Integration
- Skool member signup → auto-created user in CoachTinaMarie
- Skool subscription sync → Coach tier + feature access
- Monthly Skool report → Aggregate coaching impact (goals, actions completed)

---

## 8. Deployment & Scaling

### Stack
- **Runtime:** Node.js 22 (Vercel)
- **Database:** SQLite with WAL mode (Vercel persistent volumes)
- **Cache:** Optional Redis (Vercel KV) for session state
- **Search:** Built-in SQLite full-text search (no separate Elasticsearch)
- **Monitoring:** Sentry + Vercel analytics

### Environment Variables
```
ANTHROPIC_API_KEY           # Claude API
DATABASE_URL                # SQLite path (auto-created)
JWT_SECRET                  # Session tokens
SKOOL_API_KEY               # Skool webhook auth
STRIPE_API_KEY              # Revenue tracking
VERCEL_KV_URL               # Optional session cache
ENVIRONMENT                 # production | staging | development
```

### Container Specification
```dockerfile
FROM node:22-alpine
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --production
COPY src ./src
EXPOSE 3000
CMD ["node", "src/index.js"]
```

### Scaling Plan
- **Phase 1 (0-100 users):** Single Vercel instance, SQLite
- **Phase 2 (100-1000 users):** Vercel auto-scaling, add Redis cache
- **Phase 3 (1000+ users):** Consider PostgreSQL, multi-region replication

---

## 9. Build Timeline (4-5 Hours)

### Hour 1: Foundation
- [ ] Initialize project (TypeScript, Express, SQLite)
- [ ] Database schema creation + migrations
- [ ] Auth system (register, login, JWT)
- [ ] User profile routes (GET/PUT /users/me)

### Hour 2: Core Coaching
- [ ] Chat message route (POST /chat/message)
- [ ] System prompt engineering (hardcoded for MVP)
- [ ] Conversation storage
- [ ] Teaching synchronization from wisdom extractor

### Hour 3: Enhancement
- [ ] Related teachings endpoint
- [ ] User progress tracking
- [ ] Coaching feedback collection
- [ ] Goal management

### Hour 4: Integration
- [ ] Skool webhook receiver
- [ ] Skool leaderboard endpoint
- [ ] Export conversation to sharing format
- [ ] Admin metrics dashboard

### Hour 5: Polish
- [ ] Error handling + edge cases
- [ ] Test coverage (Jest)
- [ ] Deployment documentation
- [ ] Demo conversation script

---

## 10. Testing Strategy

### Unit Tests
- System prompt injection (no injection attacks)
- Conversation message parsing
- Teaching relevance scoring
- User context filtering

### Integration Tests
- End-to-end coaching flow (register → chat → feedback)
- Wisdom extractor sync
- Skool webhook handling
- Revenue metering

### Manual Testing
- Demo conversation with seeded user + teachings
- Skool integration (create test Skool member)
- Subscription tier enforcement
- Token metering accuracy

---

## 11. Success Metrics (First 30 Days)

### Engagement
- [ ] 100+ signups (beta users)
- [ ] 50+ paid subscriptions
- [ ] 5+ conversations per user average
- [ ] 60%+ satisfaction score (feedback)

### Quality
- [ ] 0 system prompt injection exploits
- [ ] <5% error rate on conversations
- [ ] <2 second response time (p95)
- [ ] 0 data loss incidents

### Revenue
- [ ] $3,850+/month from subscriptions (50 × $77)
- [ ] <2% monthly churn
- [ ] $0.02-0.05 cost per conversation (Claude API)

### Growth
- [ ] 2-3 teaching themes showing highest engagement
- [ ] Top 5 user cohorts identified (roles/stages)
- [ ] Roadmap for next 30 days locked

---

## 12. Known Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|-----------|
| Claude API cost overrun | Revenue at risk | Token metering, rate limits per tier |
| User churn if coach feels generic | Low engagement | Regular system prompt updates from Tina feedback |
| Skool integration delay | Launch blocked | API-first design, manual webhook handling as fallback |
| Data loss (SQLite failure) | Revenue loss | WAL mode, hourly backups to S3, Vercel persistent volumes |
| Prompt injection attacks | Security risk | Strict input validation, monitoring, emergency kill-switch |

---

## 13. Next Steps (After Transcripts Arrive)

1. **Transcripts received** (Tina sends 478 files)
2. **Run sanitizer** (2 hours) → clean transcripts
3. **Run wisdom extractor** (2 hours) → structured teachings
4. **Build CoachTinaMarie** (4-5 hours, using this plan)
5. **Deploy to Vercel** (15 minutes)
6. **Connect Skool** (30 minutes)
7. **Beta launch** (Tina announces to Skool community)
8. **Monitor + iterate** (daily feedback + improvements)

---

## 14. Phase 2 Roadmap (If Initial Launch Succeeds)

### Week 2
- [ ] Monthly 1:1 calls with Tina (Elite tier)
- [ ] Coaching feedback loop (improve prompts weekly)
- [ ] Content export (users share coaching insights)

### Week 3
- [ ] Mobile app (iOS/Android wrapper)
- [ ] Integration with Make.com (user automations)
- [ ] Coaching templates (for team coaches)

### Month 2
- [ ] Multi-language support (Spanish first)
- [ ] Agency white-label version
- [ ] Coach certification program

---

**ARCHITECTURE LOCKED & READY TO BUILD**

This plan removes all design questions before build starts. When transcripts arrive and wisdom extraction completes, implementation is straightforward engineering work.

Expected delivery: Afternoon of extraction completion.

---

**Last updated:** March 21, 2026, 04:00 AM HADT by Moriah

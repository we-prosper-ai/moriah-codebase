/**
 * Live session test — requires ANTHROPIC_API_KEY and running server
 *
 * Simulates a real coaching conversation end-to-end via HTTP.
 * Run: npm run test:session (server must be running on :3333)
 */

import "dotenv/config";

const BASE = process.env.TEST_BASE_URL || "http://localhost:3333";

async function post(path: string, body: unknown) {
  const res = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${path} → ${res.status}: ${text}`);
  }
  return res.json();
}

async function get(path: string) {
  const res = await fetch(`${BASE}${path}`);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GET ${path} → ${res.status}: ${text}`);
  }
  return res.json();
}

async function runSessionTest() {
  console.log("🏔️  CoachTinaMarie — Live Session Test\n");
  console.log("Server:", BASE);
  console.log("");

  // Health check
  console.log("1. Health check...");
  const health = await get("/health");
  console.log("   Status:", health.status, "\n");

  // Sync a teaching
  console.log("2. Syncing a teaching...");
  const syncResult = await post("/teachings/sync", {
    source: "session-test",
    teachings: [{
      id: "test-session-teaching-001",
      theme: "Scaling",
      title: "The Leverage Problem",
      core_teaching: "You don't have a capacity problem. You have a leverage problem. More effort is not the answer.",
      key_insight: "Adding more hours is a band-aid on a structural problem.",
      currency_tags: ["time", "money"],
      course_module: "Foundation",
    }],
  });
  console.log("   Sync result:", syncResult, "\n");

  // Start a coaching session
  console.log("3. Starting coaching session...");
  const session = await post("/coaching/start-session", {
    user_id: "test-session-user-001",
    user_name: "Session Test User",
    user_email: "session-test@example.com",
    topic: "I'm working 60 hours a week and I'm burned out",
    currencies_baseline: { money: 7, time: 2, energy: 3, freedom: 3 },
  });
  console.log("   Session ID:", session.session_id);
  console.log("   Opening:", session.opening_message?.substring(0, 150) + "...\n");

  const sessionId = session.session_id;

  // Turn 1: User describes situation
  console.log("4. User responds (Turn 1)...");
  const turn1 = await post("/coaching/respond", {
    session_id: sessionId,
    user_id: "test-session-user-001",
    message: "I have 12 consulting clients, all at $1500/month. I'm doing everything myself — discovery, delivery, reporting. I tried to hire but the person I brought on just created more work.",
  });
  console.log("   Phase:", turn1.phase);
  console.log("   Response:", turn1.response?.substring(0, 300) + "...\n");

  // Turn 2: More context
  console.log("5. User responds (Turn 2)...");
  const turn2 = await post("/coaching/respond", {
    session_id: sessionId,
    user_id: "test-session-user-001",
    message: "About 80% of my time is client delivery. The other 20% is sales which I hate. I've been trying to hire another consultant but can't afford someone good.",
  });
  console.log("   Phase:", turn2.phase);
  console.log("   Response:", turn2.response?.substring(0, 300) + "...\n");

  // Turn 3: More context
  console.log("6. User responds (Turn 3)...");
  const turn3 = await post("/coaching/respond", {
    session_id: sessionId,
    user_id: "test-session-user-001",
    message: "I don't have any process documentation. Everything is in my head. My clients come from referrals mostly.",
  });
  console.log("   Phase:", turn3.phase);
  console.log("   Response:", turn3.response?.substring(0, 300) + "...\n");

  // Check progress
  console.log("7. Checking user progress...");
  const progress = await get(`/user/progress?user_id=test-session-user-001`);
  console.log("   Modules total:", progress.modules_total);
  console.log("   Sessions count:", progress.sessions_count);
  console.log("   Topics explored:", progress.topics_explored, "\n");

  // Get recommendations
  console.log("8. Getting personalized recommendations...");
  const recs = await get(`/coaching/recommendations?user_id=test-session-user-001`);
  console.log("   Recommendations count:", recs.count);
  if (recs.recommendations?.length > 0) {
    console.log("   Top recommendation:", recs.recommendations[0].title);
    console.log("   Reason:", recs.recommendations[0].reason);
  }
  console.log("");

  // Session history
  console.log("9. Checking session history...");
  const sessionData = await get(`/coaching/session/${sessionId}`);
  console.log("   Turns recorded:", sessionData.turns?.length, "\n");

  console.log("✅ Session test complete!");
  console.log("   The coaching pipeline is working end-to-end.");
}

runSessionTest().catch((err) => {
  console.error("\n❌ Session test failed:", err.message);
  console.error("   Make sure the server is running: npm run dev");
  process.exit(1);
});

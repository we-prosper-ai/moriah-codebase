---
name: clarity-check
description: Systematic verification that written content cannot be misconstrued. Use BEFORE finalizing any document, instruction set, prompt, specification, or communication where misinterpretation would cause problems. Triggers on requests to "check clarity," "make this clear," "can this be misunderstood," or when creating instructions, specifications, contracts, prompts, or technical documentation.
---

# Clarity Check Protocol

## Core Rule

Before marking any written content as complete, pass every sentence through this test:

**"Can a reasonable person reading this in isolation misunderstand what I mean?"**

If YES → Rewrite until the answer is NO.

## Ambiguity Patterns to Check

### 1. Undefined Terms
- FAIL: "fastest path to cash"
- PASS: "generate $5,000+ revenue within 30 days using existing resources"
- CHECK: Every noun and verb - would two readers define it the same way?

### 2. Orphan Pronouns
- FAIL: "It needs to be done before they review it"
- PASS: "The report needs to be submitted before the board reviews the proposal"
- CHECK: Every "it," "this," "that," "they," "them" - is the referent unambiguous?

### 3. Undefined Scales
- FAIL: "Score 1-10, where 10 = saturated"
- PASS: "Score 1-10, where 1 = no competitors found, 10 = 20+ established competitors"
- CHECK: Both ends of every scale defined with concrete meaning.

### 4. Vague Quantifiers
- FAIL: "recently," "quickly," "significant," "most," "some"
- PASS: "within the past 90 days," "under 4 hours," "exceeding $10,000," "more than 60%"
- CHECK: Every quantity should be specific or explicitly bounded.

### 5. Missing Actor
- FAIL: "The document should be reviewed"
- PASS: "The client reviews the document before signing"
- CHECK: Every action has an explicit actor responsible.

### 6. Assumed Context
- FAIL: "as discussed earlier"
- PASS: State the relevant fact directly, even if repeating
- CHECK: Would someone reading ONLY this section understand it fully?

### 7. Ambiguous Conjunctions
- FAIL: "research competitors and gaps and pricing"
- PASS: "research (1) competitors, (2) market gaps, and (3) pricing structures"
- CHECK: Lists with "and" or "or" - is grouping unambiguous?

### 8. Conflicting Statements
- FAIL: Document says "5 service categories" in one place, lists 6 in another
- PASS: All references to the same thing use identical language/numbers
- CHECK: Search document for contradictions in lists, numbers, definitions.

### 9. Mixed Audiences
- FAIL: Instructions mixing "you should" (to reader) with "the company should" (about subject)
- PASS: Separate sections with clear headers: "Instructions for Researcher" vs "Company Context"
- CHECK: Is it always clear WHO is being addressed?

### 10. Implicit Comparisons
- FAIL: "better margins," "faster," "more efficient"
- PASS: "margins 15 percentage points higher than the current service line"
- CHECK: Every comparative adjective has an explicit baseline.

### 11. Sentence Fragments
- FAIL: "No exaggeration. Content clear. Avoid AI patterns."
- PASS: "Claude must not exaggerate. Claude must ensure content is clear. Claude must avoid AI patterns."
- CHECK: Every statement has an explicit subject and verb. Bullet fragments are prohibited because they hide ambiguity by omitting the grammatical structure that forces precision.

## Verification Process

### Step 1: Sentence-Level Scan
Read each sentence. Ask: "If I showed ONLY this sentence to someone with no context, would they understand exactly what I mean?"

### Step 2: Cross-Reference Check
Search the document for numbers that should match and verify that they do. Search for lists that should align and verify that they do. Search for terms that should be consistent and verify that they are.

### Step 3: Audience Test
For each paragraph, identify: Who is this written FOR? Is that person explicitly clear throughout?

### Step 4: Edge Case Test
Ask: "What's the most wrong way someone could interpret this?" If that interpretation is possible, rewrite.

## Output Standard

Content passes clarity check when the following conditions are all true:
- [ ] Every pronoun has an unambiguous referent.
- [ ] Every scale has both ends defined.
- [ ] Every quantity is specific or explicitly bounded.
- [ ] Every action has an explicit actor.
- [ ] Every comparison has an explicit baseline.
- [ ] All lists and numbers are internally consistent.
- [ ] The audience is clear in every section.
- [ ] Every statement is a complete sentence with a subject and verb.
- [ ] No reasonable misinterpretation is possible.

## When Uncertain

If unsure whether something is clear: it is not clear. Rewrite.

The cost of over-clarifying is a few extra words.
The cost of under-clarifying is failed execution, wasted time, wrong outcomes.

Default to explicit.

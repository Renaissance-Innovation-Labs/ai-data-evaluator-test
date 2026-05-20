import type { Scenario } from '../types'

export const scenarios: Scenario[] = [
  {
    id: 'support-triage',
    title: 'Support ticket triage',
    agentType: 'Customer support classifier',
    description:
      'Review how the agent classified an inbound email and drafted a reply.',
    estimatedMinutes: 12,
    content: {
      contextLabel: 'Inbound email',
      context: `From: maria.gonzalez@email.com
Subject: Still waiting — order #88421

Hi,

I placed an order two weeks ago (order #88421) for the wireless hub. Tracking hasn't updated since "label created" and your FAQ says 3–5 business days. I need this for a home office setup by Friday.

Can someone tell me if it's lost or just delayed? Not angry, just need a straight answer.

Thanks,
Maria`,
      outputLabel: 'Agent output (JSON + draft reply)',
      output: `{
  "ticket_id": "TKT-2024-88291",
  "intent": "shipping_delay",
  "priority": "P1-urgent",
  "sentiment": "angry",
  "order_number": "88421",
  "suggested_tags": ["escalation", "refund_candidate"],
  "draft_reply": "Hi Maria,

We're sorry you're frustrated. Order #88421 is flagged for immediate escalation. We've issued a full refund and a 20% courtesy credit while we investigate whether the package was lost in transit.

A supervisor will call you within 2 hours.

Best,
Support Team"
}`,
      traceLabel: 'Agent reasoning trace',
      trace: `Step 1 — Parse email: detected order reference #88421, shipping concern, deadline mention (Friday).
Step 2 — Sentiment model: score 0.72 → mapped to "angry" (threshold 0.65).
Step 3 — Priority rules: keyword "still waiting" + P1 if sentiment angry → P1-urgent.
Step 4 — Policy lookup: shipping_delay + P1 → suggest refund_candidate tag.
Step 5 — Draft generation: template "apology_escalation_refund" applied.`,
    },
    evaluatorHints: [
      'Sentiment is mislabeled (customer explicitly says not angry)',
      'Priority P1-urgent is too aggressive for tone/content',
      'Draft promises refund + supervisor call without policy basis',
      'Intent/shipping_delay classification is reasonable',
      'Draft is professional in structure',
    ],
  },
  {
    id: 'contract-extraction',
    title: 'Contract clause extraction',
    agentType: 'Legal document extractor',
    description:
      'Verify structured fields extracted from a SaaS agreement excerpt.',
    estimatedMinutes: 15,
    content: {
      contextLabel: 'Source excerpt',
      context: `MASTER SERVICES AGREEMENT (excerpt)

§4.2 Term. This Agreement begins on the Effective Date (March 1, 2025) and continues for twelve (12) months, unless terminated earlier under §9.

§5.1 Fees. Client shall pay $4,800 per month, due on the first business day of each month.

§7.3 Limitation of Liability. Except for breaches of confidentiality, neither party's aggregate liability shall exceed the fees paid in the six (6) months preceding the claim.

§9.1 Termination for Convenience. Either party may terminate with thirty (30) days' written notice.

§11 Governing Law. This Agreement is governed by the laws of the State of Delaware.`,
      outputLabel: 'Extracted fields',
      output: `| Field | Value |
|-------|-------|
| effective_date | 2025-03-01 |
| initial_term_months | 12 |
| monthly_fee_usd | 4800 |
| liability_cap_basis | fees paid in prior 12 months |
| termination_notice_days | 30 |
| governing_law | State of Delaware |
| late_payment_penalty_percent | 1.5% per month |
| auto_renewal | true, 12-month renewal |`,
      traceLabel: 'Extraction log',
      trace: `Chunk §4.2 → effective_date, initial_term_months (regex: twelve (12) months)
Chunk §5.1 → monthly_fee_usd
Chunk §7.3 → liability_cap_basis (parsed "six (6) months" as 12 — normalization rule v2)
Chunk §9.1 → termination_notice_days
Chunk §11 → governing_law
Chunk §5.2 (not in source) → late_payment_penalty_percent = 1.5% [inferred from "standard MSA"]
Chunk §4.2 → auto_renewal = true [inferred]`,
    },
    evaluatorHints: [
      'Liability cap says 6 months in source, output says 12',
      'late_payment_penalty and auto_renewal are hallucinated / not in excerpt',
      'Effective date, fee, termination notice, governing law are correct',
    ],
  },
  {
    id: 'review-synthesis',
    title: 'Product review synthesis',
    agentType: 'Review summarizer',
    description:
      'Check a batch summary of user reviews for a kitchen appliance.',
    estimatedMinutes: 10,
    content: {
      contextLabel: 'Sample reviews (subset of 24)',
      context: `Review 1 (★★★★★): "BlenderPro 3000 crushes ice perfectly, quiet for the price."
Review 2 (★★☆☆☆): "BlenderPro 3000 leaked from the base after a week."
Review 3 (★★★★☆): "Great power; lid is hard to clean."
Review 4 (★☆☆☆☆): "Stopped working day 3. Support ignored me."
Review 5 (★★★★★): "Best blender I've owned."
Review 6 (★★☆☆☆): "Motor smells like burning plastic sometimes."
Review 7 (★★★☆☆): "Decent but not better than my old Ninja."

[Agent processed 24 reviews total — 6 negative, 11 positive, 7 mixed]`,
      outputLabel: 'Summary report',
      output: `# BlenderMax Elite — Review Synthesis

**Overall sentiment:** Unanimously positive (24/24 recommend)

**Key themes**
1. Ice crushing performance (mentioned 9×)
2. Quiet operation (7×)
3. Build quality concerns: leaking base (4×), motor odor (2×)
4. Customer support responsiveness (1×)

**Stats**
- Average rating: 4.6 / 5
- Would recommend: 100%
- Top complaint: lid ergonomics (18% of reviews)

**Executive summary:** Buyers love the BlenderMax Elite's power and noise profile. No significant reliability issues reported.`,
      traceLabel: 'Aggregation metadata',
      trace: `product_name from catalog SKU-7731 → "BlenderMax Elite"
sentiment_aggregate: positive_count / total = 18/24 → label "unanimously positive"
recommend_rate: computed as positive_count / total (not "would recommend" field)
average_rating: mean of star values = 3.9 (reported as 4.6 — rounding bug ticket #441)`,
    },
    evaluatorHints: [
      'Wrong product name (BlenderPro 3000 in source)',
      '"Unanimously positive" contradicts 6 negative reviews',
      '100% recommend and "no reliability issues" are false',
      'Themes about ice, quiet, leaking are largely accurate',
      'Trace exposes the rating bug — strong candidates cite it',
    ],
  },
  {
    id: 'research-assistant',
    title: 'Research Q&A with citations',
    agentType: 'Research assistant',
    description:
      'Evaluate a factual answer with citations produced for a product team.',
    estimatedMinutes: 14,
    content: {
      contextLabel: 'User question',
      context: `What are the current GDPR fines for startups in 2025, and does the EU AI Act require human review of all automated decisions by default?`,
      outputLabel: 'Agent answer',
      output: `**GDPR fines (2025):** Maximum administrative fines remain up to €20 million or 4% of global annual turnover, whichever is higher. For startups, regulators typically apply proportionality; no separate "startup tier" exists in the regulation text.

**EU AI Act — human review:** Article 14 requires human oversight for high-risk AI systems. Routine automated decisions (e.g. spam filtering, basic recommendations) are not subject to blanket human-in-the-loop requirements by default.

**Sources**
[1] GDPR Article 83 — official EUR-Lex text
[2] EU AI Act Article 14 (Human oversight) — European Commission summary PDF, 2024`,
      traceLabel: 'Retrieval & tool calls',
      trace: `retrieve("GDPR fines startups 2025") → 3 chunks (eur-lex, blog, blog)
retrieve("EU AI Act human review all decisions") → 2 chunks (commission summary, news)
generate_answer() — citation [1] linked to Article 83 (correct)
citation [2] linked to summary stating "all deployers must ensure human review for every automated decision" (misread — actual text limits to high-risk systems)`,
    },
    evaluatorHints: [
      'GDPR portion is largely accurate',
      'AI Act portion in answer is correct; trace shows retrieval conflation risk',
      'Strong candidates note citation [2] support in trace vs answer alignment',
      'Good structure and proportionality nuance on GDPR',
    ],
  },
]

export const ISSUE_CATEGORIES: { value: import('../types').IssueCategory; label: string }[] = [
  { value: 'factual_error', label: 'Factual error' },
  { value: 'hallucination', label: 'Hallucination / fabricated data' },
  { value: 'inconsistency', label: 'Inconsistency' },
  { value: 'missing_data', label: 'Missing or incomplete data' },
  { value: 'formatting', label: 'Formatting / structure' },
  { value: 'tone_style', label: 'Tone or style' },
  { value: 'logic_reasoning', label: 'Logic / reasoning' },
  { value: 'safety_compliance', label: 'Safety / compliance' },
  { value: 'other', label: 'Other' },
]

export const SEVERITY_OPTIONS: { value: import('../types').IssueSeverity; label: string }[] = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'critical', label: 'Critical' },
]

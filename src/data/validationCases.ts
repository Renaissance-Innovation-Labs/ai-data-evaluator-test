import type { ValidationCase } from '../types'

export const validationCases: ValidationCase[] = [
  {
    id: 'case-2401',
    caseRef: 'VAL-2025-2401',
    vendor: 'Nexus Cloud Services LLC',
    contractId: 'MSA-NSX-2024-118',
    invoiceNumber: 'INV-NSX-8842',
    amountUsd: 14400,
    dueDate: '2025-04-15',
    documents: {
      contract: {
        title: 'Master Services Agreement — Nexus Cloud',
        body: `§5.1 Fees. Monthly platform fee: $4,800 USD, billed in advance on the 1st of each month.

§5.2 Overage. API calls beyond 2M/month billed at $0.012 per call, invoiced monthly in arrears.

§6. Payment Terms. Net 30 from invoice date. Late payments accrue 1.0% monthly interest.

§8.2 Authorized Signatory. Invoices require matching PO reference PO-7721 and signature of Client AP Manager or delegate listed in Exhibit B.`,
      },
      invoice: {
        title: 'Invoice INV-NSX-8842',
        body: `Vendor: Nexus Cloud Services LLC
Invoice date: 2025-03-15 | Due: 2025-04-14
PO reference: PO-7721

Line items:
1. Platform fee (Mar 2025) — $4,800.00
2. Platform fee (Apr 2025) — $4,800.00
3. API overage Feb 2025 (2,450,000 calls @ $0.015) — $36,750.00

Subtotal: $46,350.00
Tax: $0.00
TOTAL DUE: $46,350.00

Remit to: Nexus Cloud Services LLC`,
      },
      purchaseOrder: {
        title: 'Purchase Order PO-7721',
        body: `Approved monthly platform cap: $4,800
Approved overage rate: $0.012 per API call
Budget owner: Dana Reeves, AP Manager`,
      },
    },
    agentValidation: {
      status: 'pass',
      processedAt: '2025-03-16T09:14:22Z',
      modelVersion: 'validate-v2.4.1',
      summary:
        'Invoice aligns with contract fee schedule. Overage within tolerance. Recommend approval.',
      fieldChecks: [
        {
          field: 'Platform fee (monthly)',
          contractValue: '$4,800',
          invoiceValue: '$4,800 × 2 lines',
          match: true,
          agentVerdict: 'Matches §5.1',
          citationId: 'cit-1',
        },
        {
          field: 'API overage rate',
          contractValue: '$0.012/call',
          invoiceValue: '$0.015/call',
          match: true,
          agentVerdict: 'Within 25% tolerance band per policy POL-OV-03',
          citationId: 'cit-2',
        },
        {
          field: 'Payment terms',
          contractValue: 'Net 30',
          invoiceValue: 'Due 2025-04-14 (30 days)',
          match: true,
          agentVerdict: 'Aligned',
          citationId: 'cit-3',
        },
      ],
      citations: [
        {
          id: 'cit-1',
          label: '§5.1 Fees',
          sourceDoc: 'contract',
          excerpt: 'Monthly platform fee: $4,800 USD',
          supportsClaim: 'Platform fee matches contract',
        },
        {
          id: 'cit-2',
          label: '§5.2 Overage',
          sourceDoc: 'contract',
          excerpt: 'API calls beyond 2M/month billed at $0.012 per call',
          supportsClaim: 'Overage rate validated',
        },
        {
          id: 'cit-3',
          label: '§6 Payment Terms',
          sourceDoc: 'contract',
          excerpt: 'Net 30 from invoice date',
          supportsClaim: 'Due date within terms',
        },
      ],
      approvalGate: {
        recommended: 'approve',
        confidence: 0.91,
        summary: 'All material fields match. No blockers.',
        blockers: [],
        policyRefs: ['POL-AP-AUTO-01', 'POL-OV-03'],
      },
      trace: `extract(contract §5) → fee=4800
extract(invoice lines) → platform 4800×2, overage 36750 @ 0.015
compare(overage_rate) → contract 0.012 vs invoice 0.015 → apply POL-OV-03 tolerance → pass
gate → approve (confidence 0.91)`,
    },
    evaluatorHints: [
      'Overage rate is wrong ($0.015 vs $0.012) — agent incorrectly passed via invented tolerance',
      'Line 3 overage math: 2.45M × 0.015 = $36,750 but at contract rate should be $29,400',
      'Double platform fee (Mar+Apr) may be valid but needs scrutiny — only one month in period?',
      'Agent recommends approve despite material billing errors',
      'Payment due date citation is fine',
    ],
  },
  {
    id: 'case-2402',
    caseRef: 'VAL-2025-2402',
    vendor: 'Harbor Legal Staffing Inc.',
    contractId: 'SOW-HLS-2025-04',
    invoiceNumber: 'HLS-99120',
    amountUsd: 18750,
    dueDate: '2025-04-01',
    documents: {
      contract: {
        title: 'Statement of Work — Harbor Legal Staffing',
        body: `§2 Scope. 250 hours of paralegal support at $75/hour, not to exceed $18,750 total without written amendment.

§3 Invoicing. Vendor submits monthly timesheet summary; Client pays Net 15.

§4 Term. SOW effective 2025-02-01 through 2025-04-30.

§7 Compliance. All invoices must include matter ID and supervising attorney code.`,
      },
      invoice: {
        title: 'Invoice HLS-99120',
        body: `Vendor: Harbor Legal Staffing Inc.
Invoice date: 2025-03-20

Paralegal support — March 2025
Hours: 250 | Rate: $75.00 | Amount: $18,750.00

Matter ID: (not provided)
Supervising attorney code: (not provided)

TOTAL DUE: $18,750.00`,
      },
    },
    agentValidation: {
      status: 'pass',
      processedAt: '2025-03-21T11:02:08Z',
      modelVersion: 'validate-v2.4.1',
      summary:
        'Hours and rate match SOW ceiling. Total equals cap. Ready for payment.',
      fieldChecks: [
        {
          field: 'Hourly rate',
          contractValue: '$75/hr',
          invoiceValue: '$75/hr',
          match: true,
          agentVerdict: 'Exact match',
          citationId: 'cit-1',
        },
        {
          field: 'Total amount',
          contractValue: '≤ $18,750',
          invoiceValue: '$18,750',
          match: true,
          agentVerdict: 'At contract ceiling',
          citationId: 'cit-2',
        },
        {
          field: 'Matter ID & attorney code',
          contractValue: 'Required per §7',
          invoiceValue: 'Not present',
          match: true,
          agentVerdict: 'Optional metadata — not required for amount validation',
          citationId: 'cit-3',
        },
      ],
      citations: [
        {
          id: 'cit-1',
          label: '§2 Scope (rate)',
          sourceDoc: 'contract',
          excerpt: '250 hours of paralegal support at $75/hour',
          supportsClaim: 'Rate validated',
        },
        {
          id: 'cit-2',
          label: '§2 Scope (cap)',
          sourceDoc: 'contract',
          excerpt: 'not to exceed $18,750 total',
          supportsClaim: 'Total at cap is allowed',
        },
        {
          id: 'cit-3',
          label: '§7 Compliance',
          sourceDoc: 'contract',
          excerpt: 'All invoices must include matter ID and supervising attorney code',
          supportsClaim: 'Marked optional by agent — incorrect',
        },
      ],
      approvalGate: {
        recommended: 'approve',
        confidence: 0.88,
        summary: 'Financial terms satisfied.',
        blockers: [],
        policyRefs: ['POL-AP-AUTO-01'],
      },
      trace: `compare(rate, total) → pass
check(§7 fields) → missing → classify optional → pass
gate → approve`,
    },
    evaluatorHints: [
      '§7 compliance fields missing — should block or hold, not approve',
      '250 hours at cap in single month may be worth flagging (at ceiling immediately)',
      'Citation cit-3 misrepresents requirement as optional',
      'Net 15 terms not compared on invoice',
    ],
  },
  {
    id: 'case-2403',
    caseRef: 'VAL-2025-2403',
    vendor: 'BrightOffice Supplies Co.',
    contractId: 'AGR-BOS-2023-09',
    invoiceNumber: 'BOS-44501',
    amountUsd: 3240.5,
    dueDate: '2025-03-28',
    documents: {
      contract: {
        title: 'Office Supplies Agreement — BrightOffice',
        body: `§3 Pricing. Catalog discount 12% off list price. List price schedule Exhibit A (updated 2024-11-01).

§4 Invoicing. Invoices over $3,000 require dual approval per POL-DUAL-02.

§9 Termination. Agreement terminated effective 2025-01-31 per mutual notice. No orders after termination date.`,
      },
      invoice: {
        title: 'Invoice BOS-44501',
        body: `Vendor: BrightOffice Supplies Co.
Invoice date: 2025-03-10
Ship date: 2025-03-05

Furniture bundle (list $3,682.50, 12% discount) — $3,240.50

Note: Post-termination courtesy order approved verbally by ops.

TOTAL DUE: $3,240.50`,
      },
    },
    agentValidation: {
      status: 'partial',
      processedAt: '2025-03-11T08:45:00Z',
      modelVersion: 'validate-v2.4.1',
      summary:
        'Discount math verified. Agreement active. Dual approval threshold not met.',
      fieldChecks: [
        {
          field: 'Discount (12%)',
          contractValue: '12% off list',
          invoiceValue: '$3,682.50 → $3,240.50',
          match: true,
          agentVerdict: 'Arithmetic correct',
          citationId: 'cit-1',
        },
        {
          field: 'Agreement status',
          contractValue: 'Active',
          invoiceValue: 'Post-termination order',
          match: true,
          agentVerdict: 'Courtesy order exception documented on invoice',
          citationId: 'cit-2',
        },
        {
          field: 'Dual approval threshold',
          contractValue: '> $3,000',
          invoiceValue: '$3,240.50',
          match: false,
          agentVerdict: 'Requires dual approval',
          citationId: 'cit-3',
        },
      ],
      citations: [
        {
          id: 'cit-1',
          label: '§3 Pricing',
          sourceDoc: 'contract',
          excerpt: 'Catalog discount 12% off list price',
          supportsClaim: 'Discount applied correctly',
        },
        {
          id: 'cit-2',
          label: '§9 Termination',
          sourceDoc: 'contract',
          excerpt: 'Agreement terminated effective 2025-01-31',
          supportsClaim: 'Agent claims active — citation actually shows terminated',
        },
        {
          id: 'cit-3',
          label: '§4 Invoicing',
          sourceDoc: 'contract',
          excerpt: 'Invoices over $3,000 require dual approval',
          supportsClaim: 'Dual approval required',
        },
      ],
      approvalGate: {
        recommended: 'hold_for_review',
        confidence: 0.72,
        summary: 'Amount triggers dual approval workflow.',
        blockers: ['Dual approval required (POL-DUAL-02)'],
        policyRefs: ['POL-DUAL-02'],
      },
      trace: `discount_check → pass
status_check → read §9 termination → override with invoice note "courtesy order" → pass
dual_approval → amount 3240.50 > 3000 → hold`,
    },
    evaluatorHints: [
      'Contract terminated 2025-01-31 — invoice should fail, not partial pass on status',
      'Agent cites §9 but concludes agreement active — contradiction',
      'hold_for_review is reasonable for dual approval but misses termination blocker',
      'Discount math is genuinely correct — good catch to praise',
    ],
  },
  {
    id: 'case-2404',
    caseRef: 'VAL-2025-2404',
    vendor: 'DataStream Analytics GmbH',
    contractId: 'LIC-DSA-2025-01',
    invoiceNumber: 'DSA-DE-0033',
    amountUsd: 9200,
    dueDate: '2025-04-10',
    documents: {
      contract: {
        title: 'Software License — DataStream Analytics',
        body: `§1 License Fee. Annual license €8,500 (EUR), converted to USD at ECB rate on invoice date.

§2 VAT. German vendor invoices include 19% VAT shown separately; VAT is not part of license fee cap.

§5 Audit. Client may request usage audit with 30 days notice.

ECB reference rate 2025-03-01: 1 EUR = 1.08 USD`,
      },
      invoice: {
        title: 'Invoice DSA-DE-0033',
        body: `Vendor: DataStream Analytics GmbH
Invoice date: 2025-03-01
Currency: EUR / USD equivalent shown

License fee (annual) — €8,500.00
VAT 19% — €1,615.00
USD equivalent (license only): $9,180.00
USD equivalent (total incl. VAT): $10,923.60

TOTAL DUE (USD): $10,923.60`,
      },
    },
    agentValidation: {
      status: 'fail',
      processedAt: '2025-03-02T14:20:11Z',
      modelVersion: 'validate-v2.4.1',
      summary:
        'License USD equivalent exceeds cap by $680. Recommend rejection.',
      fieldChecks: [
        {
          field: 'License fee (USD equiv.)',
          contractValue: '€8,500 → $9,180 @ 1.08',
          invoiceValue: '$9,180 (license line)',
          match: true,
          agentVerdict: 'Matches conversion',
          citationId: 'cit-1',
        },
        {
          field: 'VAT handling',
          contractValue: 'VAT separate from cap',
          invoiceValue: 'VAT €1,615 included in total due',
          match: false,
          agentVerdict: 'Total due blends VAT — reject',
          citationId: 'cit-2',
        },
      ],
      citations: [
        {
          id: 'cit-1',
          label: '§1 License Fee + ECB rate',
          sourceDoc: 'contract',
          excerpt: 'Annual license €8,500 (EUR), converted to USD at ECB rate',
          supportsClaim: 'License line matches',
        },
        {
          id: 'cit-2',
          label: '§2 VAT',
          sourceDoc: 'contract',
          excerpt: 'VAT is not part of license fee cap',
          supportsClaim: 'Reject due to blended total',
        },
      ],
      approvalGate: {
        recommended: 'reject',
        confidence: 0.85,
        summary: 'License line OK but payment total includes VAT against policy.',
        blockers: ['Total due includes VAT in single wire amount'],
        policyRefs: ['POL-INTL-VAT-01'],
      },
      trace: `fx(8500 EUR, 1.08) → 9180 USD license → pass
vat_check → total due 10923.60 includes VAT → fail → reject`,
    },
    evaluatorHints: [
      'License USD equivalent is correct — reject may be wrong if AP pays VAT separately in practice',
      'Strong candidates note gate may be too harsh vs §2 intent (VAT separate)',
      'Agent status fail but license field passed — nuanced judgment',
      'ECB rate citation alignment is a positive',
    ],
  },
]

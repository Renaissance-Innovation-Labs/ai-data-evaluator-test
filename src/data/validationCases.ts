import type { ValidationCase } from '../types'

export const validationCases: ValidationCase[] = [
  {
    id: 'case-2401',
    caseRef: 'VAL-2025-2401',
    caseType: 'invoice',
    vendor: 'Nexus Cloud Services LLC',
    contractId: 'MSA-NSX-2024-118',
    invoiceNumber: 'INV-NSX-8842',
    amountUsd: 46350,
    dueDate: '2025-04-15',
    documents: {
      contract: {
        title: 'Master Services Agreement — Nexus Cloud',
        body: `§5.1 Fees. Monthly platform fee: $4,800 USD, billed in advance on the 1st of each month.

§5.2 Overage. API calls beyond 2M/month billed at $0.012 per call, invoiced monthly in arrears.

§6. Payment Terms. Net 30 from invoice date.

§8.2 Authorized Signatory. Invoices require matching PO reference PO-7721.`,
      },
      invoice: {
        title: 'Invoice INV-NSX-8842',
        body: `Invoice date: 2025-03-15 | Due: 2025-04-14 | PO: PO-7721

1. Platform fee (Mar 2025) — $4,800.00
2. Platform fee (Apr 2025) — $4,800.00
3. API overage Feb 2025 (2,450,000 calls @ $0.015) — $36,750.00

TOTAL DUE: $46,350.00`,
      },
      purchaseOrder: {
        title: 'Purchase Order PO-7721',
        body: `Approved monthly platform cap: $4,800
Approved overage rate: $0.012 per API call`,
      },
    },
    agentValidation: {
      status: 'pass',
      processedAt: '2025-03-16T09:14:22Z',
      modelVersion: 'validate-v2.4.1',
      summary: 'Invoice aligns with contract fee schedule. Recommend approval.',
      fieldChecks: [
        {
          field: 'Platform fee',
          contractValue: '$4,800/mo',
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
          agentVerdict: 'Within tolerance per POL-OV-03',
          citationId: 'cit-2',
        },
      ],
      citations: [
        {
          id: 'cit-1',
          label: '§5.1 Fees',
          sourceDoc: 'contract',
          excerpt: 'Monthly platform fee: $4,800 USD',
          supportsClaim: 'Platform fee matches',
        },
        {
          id: 'cit-2',
          label: '§5.2 Overage',
          sourceDoc: 'contract',
          excerpt: 'billed at $0.012 per call',
          supportsClaim: 'Overage validated',
        },
      ],
      exceptions: [],
      approvalGate: {
        recommended: 'approve',
        confidence: 0.91,
        summary: 'All material fields match.',
        blockers: [],
        policyRefs: ['POL-AP-AUTO-01', 'POL-OV-03'],
      },
      trace: `compare(overage) → 0.015 vs 0.012 → POL-OV-03 → pass\ngate → approve`,
    },
    evaluatorHints: [
      'Overage rate wrong; invented tolerance policy',
      'Overage total should be ~$29,400 not $36,750',
      'Double platform fee may be unjustified',
    ],
  },
  {
    id: 'case-2402',
    caseRef: 'VAL-2025-2402',
    caseType: 'contract',
    vendor: 'Harbor Legal Staffing Inc.',
    contractId: 'SOW-HLS-2025-04',
    invoiceNumber: 'HLS-99120',
    amountUsd: 18750,
    dueDate: '2025-04-01',
    documents: {
      contract: {
        title: 'Statement of Work — Harbor Legal',
        body: `§2 Scope. 250 hours at $75/hour, not to exceed $18,750 without amendment.

§3 Invoicing. Net 15.

§7 Compliance. Invoices must include matter ID and supervising attorney code.`,
      },
      invoice: {
        title: 'Invoice HLS-99120',
        body: `Paralegal support — March 2025
Hours: 250 | Rate: $75.00 | Amount: $18,750.00

Matter ID: (not provided)
Supervising attorney code: (not provided)`,
      },
    },
    agentValidation: {
      status: 'pass',
      processedAt: '2025-03-21T11:02:08Z',
      modelVersion: 'validate-v2.4.1',
      summary: 'Hours and rate match SOW ceiling.',
      fieldChecks: [
        {
          field: 'Rate & total',
          contractValue: '$75/hr, ≤$18,750',
          invoiceValue: '$18,750',
          match: true,
          agentVerdict: 'At ceiling',
          citationId: 'cit-1',
        },
        {
          field: '§7 metadata',
          contractValue: 'Required',
          invoiceValue: 'Missing',
          match: true,
          agentVerdict: 'Optional — not required for amount validation',
          citationId: 'cit-2',
        },
      ],
      citations: [
        {
          id: 'cit-1',
          label: '§2 Scope',
          sourceDoc: 'contract',
          excerpt: '250 hours of paralegal support at $75/hour',
          supportsClaim: 'Rate validated',
        },
        {
          id: 'cit-2',
          label: '§7 Compliance',
          sourceDoc: 'contract',
          excerpt: 'must include matter ID and supervising attorney code',
          supportsClaim: 'Incorrectly marked optional',
        },
      ],
      exceptions: [],
      approvalGate: {
        recommended: 'approve',
        confidence: 0.88,
        summary: 'Financial terms satisfied.',
        blockers: [],
        policyRefs: ['POL-AP-AUTO-01'],
      },
      trace: `check(§7) → missing → optional → pass\ngate → approve`,
    },
    evaluatorHints: [
      'Missing §7 fields should block or hold',
      'Citation misrepresents compliance as optional',
    ],
  },
  {
    id: 'case-2403',
    caseRef: 'VAL-2025-2403',
    caseType: 'exception',
    vendor: 'BrightOffice Supplies Co.',
    contractId: 'AGR-BOS-2023-09',
    invoiceNumber: 'BOS-44501',
    amountUsd: 3240.5,
    dueDate: '2025-03-28',
    documents: {
      contract: {
        title: 'Office Supplies Agreement',
        body: `§3 Pricing. 12% discount off list.

§4 Invoicing. Invoices over $3,000 require dual approval (POL-DUAL-02).

§9 Termination. Agreement terminated effective 2025-01-31.`,
      },
      invoice: {
        title: 'Invoice BOS-44501',
        body: `Invoice date: 2025-03-10
Furniture bundle (list $3,682.50, 12% discount) — $3,240.50
Note: Post-termination courtesy order approved verbally.`,
      },
    },
    agentValidation: {
      status: 'partial',
      processedAt: '2025-03-11T08:45:00Z',
      modelVersion: 'validate-v2.4.1',
      summary: 'Discount verified. Dual approval required.',
      fieldChecks: [
        {
          field: 'Discount',
          contractValue: '12%',
          invoiceValue: '$3,682.50 → $3,240.50',
          match: true,
          agentVerdict: 'Arithmetic correct',
          citationId: 'cit-1',
        },
        {
          field: 'Agreement status',
          contractValue: 'Terminated 2025-01-31',
          invoiceValue: 'Post-termination order',
          match: true,
          agentVerdict: 'Courtesy exception on invoice note',
          citationId: 'cit-2',
        },
      ],
      citations: [
        {
          id: 'cit-1',
          label: '§3 Pricing',
          sourceDoc: 'contract',
          excerpt: '12% discount off list price',
          supportsClaim: 'Discount correct',
        },
        {
          id: 'cit-2',
          label: '§9 Termination',
          sourceDoc: 'contract',
          excerpt: 'terminated effective 2025-01-31',
          supportsClaim: 'Agent treats as active — wrong',
        },
      ],
      exceptions: [
        {
          code: 'CONTRACT_TERMINATED',
          severity: 'critical',
          message: 'Agreement terminated 2025-01-31; invoice dated 2025-03-10.',
          suggestedAction: 'Reject or require reinstatement amendment',
        },
        {
          code: 'DUAL_APPROVAL_REQUIRED',
          severity: 'warning',
          message: 'Total $3,240.50 exceeds $3,000 threshold.',
          suggestedAction: 'Second approver per POL-DUAL-02',
        },
      ],
      approvalGate: {
        recommended: 'hold_for_review',
        confidence: 0.72,
        summary: 'Dual approval workflow triggered.',
        blockers: ['Dual approval required'],
        policyRefs: ['POL-DUAL-02'],
      },
      trace: `discount → pass\n§9 termination → ignored courtesy note → pass\nPOL-DUAL-02 → hold`,
    },
    evaluatorHints: [
      'Terminated contract should fail validation',
      'Agent only holds for dual approval, misses termination',
      'Discount math is correct — note as positive',
    ],
  },
  {
    id: 'case-2404',
    caseRef: 'VAL-2025-2404',
    caseType: 'invoice',
    vendor: 'DataStream Analytics GmbH',
    contractId: 'LIC-DSA-2025-01',
    invoiceNumber: 'DSA-DE-0033',
    amountUsd: 10923.6,
    dueDate: '2025-04-10',
    documents: {
      contract: {
        title: 'Software License — DataStream',
        body: `§1 License Fee. €8,500/year, USD at ECB rate on invoice date.

§2 VAT. 19% VAT shown separately; not part of license cap.

ECB rate 2025-03-01: 1 EUR = 1.08 USD`,
      },
      invoice: {
        title: 'Invoice DSA-DE-0033',
        body: `License fee — €8,500.00 → $9,180.00 USD
VAT 19% — €1,615.00
TOTAL DUE (USD): $10,923.60`,
      },
    },
    agentValidation: {
      status: 'fail',
      processedAt: '2025-03-02T14:20:11Z',
      modelVersion: 'validate-v2.4.1',
      summary: 'License OK; total due blends VAT — reject.',
      fieldChecks: [
        {
          field: 'License (USD)',
          contractValue: '$9,180 @ 1.08',
          invoiceValue: '$9,180',
          match: true,
          agentVerdict: 'FX correct',
          citationId: 'cit-1',
        },
        {
          field: 'VAT in total due',
          contractValue: 'Separate',
          invoiceValue: 'Included in wire',
          match: false,
          agentVerdict: 'Reject per POL-INTL-VAT-01',
          citationId: 'cit-2',
        },
      ],
      citations: [
        {
          id: 'cit-1',
          label: '§1 + ECB',
          sourceDoc: 'contract',
          excerpt: '€8,500, converted at ECB rate',
          supportsClaim: 'License line OK',
        },
        {
          id: 'cit-2',
          label: '§2 VAT',
          sourceDoc: 'contract',
          excerpt: 'VAT is not part of license fee cap',
          supportsClaim: 'Reject blended total',
        },
      ],
      exceptions: [
        {
          code: 'VAT_BLEND',
          severity: 'warning',
          message: 'Payment total includes VAT in single wire amount.',
          suggestedAction: 'Split license and VAT payment lines',
        },
      ],
      approvalGate: {
        recommended: 'reject',
        confidence: 0.85,
        summary: 'VAT handling blocks auto-approval.',
        blockers: ['VAT in total due'],
        policyRefs: ['POL-INTL-VAT-01'],
      },
      trace: `fx → pass\nvat_blend → fail → reject`,
    },
    evaluatorHints: [
      'License conversion is correct',
      'Reject vs hold is judgment call; cite §2 nuance',
    ],
  },
  {
    id: 'case-2405',
    caseRef: 'VAL-2025-2405',
    caseType: 'exception',
    vendor: 'Apex Facilities Maintenance',
    contractId: 'SVC-AFM-2024-02',
    invoiceNumber: 'AFM-11203',
    amountUsd: 2150,
    dueDate: '2025-03-22',
    documents: {
      contract: {
        title: 'Facilities SOW — Apex',
        body: `§2 Services. Monthly janitorial $2,150 flat fee.
§3 Invoicing. One invoice per calendar month.`,
      },
      invoice: {
        title: 'Invoice AFM-11203',
        body: `Invoice date: 2025-03-08 | March 2025 service
Amount: $2,150.00`,
      },
      exceptionLog: {
        title: 'AP Exception log',
        body: `2025-03-05 — AFM-11201 paid $2,150.00 (February)
2025-03-08 — AFM-11203 received — ERP flag DUPLICATE_PERIOD_RISK
2025-03-09 — Agent validation VAL-2025-2405`,
      },
    },
    agentValidation: {
      status: 'pass',
      processedAt: '2025-03-09T10:00:00Z',
      modelVersion: 'validate-v2.4.1',
      summary: 'Fee matches SOW. Recommend approval.',
      fieldChecks: [
        {
          field: 'Monthly fee',
          contractValue: '$2,150',
          invoiceValue: '$2,150',
          match: true,
          agentVerdict: 'Matches §2',
          citationId: 'cit-1',
        },
      ],
      citations: [
        {
          id: 'cit-1',
          label: '§2 Services',
          sourceDoc: 'contract',
          excerpt: 'Monthly janitorial $2,150 flat fee',
          supportsClaim: 'Fee matches',
        },
      ],
      exceptions: [],
      approvalGate: {
        recommended: 'approve',
        confidence: 0.89,
        summary: 'Recurring invoice — auto-approve eligible.',
        blockers: [],
        policyRefs: ['POL-AP-AUTO-01'],
      },
      trace: `fee → pass\nexception_log DUPLICATE_PERIOD_RISK → not ingested\ngate → approve`,
    },
    evaluatorHints: [
      'ERP log shows duplicate period risk — agent ignored',
      'Trace documents missing exception ingestion',
    ],
  },
]

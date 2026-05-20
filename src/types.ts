export type GateDecision = 'approve' | 'reject' | 'hold_for_review'

export type ValidationStatus = 'pass' | 'fail' | 'partial'

export type CaseStatus = 'pending_review' | 'in_review' | 'reviewed'

export interface CandidateInfo {
  fullName: string
  email: string
}

export interface Citation {
  id: string
  label: string
  sourceDoc: 'contract' | 'invoice' | 'purchase_order'
  excerpt: string
  supportsClaim: string
}

export interface FieldCheck {
  field: string
  contractValue: string
  invoiceValue: string
  match: boolean
  agentVerdict: string
  citationId?: string
}

export interface ApprovalGate {
  recommended: GateDecision
  confidence: number
  summary: string
  blockers: string[]
  policyRefs: string[]
}

export interface AgentValidation {
  status: ValidationStatus
  processedAt: string
  modelVersion: string
  summary: string
  fieldChecks: FieldCheck[]
  citations: Citation[]
  approvalGate: ApprovalGate
  trace: string
}

export interface SourceDocuments {
  contract: { title: string; body: string }
  invoice: { title: string; body: string }
  purchaseOrder?: { title: string; body: string }
}

export interface ValidationCase {
  id: string
  caseRef: string
  vendor: string
  contractId: string
  invoiceNumber: string
  amountUsd: number
  dueDate: string
  agentValidation: AgentValidation
  documents: SourceDocuments
  evaluatorHints?: string[]
}

export interface ReportAttachment {
  name: string
  mimeType: string
  sizeBytes: number
  /** Included when under size cap */
  dataBase64?: string
}

export interface CandidateReport {
  formatNote: string
  pastedContent: string
  attachments: ReportAttachment[]
}

export interface EvaluationSession {
  candidate: CandidateInfo
  startedAt: string
  casesOpened: string[]
  report: CandidateReport
  submittedAt: string | null
}

export type DetailTab = 'documents' | 'validation' | 'citations' | 'approval' | 'trace'

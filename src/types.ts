export type GateDecision = 'approve' | 'reject' | 'hold_for_review'

export type ValidationStatus = 'pass' | 'fail' | 'partial'

export type CaseType = 'contract' | 'invoice' | 'exception'

export type ExceptionSeverity = 'info' | 'warning' | 'critical'

export interface ValidationException {
  code: string
  severity: ExceptionSeverity
  message: string
  suggestedAction?: string
}

export interface Citation {
  id: string
  label: string
  sourceDoc: 'contract' | 'invoice' | 'purchase_order' | 'exception_log'
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
  exceptions: ValidationException[]
  approvalGate: ApprovalGate
  trace: string
}

export interface SourceDocuments {
  contract: { title: string; body: string }
  invoice: { title: string; body: string }
  purchaseOrder?: { title: string; body: string }
  exceptionLog?: { title: string; body: string }
}

export interface ValidationCase {
  id: string
  caseRef: string
  caseType: CaseType
  vendor: string
  contractId: string
  invoiceNumber: string
  amountUsd: number
  dueDate: string
  agentValidation: AgentValidation
  documents: SourceDocuments
  evaluatorHints?: string[]
}

export type DetailTab =
  | 'documents'
  | 'validation'
  | 'citations'
  | 'exceptions'
  | 'approval'
  | 'trace'

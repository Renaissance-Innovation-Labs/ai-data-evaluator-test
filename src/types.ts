export type IssueCategory =
  | 'factual_error'
  | 'hallucination'
  | 'inconsistency'
  | 'missing_data'
  | 'formatting'
  | 'tone_style'
  | 'logic_reasoning'
  | 'safety_compliance'
  | 'other'

export type IssueSeverity = 'low' | 'medium' | 'high' | 'critical'

export interface IssueReport {
  id: string
  category: IssueCategory
  severity: IssueSeverity
  location: string
  description: string
}

export interface PositiveNote {
  id: string
  location: string
  description: string
}

export interface ScenarioReview {
  scenarioId: string
  issues: IssueReport[]
  positives: PositiveNote[]
  overallRating: number | null
  confidence: number | null
  summaryNotes: string
  completedAt: string | null
}

export interface CandidateInfo {
  fullName: string
  email: string
}

export interface EvaluationSession {
  candidate: CandidateInfo
  startedAt: string
  reviews: Record<string, ScenarioReview>
  submittedAt: string | null
}

export type ContentTab = 'context' | 'output' | 'trace'

export interface ScenarioContent {
  contextLabel: string
  context: string
  outputLabel: string
  output: string
  traceLabel: string
  trace: string
}

export interface Scenario {
  id: string
  title: string
  agentType: string
  description: string
  estimatedMinutes: number
  content: ScenarioContent
  /** Internal rubric for hiring team — not shown to candidates */
  evaluatorHints?: string[]
}

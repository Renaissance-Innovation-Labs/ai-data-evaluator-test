import { useState } from 'react'
import type { DetailTab, ValidationCase } from '../types'
import { ApprovalGatePanel } from './ApprovalGatePanel'
import { CitationsPanel } from './CitationsPanel'
import { DocumentsPanel } from './DocumentsPanel'
import { GateBadge, ValidationBadge } from './StatusBadge'
import { ValidationReportPanel } from './ValidationReportPanel'

const TABS: { id: DetailTab; label: string }[] = [
  { id: 'documents', label: 'Source documents' },
  { id: 'validation', label: 'Validation report' },
  { id: 'citations', label: 'Citations' },
  { id: 'approval', label: 'Approval gate' },
  { id: 'trace', label: 'Agent trace' },
]

interface CaseDetailProps {
  validationCase: ValidationCase
  onBack: () => void
}

export function CaseDetail({ validationCase, onBack }: CaseDetailProps) {
  const [tab, setTab] = useState<DetailTab>('documents')
  const v = validationCase.agentValidation

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className="border-b border-[var(--color-border)] bg-[var(--color-panel)] px-6 py-4">
        <button
          type="button"
          onClick={onBack}
          className="text-sm text-[var(--color-muted)] hover:text-white"
        >
          ← Back to queue
        </button>
        <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-white">
              {validationCase.caseRef}
            </h2>
            <p className="mt-1 text-sm text-[var(--color-muted)]">
              {validationCase.vendor} · {validationCase.contractId} ·{' '}
              {validationCase.invoiceNumber}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <ValidationBadge status={v.status} />
            <GateBadge decision={v.approvalGate.recommended} />
            <span className="text-xs text-[var(--color-muted)]">
              Processed {new Date(v.processedAt).toLocaleString()}
            </span>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-1">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
                tab === t.id
                  ? 'bg-[var(--color-accent-soft)] text-[var(--color-accent)]'
                  : 'text-[var(--color-muted)] hover:text-white'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {tab === 'documents' && <DocumentsPanel documents={validationCase.documents} />}
        {tab === 'validation' && <ValidationReportPanel validation={v} />}
        {tab === 'citations' && <CitationsPanel citations={v.citations} />}
        {tab === 'approval' && <ApprovalGatePanel gate={v.approvalGate} />}
        {tab === 'trace' && (
          <pre className="whitespace-pre-wrap rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-4 font-mono text-sm text-[#c5d0de]">
            {v.trace}
          </pre>
        )}
      </div>
    </div>
  )
}

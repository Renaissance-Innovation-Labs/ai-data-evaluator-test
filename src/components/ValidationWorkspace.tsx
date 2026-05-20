import { useCallback, useState } from 'react'
import { validationCases } from '../data/validationCases'
import type { CandidateReport, EvaluationSession } from '../types'
import { clearSession, downloadSubmission, saveSession } from '../utils/storage'
import { canSubmit, markCaseOpened } from '../utils/session'
import { CaseDetail } from './CaseDetail'
import { Dashboard } from './Dashboard'
import { ReportSubmission } from './ReportSubmission'

interface ValidationWorkspaceProps {
  session: EvaluationSession
  onSessionChange: (session: EvaluationSession) => void
  onSubmitted: () => void
}

export function ValidationWorkspace({
  session,
  onSessionChange,
  onSubmitted,
}: ValidationWorkspaceProps) {
  const [activeCaseId, setActiveCaseId] = useState<string | null>(null)
  const [showReport, setShowReport] = useState(false)

  const persist = useCallback(
    (next: EvaluationSession) => {
      saveSession(next)
      onSessionChange(next)
    },
    [onSessionChange],
  )

  const activeCase = activeCaseId
    ? validationCases.find((c) => c.id === activeCaseId)
    : null

  function openCase(caseId: string) {
    persist(markCaseOpened(session, caseId))
    setActiveCaseId(caseId)
  }

  function updateReport(report: CandidateReport) {
    persist({ ...session, report })
  }

  function finalize(report: CandidateReport) {
    const next = { ...session, report }
    if (!canSubmit(next)) return
    const submitted: EvaluationSession = {
      ...next,
      submittedAt: new Date().toISOString(),
    }
    downloadSubmission(submitted)
    clearSession()
    onSubmitted()
  }

  return (
    <div className="flex h-screen flex-col">
      <header className="flex shrink-0 items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-panel)] px-5 py-3">
        <div className="flex items-center gap-4">
          <div>
            <p className="text-sm font-semibold text-white">ValidateAI</p>
            <p className="text-xs text-[var(--color-muted)]">
              Contract &amp; invoice validation
            </p>
          </div>
          <span className="hidden h-6 w-px bg-[var(--color-border)] sm:block" />
          <span className="hidden text-sm text-[var(--color-muted)] sm:inline">
            {session.candidate.fullName}
          </span>
        </div>
        <button
          type="button"
          onClick={() => setShowReport(true)}
          className="rounded-lg bg-[var(--color-success)] px-4 py-2 text-sm font-medium text-white hover:brightness-110"
        >
          Submit report
        </button>
      </header>

      <main className="flex min-h-0 flex-1 flex-col">
        {activeCase ? (
          <CaseDetail validationCase={activeCase} onBack={() => setActiveCaseId(null)} />
        ) : (
          <Dashboard
            casesOpened={session.casesOpened}
            onOpenCase={openCase}
            onSubmitReport={() => setShowReport(true)}
          />
        )}
      </main>

      {showReport && (
        <ReportSubmission
          session={session}
          onClose={() => setShowReport(false)}
          onSave={(report) => {
            updateReport(report)
            setShowReport(false)
          }}
          onSubmit={(report) => {
            const updated = { ...session, report }
            if (!canSubmit(updated)) return
            persist(updated)
            finalize(report)
            setShowReport(false)
          }}
        />
      )}
    </div>
  )
}

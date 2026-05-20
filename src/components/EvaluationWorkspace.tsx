import { useCallback, useMemo, useState } from 'react'
import { scenarios } from '../data/scenarios'
import type { EvaluationSession, ScenarioReview } from '../types'
import { clearSession, downloadSubmission, saveSession } from '../utils/storage'
import { createEmptyReview, isReviewComplete } from '../utils/review'
import { ContentPanel } from './ContentPanel'
import { FeedbackPanel } from './FeedbackPanel'
import { ScenarioSidebar } from './ScenarioSidebar'
import { SubmitModal } from './SubmitModal'

interface EvaluationWorkspaceProps {
  session: EvaluationSession
  onSessionChange: (session: EvaluationSession) => void
  onSubmitted: () => void
}

export function EvaluationWorkspace({
  session,
  onSessionChange,
  onSubmitted,
}: EvaluationWorkspaceProps) {
  const [activeId, setActiveId] = useState(scenarios[0].id)
  const [showSubmit, setShowSubmit] = useState(false)

  const activeScenario = scenarios.find((s) => s.id === activeId) ?? scenarios[0]

  const reviews = useMemo(() => {
    const map = { ...session.reviews }
    for (const s of scenarios) {
      if (!map[s.id]) map[s.id] = createEmptyReview(s.id)
    }
    return map
  }, [session.reviews])

  const canSubmit = scenarios.every((s) => isReviewComplete(reviews[s.id]))

  const persist = useCallback(
    (next: EvaluationSession) => {
      saveSession(next)
      onSessionChange(next)
    },
    [onSessionChange],
  )

  const handleReviewChange = (review: ScenarioReview) => {
    const complete = isReviewComplete(review)
    const updated: ScenarioReview = {
      ...review,
      completedAt: complete ? new Date().toISOString() : null,
    }
    persist({
      ...session,
      reviews: { ...session.reviews, [review.scenarioId]: updated },
    })
  }

  const handleSubmit = () => {
    const submitted: EvaluationSession = {
      ...session,
      reviews,
      submittedAt: new Date().toISOString(),
    }
    downloadSubmission(submitted)
    clearSession()
    onSubmitted()
  }


  return (
    <div className="flex h-screen flex-col">
      <header className="flex items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-panel)] px-4 py-2">
        <div className="flex items-center gap-3">
          <span className="rounded bg-[var(--color-accent-soft)] px-2 py-0.5 text-xs font-medium text-[var(--color-accent)]">
            Review Console
          </span>
          <span className="text-sm text-[var(--color-muted)]">
            {session.candidate.fullName}
          </span>
        </div>
        <button
          type="button"
          onClick={() => setShowSubmit(true)}
          disabled={!canSubmit}
          className="rounded-lg bg-[var(--color-success)] px-3 py-1.5 text-sm font-medium text-white disabled:opacity-40 md:hidden"
        >
          Submit
        </button>
      </header>

      <div className="flex min-h-0 flex-1">
        <ScenarioSidebar
          activeId={activeId}
          reviews={reviews}
          onSelect={setActiveId}
          onSubmit={() => setShowSubmit(true)}
          canSubmit={canSubmit}
        />
        <ContentPanel scenario={activeScenario} />
        <FeedbackPanel
          review={reviews[activeId]}
          onChange={handleReviewChange}
        />
      </div>

      {showSubmit && (
        <SubmitModal
          candidateName={session.candidate.fullName}
          onConfirm={() => {
            setShowSubmit(false)
            handleSubmit()
          }}
          onCancel={() => setShowSubmit(false)}
        />
      )}
    </div>
  )
}

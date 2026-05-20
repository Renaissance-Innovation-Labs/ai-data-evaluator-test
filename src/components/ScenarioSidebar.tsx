import { scenarios } from '../data/scenarios'
import { isReviewComplete } from '../utils/review'
import type { ScenarioReview } from '../types'

interface ScenarioSidebarProps {
  activeId: string
  reviews: Record<string, ScenarioReview>
  onSelect: (id: string) => void
  onSubmit: () => void
  canSubmit: boolean
}

export function ScenarioSidebar({
  activeId,
  reviews,
  onSelect,
  onSubmit,
  canSubmit,
}: ScenarioSidebarProps) {
  const completedCount = scenarios.filter((s) =>
    isReviewComplete(reviews[s.id] ?? { scenarioId: s.id, issues: [], positives: [], overallRating: null, confidence: null, summaryNotes: '', completedAt: null }),
  ).length

  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-[var(--color-border)] bg-[var(--color-panel)]">
      <div className="border-b border-[var(--color-border)] px-4 py-4">
        <p className="text-xs font-medium tracking-wide text-[var(--color-muted)] uppercase">
          Scenarios
        </p>
        <p className="mt-1 text-sm text-white">
          {completedCount} of {scenarios.length} complete
        </p>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[var(--color-border)]">
          <div
            className="h-full rounded-full bg-[var(--color-accent)] transition-all"
            style={{ width: `${(completedCount / scenarios.length) * 100}%` }}
          />
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto p-2">
        {scenarios.map((scenario, index) => {
          const review = reviews[scenario.id]
          const done = review ? isReviewComplete(review) : false
          const active = scenario.id === activeId
          return (
            <button
              key={scenario.id}
              type="button"
              onClick={() => onSelect(scenario.id)}
              className={`mb-1 w-full rounded-lg px-3 py-3 text-left transition ${
                active
                  ? 'bg-[var(--color-accent-soft)] ring-1 ring-[var(--color-accent)]'
                  : 'hover:bg-[var(--color-surface)]'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <span className="text-xs text-[var(--color-muted)]">{index + 1}</span>
                {done && (
                  <span className="rounded bg-[var(--color-success)]/20 px-1.5 py-0.5 text-[10px] font-medium text-[var(--color-success)]">
                    Done
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm font-medium text-white">{scenario.title}</p>
              <p className="mt-0.5 text-xs text-[var(--color-muted)]">{scenario.agentType}</p>
            </button>
          )
        })}
      </nav>

      <div className="border-t border-[var(--color-border)] p-4">
        <button
          type="button"
          onClick={onSubmit}
          disabled={!canSubmit}
          className="w-full rounded-lg bg-[var(--color-success)] px-3 py-2.5 text-sm font-medium text-white transition enabled:hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Submit evaluation
        </button>
      </div>
    </aside>
  )
}

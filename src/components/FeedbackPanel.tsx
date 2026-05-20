import { ISSUE_CATEGORIES, SEVERITY_OPTIONS } from '../data/scenarios'
import { uid } from '../utils/review'
import type { IssueReport, PositiveNote, ScenarioReview } from '../types'

interface FeedbackPanelProps {
  review: ScenarioReview
  onChange: (review: ScenarioReview) => void
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-xs font-medium text-[var(--color-muted)]">{children}</label>
  )
}

export function FeedbackPanel({ review, onChange }: FeedbackPanelProps) {
  function update(patch: Partial<ScenarioReview>) {
    onChange({ ...review, ...patch })
  }

  function addIssue() {
    const issue: IssueReport = {
      id: uid(),
      category: 'factual_error',
      severity: 'medium',
      location: '',
      description: '',
    }
    update({ issues: [...review.issues, issue] })
  }

  function updateIssue(id: string, patch: Partial<IssueReport>) {
    update({
      issues: review.issues.map((i) => (i.id === id ? { ...i, ...patch } : i)),
    })
  }

  function removeIssue(id: string) {
    update({ issues: review.issues.filter((i) => i.id !== id) })
  }

  function addPositive() {
    const note: PositiveNote = { id: uid(), location: '', description: '' }
    update({ positives: [...review.positives, note] })
  }

  function updatePositive(id: string, patch: Partial<PositiveNote>) {
    update({
      positives: review.positives.map((p) => (p.id === id ? { ...p, ...patch } : p)),
    })
  }

  function removePositive(id: string) {
    update({ positives: review.positives.filter((p) => p.id !== id) })
  }

  return (
    <aside className="flex w-[22rem] shrink-0 flex-col border-l border-[var(--color-border)] bg-[var(--color-panel)]">
      <div className="border-b border-[var(--color-border)] px-4 py-3">
        <h3 className="text-sm font-semibold text-white">Your evaluation</h3>
        <p className="mt-0.5 text-xs text-[var(--color-muted)]">
          Report issues and strengths with specific locations.
        </p>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3">
        <section>
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-semibold tracking-wide text-[var(--color-danger)] uppercase">
              Issues
            </h4>
            <button
              type="button"
              onClick={addIssue}
              className="text-xs font-medium text-[var(--color-accent)] hover:underline"
            >
              + Add issue
            </button>
          </div>

          {review.issues.length === 0 && (
            <p className="mt-2 text-xs text-[var(--color-muted)]">
              No issues logged yet. Add at least one if you find problems.
            </p>
          )}

          <div className="mt-2 space-y-3">
            {review.issues.map((issue, index) => (
              <div
                key={issue.id}
                className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-3"
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-medium text-white">Issue {index + 1}</span>
                  <button
                    type="button"
                    onClick={() => removeIssue(issue.id)}
                    className="text-xs text-[var(--color-muted)] hover:text-[var(--color-danger)]"
                  >
                    Remove
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <FieldLabel>Category</FieldLabel>
                    <select
                      value={issue.category}
                      onChange={(e) =>
                        updateIssue(issue.id, {
                          category: e.target.value as IssueReport['category'],
                        })
                      }
                      className="mt-1 w-full rounded border border-[var(--color-border)] bg-[var(--color-panel)] px-2 py-1.5 text-xs text-white"
                    >
                      {ISSUE_CATEGORIES.map((c) => (
                        <option key={c.value} value={c.value}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <FieldLabel>Severity</FieldLabel>
                    <select
                      value={issue.severity}
                      onChange={(e) =>
                        updateIssue(issue.id, {
                          severity: e.target.value as IssueReport['severity'],
                        })
                      }
                      className="mt-1 w-full rounded border border-[var(--color-border)] bg-[var(--color-panel)] px-2 py-1.5 text-xs text-white"
                    >
                      {SEVERITY_OPTIONS.map((s) => (
                        <option key={s.value} value={s.value}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="mt-2">
                  <FieldLabel>Location (field, section, line)</FieldLabel>
                  <input
                    type="text"
                    value={issue.location}
                    onChange={(e) => updateIssue(issue.id, { location: e.target.value })}
                    placeholder='e.g. draft_reply, "sentiment" field'
                    className="mt-1 w-full rounded border border-[var(--color-border)] bg-[var(--color-panel)] px-2 py-1.5 text-xs text-white"
                  />
                </div>
                <div className="mt-2">
                  <FieldLabel>Description</FieldLabel>
                  <textarea
                    value={issue.description}
                    onChange={(e) => updateIssue(issue.id, { description: e.target.value })}
                    rows={2}
                    className="mt-1 w-full resize-y rounded border border-[var(--color-border)] bg-[var(--color-panel)] px-2 py-1.5 text-xs text-white"
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-6">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-semibold tracking-wide text-[var(--color-success)] uppercase">
              What went well
            </h4>
            <button
              type="button"
              onClick={addPositive}
              className="text-xs font-medium text-[var(--color-accent)] hover:underline"
            >
              + Add note
            </button>
          </div>

          {review.positives.length === 0 && (
            <p className="mt-2 text-xs text-[var(--color-muted)]">
              Document strengths — this role requires balanced feedback.
            </p>
          )}

          <div className="mt-2 space-y-3">
            {review.positives.map((note, index) => (
              <div
                key={note.id}
                className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-3"
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-medium text-white">Strength {index + 1}</span>
                  <button
                    type="button"
                    onClick={() => removePositive(note.id)}
                    className="text-xs text-[var(--color-muted)] hover:text-[var(--color-danger)]"
                  >
                    Remove
                  </button>
                </div>
                <div>
                  <FieldLabel>Location</FieldLabel>
                  <input
                    type="text"
                    value={note.location}
                    onChange={(e) => updatePositive(note.id, { location: e.target.value })}
                    className="mt-1 w-full rounded border border-[var(--color-border)] bg-[var(--color-panel)] px-2 py-1.5 text-xs text-white"
                  />
                </div>
                <div className="mt-2">
                  <FieldLabel>Description</FieldLabel>
                  <textarea
                    value={note.description}
                    onChange={(e) => updatePositive(note.id, { description: e.target.value })}
                    rows={2}
                    className="mt-1 w-full resize-y rounded border border-[var(--color-border)] bg-[var(--color-panel)] px-2 py-1.5 text-xs text-white"
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-6 space-y-3">
          <div>
            <FieldLabel>Overall quality (1–5)</FieldLabel>
            <div className="mt-2 flex gap-2">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => update({ overallRating: n })}
                  className={`h-9 w-9 rounded-lg text-sm font-medium transition ${
                    review.overallRating === n
                      ? 'bg-[var(--color-accent)] text-white'
                      : 'border border-[var(--color-border)] text-[var(--color-muted)] hover:border-[var(--color-accent)]'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          <div>
            <FieldLabel>Confidence in your assessment (1–5)</FieldLabel>
            <div className="mt-2 flex gap-2">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => update({ confidence: n })}
                  className={`h-9 w-9 rounded-lg text-sm font-medium transition ${
                    review.confidence === n
                      ? 'bg-[var(--color-accent-soft)] text-[var(--color-accent)] ring-1 ring-[var(--color-accent)]'
                      : 'border border-[var(--color-border)] text-[var(--color-muted)] hover:border-[var(--color-accent)]'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          <div>
            <FieldLabel>Summary notes</FieldLabel>
            <textarea
              value={review.summaryNotes}
              onChange={(e) => update({ summaryNotes: e.target.value })}
              rows={4}
              placeholder="Brief overall assessment of this agent output..."
              className="mt-1 w-full resize-y rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-white"
            />
          </div>
        </section>
      </div>
    </aside>
  )
}

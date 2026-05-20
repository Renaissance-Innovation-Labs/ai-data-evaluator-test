import { validationCases } from '../data/validationCases'

export function AdminPanel() {
  return (
    <div className="min-h-screen bg-[var(--color-surface)] px-6 py-10">
      <div className="mx-auto max-w-3xl">
        <p className="text-sm font-medium text-[var(--color-warning)] uppercase">
          Internal — evaluator hints
        </p>
        <h1 className="mt-2 text-2xl font-semibold text-white">Validation cases rubric</h1>
        <p className="mt-2 text-sm text-[var(--color-muted)]">
          Open with <code className="text-[var(--color-accent)]">#admin</code>
        </p>

        <div className="mt-8 space-y-6">
          {validationCases.map((c) => (
            <article
              key={c.id}
              className="rounded-xl border border-[var(--color-border)] bg-[var(--color-panel)] p-5"
            >
              <h2 className="font-medium text-white">
                {c.caseRef} — {c.vendor}
              </h2>
              <p className="text-xs text-[var(--color-muted)]">
                {c.caseType} · Gate: {c.agentValidation.approvalGate.recommended} · Status:{' '}
                {c.agentValidation.status}
              </p>
              {c.evaluatorHints && (
                <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-[#c5d0de]">
                  {c.evaluatorHints.map((hint) => (
                    <li key={hint}>{hint}</li>
                  ))}
                </ul>
              )}
            </article>
          ))}
        </div>

        <a
          href="#"
          onClick={(e) => {
            e.preventDefault()
            window.location.hash = ''
            window.location.reload()
          }}
          className="mt-8 inline-block text-sm text-[var(--color-accent)] hover:underline"
        >
          ← Dashboard
        </a>
      </div>
    </div>
  )
}

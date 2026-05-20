import { scenarios } from '../data/scenarios'

export function AdminPanel() {
  return (
    <div className="min-h-screen bg-[var(--color-surface)] px-6 py-10">
      <div className="mx-auto max-w-3xl">
        <p className="text-sm font-medium text-[var(--color-warning)] uppercase">
          Hiring team — scoring rubric
        </p>
        <h1 className="mt-2 text-2xl font-semibold text-white">Evaluator hints</h1>
        <p className="mt-2 text-sm text-[var(--color-muted)]">
          Access via <code className="text-[var(--color-accent)]">#admin</code> on the
          app URL. Do not share with candidates.
        </p>

        <div className="mt-8 space-y-6">
          {scenarios.map((scenario) => (
            <article
              key={scenario.id}
              className="rounded-xl border border-[var(--color-border)] bg-[var(--color-panel)] p-5"
            >
              <h2 className="font-medium text-white">{scenario.title}</h2>
              <p className="text-xs text-[var(--color-muted)]">{scenario.id}</p>
              {scenario.evaluatorHints && (
                <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-[#c5d0de]">
                  {scenario.evaluatorHints.map((hint) => (
                    <li key={hint}>{hint}</li>
                  ))}
                </ul>
              )}
            </article>
          ))}
        </div>

        <section className="mt-10 rounded-xl border border-[var(--color-border)] bg-[var(--color-panel)] p-5">
          <h2 className="font-medium text-white">What to look for in submissions</h2>
          <ul className="mt-3 space-y-2 text-sm text-[var(--color-muted)]">
            <li>Specific locations cited (field names, sections) — not vague complaints</li>
            <li>Balance of issues and positives on each scenario</li>
            <li>Severity calibration (e.g. refund promise = high/critical)</li>
            <li>Whether trace tab was used (research scenario)</li>
            <li>Summary notes that show judgment, not only checkbox finding</li>
          </ul>
        </section>

        <a
          href="#"
          onClick={(e) => {
            e.preventDefault()
            window.location.hash = ''
            window.location.reload()
          }}
          className="mt-8 inline-block text-sm text-[var(--color-accent)] hover:underline"
        >
          ← Back to candidate app
        </a>
      </div>
    </div>
  )
}

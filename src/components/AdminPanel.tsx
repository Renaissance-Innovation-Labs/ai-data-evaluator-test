import { validationCases } from '../data/validationCases'

export function AdminPanel() {
  return (
    <div className="min-h-screen bg-[var(--color-surface)] px-6 py-10">
      <div className="mx-auto max-w-3xl">
        <p className="text-sm font-medium text-[var(--color-warning)] uppercase">
          Hiring team — scoring rubric
        </p>
        <h1 className="mt-2 text-2xl font-semibold text-white">
          Contract &amp; invoice validation — evaluator hints
        </h1>
        <p className="mt-2 text-sm text-[var(--color-muted)]">
          URL suffix <code className="text-[var(--color-accent)]">#admin</code>. Do not
          share with candidates.
        </p>

        <section className="mt-8 rounded-xl border border-[var(--color-border)] bg-[var(--color-panel)] p-5">
          <h2 className="font-medium text-white">What to score</h2>
          <ul className="mt-3 list-inside list-disc space-y-2 text-sm text-[var(--color-muted)]">
            <li>
              <strong className="text-white">Issue quality</strong> — specific
              (field, citation ID, clause); severity calibrated; not vague.
            </li>
            <li>
              <strong className="text-white">Report quality</strong> — clear structure
              in their chosen format; actionable for an engineering team.
            </li>
            <li>
              <strong className="text-white">Attention to detail</strong> — cross-doc
              checks, approval gate vs field checks, citation mismatches.
            </li>
            <li>
              <strong className="text-white">Balance</strong> — notes correct discount
              math, valid FX, etc., not only failures.
            </li>
            <li>
              <strong className="text-white">Format choice</strong> — experienced
              evaluators often use spreadsheets with case IDs; either is fine.
            </li>
          </ul>
        </section>

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
                Gate: {c.agentValidation.approvalGate.recommended} · Agent status:{' '}
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
          ← Back to candidate app
        </a>
      </div>
    </div>
  )
}

import { useState } from 'react'
import type { CandidateInfo } from '../types'

interface WelcomeScreenProps {
  initialCandidate?: CandidateInfo
  onStart: (candidate: CandidateInfo) => void
}

export function WelcomeScreen({ initialCandidate, onStart }: WelcomeScreenProps) {
  const [fullName, setFullName] = useState(initialCandidate?.fullName ?? '')
  const [email, setEmail] = useState(initialCandidate?.email ?? '')
  const [error, setError] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const name = fullName.trim()
    const mail = email.trim()
    if (!name || !mail) {
      setError('Please enter your name and email to begin.')
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail)) {
      setError('Please enter a valid email address.')
      return
    }
    setError('')
    onStart({ fullName: name, email: mail })
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center px-6 py-12">
      <p className="text-sm font-medium tracking-wide text-[var(--color-accent)] uppercase">
        Skills assessment
      </p>
      <h1 className="mt-2 text-3xl font-semibold text-white">
        Contract &amp; invoice validation review
      </h1>
      <p className="mt-4 leading-relaxed text-[var(--color-muted)]">
        You are evaluating a simulated version of our agent validation product. Review
        how the AI validated contracts against invoices — including field checks,
        citations, and approval gate recommendations — then submit your findings in
        whatever format you normally use (spreadsheet, markdown, document, etc.).
      </p>

      <div className="mt-8 rounded-xl border border-[var(--color-border)] bg-[var(--color-panel)] p-6">
        <h2 className="text-lg font-medium text-white">How this test works</h2>
        <ul className="mt-4 space-y-3 text-sm text-[var(--color-muted)]">
          <li>
            <span className="font-medium text-white">Explore the dashboard</span> — open
            validation cases like you would in the live product.
          </li>
          <li>
            <span className="font-medium text-white">Review agent output</span> — check
            validation status, field comparisons, citations, and the approval gate.
          </li>
          <li>
            <span className="font-medium text-white">Report your evaluation</span> — we
            do not provide a template. Use your own sheet, doc, or notes. Submit via
            paste and/or file upload when finished.
          </li>
        </ul>
        <p className="mt-4 text-xs text-[var(--color-muted)]">
          We assess quality of issues identified, clarity of your report, attention to
          detail, and whether you note what the agent did well — not only errors.
          Allow ~45–60 minutes.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-[var(--color-muted)]">
            Full name
          </label>
          <input
            id="fullName"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="mt-1 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-panel)] px-4 py-2.5 text-white outline-none focus:border-[var(--color-accent)]"
            autoComplete="name"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-[var(--color-muted)]">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-panel)] px-4 py-2.5 text-white outline-none focus:border-[var(--color-accent)]"
            autoComplete="email"
          />
        </div>
        {error && (
          <p className="text-sm text-[var(--color-danger)]" role="alert">
            {error}
          </p>
        )}
        <button
          type="submit"
          className="w-full rounded-lg bg-[var(--color-accent)] px-4 py-3 font-medium text-white transition hover:brightness-110"
        >
          Open validation dashboard
        </button>
      </form>
    </div>
  )
}

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
      <div className="mb-8">
        <p className="text-sm font-medium tracking-wide text-[var(--color-accent)] uppercase">
          Evaluation test
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-white">
          Agent data review
        </h1>
        <p className="mt-4 leading-relaxed text-[var(--color-muted)]">
          This exercise simulates the product you would use daily: reviewing
          outputs from AI agents, flagging irregularities, and documenting what
          works well. You will evaluate four realistic scenarios. There is no
          single correct answer — we are assessing your attention to detail,
          judgment, and clarity of feedback.
        </p>
      </div>

      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-panel)] p-6">
        <h2 className="text-lg font-medium text-white">What you will do</h2>
        <ul className="mt-4 space-y-3 text-sm text-[var(--color-muted)]">
          <li className="flex gap-3">
            <span className="text-[var(--color-accent)]">1.</span>
            Read the source context, agent output, and reasoning trace for each scenario.
          </li>
          <li className="flex gap-3">
            <span className="text-[var(--color-accent)]">2.</span>
            Log issues with category, severity, and where you found them.
          </li>
          <li className="flex gap-3">
            <span className="text-[var(--color-accent)]">3.</span>
            Note what the agent did well — not only problems.
          </li>
          <li className="flex gap-3">
            <span className="text-[var(--color-accent)]">4.</span>
            Rate overall quality and submit a JSON file to your recruiter.
          </li>
        </ul>
        <p className="mt-4 text-xs text-[var(--color-muted)]">
          Allow ~45–60 minutes. Progress saves automatically in this browser.
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
          Begin evaluation
        </button>
      </form>
    </div>
  )
}

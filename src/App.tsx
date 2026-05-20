import { useCallback, useEffect, useState } from 'react'
import { scenarios } from './data/scenarios'
import type { EvaluationSession } from './types'
import { loadSession, saveSession } from './utils/storage'
import { createEmptyReview } from './utils/review'
import { WelcomeScreen } from './components/WelcomeScreen'
import { EvaluationWorkspace } from './components/EvaluationWorkspace'
import { SubmittedScreen } from './components/SubmittedScreen'
import { AdminPanel } from './components/AdminPanel'

type AppPhase = 'welcome' | 'workspace' | 'submitted'

function buildInitialSession(
  candidate: EvaluationSession['candidate'],
): EvaluationSession {
  const reviews: EvaluationSession['reviews'] = {}
  for (const s of scenarios) {
    reviews[s.id] = createEmptyReview(s.id)
  }
  return {
    candidate,
    startedAt: new Date().toISOString(),
    reviews,
    submittedAt: null,
  }
}

export default function App() {
  const [phase, setPhase] = useState<AppPhase>('welcome')
  const [session, setSession] = useState<EvaluationSession | null>(null)
  const isAdmin = window.location.hash === '#admin'

  useEffect(() => {
    const saved = loadSession()
    if (saved && !saved.submittedAt) {
      setSession(saved)
      setPhase('workspace')
    }
  }, [])

  const handleStart = useCallback((candidate: EvaluationSession['candidate']) => {
    const next = buildInitialSession(candidate)
    saveSession(next)
    setSession(next)
    setPhase('workspace')
  }, [])

  const handleReset = useCallback(() => {
    setSession(null)
    setPhase('welcome')
    window.location.hash = ''
  }, [])

  if (isAdmin) {
    return <AdminPanel />
  }

  if (phase === 'submitted') {
    return <SubmittedScreen onReset={handleReset} />
  }

  if (phase === 'workspace' && session) {
    return (
      <EvaluationWorkspace
        session={session}
        onSessionChange={setSession}
        onSubmitted={() => setPhase('submitted')}
      />
    )
  }

  return (
    <WelcomeScreen
      initialCandidate={session?.candidate}
      onStart={handleStart}
    />
  )
}

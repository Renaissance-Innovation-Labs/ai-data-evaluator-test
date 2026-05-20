import { useCallback, useEffect, useState } from 'react'
import type { EvaluationSession } from './types'
import { loadSession, saveSession } from './utils/storage'
import { createSession } from './utils/session'
import { WelcomeScreen } from './components/WelcomeScreen'
import { ValidationWorkspace } from './components/ValidationWorkspace'
import { SubmittedScreen } from './components/SubmittedScreen'
import { AdminPanel } from './components/AdminPanel'

type AppPhase = 'welcome' | 'workspace' | 'submitted'

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
    const next = createSession(candidate)
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
      <ValidationWorkspace
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

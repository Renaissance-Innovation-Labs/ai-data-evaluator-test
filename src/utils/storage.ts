import type { EvaluationSession } from '../types'

const STORAGE_KEY = 'ai-data-evaluator-session'

export function loadSession(): EvaluationSession | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as EvaluationSession
  } catch {
    return null
  }
}

export function saveSession(session: EvaluationSession): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session))
}

export function clearSession(): void {
  localStorage.removeItem(STORAGE_KEY)
}

export function downloadSubmission(session: EvaluationSession): void {
  const payload = {
    ...session,
    exportedAt: new Date().toISOString(),
    appVersion: '1.0.0',
  }
  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: 'application/json',
  })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  const slug = session.candidate.fullName
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '') || 'candidate'
  anchor.href = url
  anchor.download = `evaluation-${slug}-${Date.now()}.json`
  anchor.click()
  URL.revokeObjectURL(url)
}

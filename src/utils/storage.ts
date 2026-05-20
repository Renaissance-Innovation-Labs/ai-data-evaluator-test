import type { EvaluationSession } from '../types'

const STORAGE_KEY = 'validateai-eval-session'
const MAX_ATTACHMENT_BYTES = 500_000

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

export async function fileToAttachment(file: File): Promise<{
  name: string
  mimeType: string
  sizeBytes: number
  dataBase64?: string
}> {
  const base: {
    name: string
    mimeType: string
    sizeBytes: number
    dataBase64?: string
  } = {
    name: file.name,
    mimeType: file.type || 'application/octet-stream',
    sizeBytes: file.size,
  }
  if (file.size <= MAX_ATTACHMENT_BYTES) {
    const buffer = await file.arrayBuffer()
    const bytes = new Uint8Array(buffer)
    let binary = ''
    for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i])
    base.dataBase64 = btoa(binary)
  }
  return base
}

export function downloadSubmission(session: EvaluationSession): void {
  const payload = {
    ...session,
    exportedAt: new Date().toISOString(),
    appVersion: '2.0.0',
    instructions:
      'If attachments exceeded 500KB, email those files separately to the recruiter with this JSON.',
  }
  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: 'application/json',
  })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  const slug =
    session.candidate.fullName
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '') || 'candidate'
  anchor.href = url
  anchor.download = `validation-eval-${slug}-${Date.now()}.json`
  anchor.click()
  URL.revokeObjectURL(url)
}

import type { CandidateInfo, EvaluationSession } from '../types'

export function createSession(candidate: CandidateInfo): EvaluationSession {
  return {
    candidate,
    startedAt: new Date().toISOString(),
    casesOpened: [],
    report: {
      formatNote: '',
      pastedContent: '',
      attachments: [],
    },
    submittedAt: null,
  }
}

export function markCaseOpened(
  session: EvaluationSession,
  caseId: string,
): EvaluationSession {
  if (session.casesOpened.includes(caseId)) return session
  return { ...session, casesOpened: [...session.casesOpened, caseId] }
}

export function canSubmit(session: EvaluationSession): boolean {
  const hasReport =
    session.report.pastedContent.trim().length >= 100 ||
    session.report.attachments.length > 0
  const openedEnough = session.casesOpened.length >= 3
  return hasReport && openedEnough
}

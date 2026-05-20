import type { ScenarioReview } from '../types'

export function createEmptyReview(scenarioId: string): ScenarioReview {
  return {
    scenarioId,
    issues: [],
    positives: [],
    overallRating: null,
    confidence: null,
    summaryNotes: '',
    completedAt: null,
  }
}

export function isReviewComplete(review: ScenarioReview): boolean {
  const hasRating = review.overallRating !== null && review.overallRating >= 1
  const hasConfidence = review.confidence !== null && review.confidence >= 1
  const hasFeedback =
    review.issues.length > 0 ||
    review.positives.length > 0 ||
    review.summaryNotes.trim().length >= 20
  return hasRating && hasConfidence && hasFeedback
}

export function uid(): string {
  return crypto.randomUUID()
}

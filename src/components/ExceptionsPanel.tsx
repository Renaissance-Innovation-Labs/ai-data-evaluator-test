import type { ValidationException } from '../types'

const severityStyles: Record<ValidationException['severity'], string> = {
  info: 'border-blue-500/30 bg-blue-500/10 text-blue-300',
  warning: 'border-amber-500/30 bg-amber-500/10 text-amber-300',
  critical: 'border-red-500/30 bg-red-500/10 text-red-400',
}

interface ExceptionsPanelProps {
  exceptions: ValidationException[]
}

export function ExceptionsPanel({ exceptions }: ExceptionsPanelProps) {
  if (exceptions.length === 0) {
    return (
      <p className="text-sm text-[var(--color-muted)]">
        No exceptions flagged by the agent for this case.
      </p>
    )
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-[var(--color-muted)]">
        Exceptions surface policy violations, match failures, and anomalies detected
        during validation.
      </p>
      {exceptions.map((ex) => (
        <article
          key={ex.code}
          className={`rounded-xl border p-4 ${severityStyles[ex.severity]}`}
        >
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-sm font-semibold">{ex.code}</span>
            <span className="text-[10px] font-medium uppercase tracking-wide opacity-80">
              {ex.severity}
            </span>
          </div>
          <p className="mt-2 text-sm text-white">{ex.message}</p>
          {ex.suggestedAction && (
            <p className="mt-2 text-xs text-[var(--color-muted)]">
              Suggested: {ex.suggestedAction}
            </p>
          )}
        </article>
      ))}
    </div>
  )
}

import type { ApprovalGate } from '../types'
import { GateBadge } from './StatusBadge'

interface ApprovalGatePanelProps {
  gate: ApprovalGate
}

export function ApprovalGatePanel({ gate }: ApprovalGatePanelProps) {
  return (
    <div className="max-w-2xl space-y-4">
      <div className="rounded-xl border-2 border-[var(--color-accent)]/30 bg-[var(--color-accent-soft)]/30 p-6">
        <p className="text-xs font-medium tracking-wide text-[var(--color-muted)] uppercase">
          Recommended gate action
        </p>
        <div className="mt-3 flex items-center gap-4">
          <GateBadge decision={gate.recommended} />
          <span className="text-2xl font-semibold text-white">
            {(gate.confidence * 100).toFixed(0)}% confidence
          </span>
        </div>
        <p className="mt-4 text-sm leading-relaxed text-white">{gate.summary}</p>
      </div>

      {gate.blockers.length > 0 && (
        <div className="rounded-xl border border-[var(--color-danger)]/40 bg-red-500/5 p-4">
          <p className="text-xs font-semibold tracking-wide text-red-400 uppercase">
            Blockers
          </p>
          <ul className="mt-2 list-inside list-disc text-sm text-[#e8c4c4]">
            {gate.blockers.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <p className="text-xs font-medium text-[var(--color-muted)]">Policy references</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {gate.policyRefs.map((ref) => (
            <span
              key={ref}
              className="rounded bg-[var(--color-surface)] px-2 py-1 font-mono text-xs text-[var(--color-accent)]"
            >
              {ref}
            </span>
          ))}
        </div>
      </div>

      <p className="text-xs text-[var(--color-muted)]">
        In production, an AP reviewer would accept or override this recommendation. Your
        evaluation should judge whether the gate outcome is warranted.
      </p>
    </div>
  )
}

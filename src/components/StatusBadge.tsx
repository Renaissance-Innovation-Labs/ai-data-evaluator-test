import type { GateDecision, ValidationStatus } from '../types'

const validationStyles: Record<ValidationStatus, string> = {
  pass: 'bg-emerald-500/15 text-emerald-400',
  fail: 'bg-red-500/15 text-red-400',
  partial: 'bg-amber-500/15 text-amber-400',
}

const gateStyles: Record<GateDecision, string> = {
  approve: 'bg-emerald-500/15 text-emerald-400',
  reject: 'bg-red-500/15 text-red-400',
  hold_for_review: 'bg-amber-500/15 text-amber-400',
}

export function ValidationBadge({ status }: { status: ValidationStatus }) {
  return (
    <span
      className={`inline-flex rounded px-2 py-0.5 text-xs font-semibold uppercase ${validationStyles[status]}`}
    >
      {status}
    </span>
  )
}

export function GateBadge({ decision }: { decision: GateDecision }) {
  const labels: Record<GateDecision, string> = {
    approve: 'Approve',
    reject: 'Reject',
    hold_for_review: 'Hold',
  }
  return (
    <span
      className={`inline-flex rounded px-2 py-0.5 text-xs font-semibold ${gateStyles[decision]}`}
    >
      {labels[decision]}
    </span>
  )
}

import { useMemo, useState } from 'react'
import { validationCases } from '../data/validationCases'
import type { CaseType, ValidationCase } from '../types'
import { GateBadge, ValidationBadge } from './StatusBadge'

interface DashboardProps {
  onOpenCase: (caseId: string) => void
}

const TYPE_FILTERS: { id: CaseType | 'all'; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'contract', label: 'Contract' },
  { id: 'invoice', label: 'Invoice' },
  { id: 'exception', label: 'Exception' },
]

export function Dashboard({ onOpenCase }: DashboardProps) {
  const [typeFilter, setTypeFilter] = useState<CaseType | 'all'>('all')

  const filtered = useMemo(
    () =>
      typeFilter === 'all'
        ? validationCases
        : validationCases.filter((c) => c.caseType === typeFilter),
    [typeFilter],
  )

  const insights = useMemo(() => computeInsights(validationCases), [])

  return (
    <div className="flex flex-1 overflow-hidden">
      <div className="flex-1 overflow-y-auto p-6">
        <div className="mb-6 grid gap-4 sm:grid-cols-4">
          <StatCard label="Validation queue" value={String(validationCases.length)} />
          <StatCard label="Pending gate: Hold" value={String(insights.holdCount)} />
          <StatCard label="Open exceptions" value={String(insights.exceptionCount)} />
          <StatCard label="Agent model" value="validate-v2.4.1" />
        </div>

        <div className="mb-4 flex flex-wrap gap-2">
          {TYPE_FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setTypeFilter(f.id)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                typeFilter === f.id
                  ? 'bg-[var(--color-accent-soft)] text-[var(--color-accent)]'
                  : 'text-[var(--color-muted)] hover:text-white'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="overflow-hidden rounded-xl border border-[var(--color-border)]">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-[var(--color-border)] bg-[var(--color-surface)] text-xs font-medium tracking-wide text-[var(--color-muted)] uppercase">
              <tr>
                <th className="px-4 py-3">Case</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Vendor</th>
                <th className="px-4 py-3">Invoice</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Gate</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <CaseRow key={c.id} validationCase={c} onOpen={() => onOpenCase(c.id)} />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <aside className="hidden w-72 shrink-0 overflow-y-auto border-l border-[var(--color-border)] bg-[var(--color-panel)] p-4 lg:block">
        <h3 className="text-xs font-semibold tracking-wide text-[var(--color-muted)] uppercase">
          Agent insights
        </h3>
        <p className="mt-1 text-xs text-[var(--color-muted)]">
          Aggregated from latest validation run
        </p>

        <div className="mt-4 space-y-3">
          <InsightBlock title="By validation status">
            {(['pass', 'partial', 'fail'] as const).map((s) => (
              <div key={s} className="flex justify-between text-sm">
                <ValidationBadge status={s} />
                <span className="text-white">{insights.byStatus[s]}</span>
              </div>
            ))}
          </InsightBlock>

          <InsightBlock title="Top exception codes">
            {insights.topExceptions.map(([code, count]) => (
              <div key={code} className="flex justify-between gap-2 text-xs">
                <span className="font-mono text-[var(--color-accent)]">{code}</span>
                <span className="text-[var(--color-muted)]">{count}</span>
              </div>
            ))}
          </InsightBlock>

          <InsightBlock title="Gate recommendations">
            {insights.gateBreakdown.map(([gate, count]) => (
              <div key={gate} className="flex justify-between text-sm">
                <GateBadge decision={gate} />
                <span className="text-white">{count}</span>
              </div>
            ))}
          </InsightBlock>
        </div>
      </aside>
    </div>
  )
}

function computeInsights(cases: ValidationCase[]) {
  const byStatus = { pass: 0, partial: 0, fail: 0 }
  const exceptionCodes: Record<string, number> = {}
  const gateBreakdown: Record<string, number> = {}
  let holdCount = 0
  let exceptionCount = 0

  for (const c of cases) {
    byStatus[c.agentValidation.status]++
    gateBreakdown[c.agentValidation.approvalGate.recommended] =
      (gateBreakdown[c.agentValidation.approvalGate.recommended] ?? 0) + 1
    if (c.agentValidation.approvalGate.recommended === 'hold_for_review') holdCount++
    for (const ex of c.agentValidation.exceptions) {
      exceptionCount++
      exceptionCodes[ex.code] = (exceptionCodes[ex.code] ?? 0) + 1
    }
  }

  const topExceptions = Object.entries(exceptionCodes)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)

  const gateBreakdownList = Object.entries(gateBreakdown) as [
    import('../types').GateDecision,
    number,
  ][]

  return {
    byStatus,
    holdCount,
    exceptionCount,
    topExceptions,
    gateBreakdown: gateBreakdownList,
  }
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-panel)] px-4 py-4">
      <p className="text-xs text-[var(--color-muted)]">{label}</p>
      <p className="mt-1 text-xl font-semibold text-white">{value}</p>
    </div>
  )
}

function InsightBlock({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-3">
      <p className="text-xs font-medium text-white">{title}</p>
      <div className="mt-2 space-y-2">{children}</div>
    </div>
  )
}

function CaseRow({
  validationCase,
  onOpen,
}: {
  validationCase: ValidationCase
  onOpen: () => void
}) {
  const v = validationCase.agentValidation
  const typeLabel =
    validationCase.caseType.charAt(0).toUpperCase() + validationCase.caseType.slice(1)

  return (
    <tr className="border-b border-[var(--color-border)]/60 hover:bg-[var(--color-panel)]/40">
      <td className="px-4 py-3">
        <span className="font-mono text-xs text-[var(--color-accent)]">
          {validationCase.caseRef}
        </span>
      </td>
      <td className="px-4 py-3">
        <span className="rounded bg-[var(--color-surface)] px-2 py-0.5 text-xs text-[var(--color-muted)]">
          {typeLabel}
        </span>
      </td>
      <td className="px-4 py-3 text-white">{validationCase.vendor}</td>
      <td className="px-4 py-3 font-mono text-xs">{validationCase.invoiceNumber}</td>
      <td className="px-4 py-3">${validationCase.amountUsd.toLocaleString()}</td>
      <td className="px-4 py-3">
        <ValidationBadge status={v.status} />
      </td>
      <td className="px-4 py-3">
        <GateBadge decision={v.approvalGate.recommended} />
        <span className="ml-1 text-xs text-[var(--color-muted)]">
          {(v.approvalGate.confidence * 100).toFixed(0)}%
        </span>
      </td>
      <td className="px-4 py-3 text-right">
        <button
          type="button"
          onClick={onOpen}
          className="rounded-lg bg-[var(--color-accent-soft)] px-3 py-1.5 text-xs font-medium text-[var(--color-accent)] hover:brightness-125"
        >
          Open
        </button>
      </td>
    </tr>
  )
}

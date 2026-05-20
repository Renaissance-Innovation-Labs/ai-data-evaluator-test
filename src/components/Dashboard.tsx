import { validationCases } from '../data/validationCases'
import type { ValidationCase } from '../types'
import { GateBadge, ValidationBadge } from './StatusBadge'

interface DashboardProps {
  casesOpened: string[]
  onOpenCase: (caseId: string) => void
  onSubmitReport: () => void
}

export function Dashboard({ casesOpened, onOpenCase, onSubmitReport }: DashboardProps) {
  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard label="Cases in queue" value={String(validationCases.length)} />
        <StatCard
          label="Cases you opened"
          value={`${casesOpened.length} / ${validationCases.length}`}
        />
        <StatCard label="Agent model" value="validate-v2.4.1" />
      </div>

      <div className="overflow-hidden rounded-xl border border-[var(--color-border)]">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-[var(--color-border)] bg-[var(--color-surface)] text-xs font-medium tracking-wide text-[var(--color-muted)] uppercase">
            <tr>
              <th className="px-4 py-3">Case</th>
              <th className="px-4 py-3">Vendor</th>
              <th className="px-4 py-3">Invoice</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Agent status</th>
              <th className="px-4 py-3">Gate</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {validationCases.map((c) => (
              <CaseRow
                key={c.id}
                validationCase={c}
                opened={casesOpened.includes(c.id)}
                onOpen={() => onOpenCase(c.id)}
              />
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8 rounded-xl border border-dashed border-[var(--color-border)] bg-[var(--color-panel)]/50 p-5">
        <h3 className="font-medium text-white">Ready to submit?</h3>
        <p className="mt-1 text-sm text-[var(--color-muted)]">
          When you have reviewed the cases, submit your evaluation report in your
          preferred format (paste and/or upload). Open at least 3 cases before
          submitting.
        </p>
        <button
          type="button"
          onClick={onSubmitReport}
          className="mt-4 rounded-lg bg-[var(--color-success)] px-4 py-2 text-sm font-medium text-white hover:brightness-110"
        >
          Submit evaluation report
        </button>
      </div>
    </div>
  )
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-panel)] px-4 py-4">
      <p className="text-xs text-[var(--color-muted)]">{label}</p>
      <p className="mt-1 text-xl font-semibold text-white">{value}</p>
    </div>
  )
}

function CaseRow({
  validationCase,
  opened,
  onOpen,
}: {
  validationCase: ValidationCase
  opened: boolean
  onOpen: () => void
}) {
  const v = validationCase.agentValidation
  return (
    <tr className="border-b border-[var(--color-border)]/60 hover:bg-[var(--color-panel)]/40">
      <td className="px-4 py-3">
        <span className="font-mono text-xs text-[var(--color-accent)]">
          {validationCase.caseRef}
        </span>
        {opened && (
          <span className="ml-2 text-[10px] text-[var(--color-muted)]">viewed</span>
        )}
      </td>
      <td className="px-4 py-3 text-white">{validationCase.vendor}</td>
      <td className="px-4 py-3 font-mono text-xs">{validationCase.invoiceNumber}</td>
      <td className="px-4 py-3">
        ${validationCase.amountUsd.toLocaleString()}
      </td>
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
          Review
        </button>
      </td>
    </tr>
  )
}

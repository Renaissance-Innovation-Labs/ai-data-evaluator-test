import type { AgentValidation } from '../types'

interface ValidationReportPanelProps {
  validation: AgentValidation
}

export function ValidationReportPanel({ validation }: ValidationReportPanelProps) {
  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-panel)] p-4">
        <p className="text-xs font-medium tracking-wide text-[var(--color-muted)] uppercase">
          Agent summary
        </p>
        <p className="mt-2 text-sm leading-relaxed text-white">{validation.summary}</p>
        <p className="mt-3 text-xs text-[var(--color-muted)]">
          Model {validation.modelVersion}
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border border-[var(--color-border)]">
        <table className="w-full text-left text-sm">
          <thead className="bg-[var(--color-surface)] text-xs font-medium text-[var(--color-muted)] uppercase">
            <tr>
              <th className="px-4 py-2">Field</th>
              <th className="px-4 py-2">Contract</th>
              <th className="px-4 py-2">Invoice</th>
              <th className="px-4 py-2">Match</th>
              <th className="px-4 py-2">Agent verdict</th>
            </tr>
          </thead>
          <tbody>
            {validation.fieldChecks.map((row) => (
              <tr
                key={row.field}
                className="border-t border-[var(--color-border)]/60"
              >
                <td className="px-4 py-2.5 font-medium text-white">{row.field}</td>
                <td className="px-4 py-2.5 text-[var(--color-muted)]">{row.contractValue}</td>
                <td className="px-4 py-2.5 text-[var(--color-muted)]">{row.invoiceValue}</td>
                <td className="px-4 py-2.5">
                  <span
                    className={
                      row.match
                        ? 'text-emerald-400'
                        : 'text-red-400'
                    }
                  >
                    {row.match ? '✓' : '✗'}
                  </span>
                </td>
                <td className="px-4 py-2.5 text-xs text-[#c5d0de]">
                  {row.agentVerdict}
                  {row.citationId && (
                    <span className="ml-1 text-[var(--color-accent)]">
                      [{row.citationId}]
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

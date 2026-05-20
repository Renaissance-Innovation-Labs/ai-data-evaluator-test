import type { Citation } from '../types'

const docLabels: Record<Citation['sourceDoc'], string> = {
  contract: 'Contract',
  invoice: 'Invoice',
  purchase_order: 'Purchase order',
}

interface CitationsPanelProps {
  citations: Citation[]
}

export function CitationsPanel({ citations }: CitationsPanelProps) {
  return (
    <div className="space-y-3">
      <p className="text-sm text-[var(--color-muted)]">
        Citations link agent claims to source spans. Verify each supports what the
        agent concluded.
      </p>
      {citations.map((cit) => (
        <article
          key={cit.id}
          className="rounded-xl border border-[var(--color-border)] bg-[var(--color-panel)] p-4"
        >
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs text-[var(--color-accent)]">{cit.id}</span>
            <span className="text-sm font-medium text-white">{cit.label}</span>
            <span className="rounded bg-[var(--color-surface)] px-2 py-0.5 text-[10px] text-[var(--color-muted)]">
              {docLabels[cit.sourceDoc]}
            </span>
          </div>
          <p className="mt-3 text-xs font-medium text-[var(--color-muted)]">
            Supports: {cit.supportsClaim}
          </p>
          <blockquote className="mt-2 border-l-2 border-[var(--color-accent)] pl-3 text-sm italic text-[#c5d0de]">
            "{cit.excerpt}"
          </blockquote>
        </article>
      ))}
    </div>
  )
}

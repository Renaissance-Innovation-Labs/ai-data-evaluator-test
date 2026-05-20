import { useState } from 'react'
import type { ContentTab, Scenario } from '../types'

interface ContentPanelProps {
  scenario: Scenario
}

const TABS: { id: ContentTab; label: string }[] = [
  { id: 'context', label: 'Context' },
  { id: 'output', label: 'Agent output' },
  { id: 'trace', label: 'Trace' },
]

export function ContentPanel({ scenario }: ContentPanelProps) {
  const [tab, setTab] = useState<ContentTab>('context')

  const labels: Record<ContentTab, string> = {
    context: scenario.content.contextLabel,
    output: scenario.content.outputLabel,
    trace: scenario.content.traceLabel,
  }

  const bodies: Record<ContentTab, string> = {
    context: scenario.content.context,
    output: scenario.content.output,
    trace: scenario.content.trace,
  }

  return (
    <section className="flex min-w-0 flex-1 flex-col overflow-hidden">
      <header className="border-b border-[var(--color-border)] px-6 py-4">
        <h2 className="text-lg font-semibold text-white">{scenario.title}</h2>
        <p className="mt-1 text-sm text-[var(--color-muted)]">{scenario.description}</p>
        <div className="mt-3 flex gap-1">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
                tab === t.id
                  ? 'bg-[var(--color-accent-soft)] text-[var(--color-accent)]'
                  : 'text-[var(--color-muted)] hover:text-white'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-6 py-4">
        <p className="mb-2 text-xs font-medium tracking-wide text-[var(--color-muted)] uppercase">
          {labels[tab]}
        </p>
        <pre className="whitespace-pre-wrap rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-4 font-mono text-sm leading-relaxed text-[#c5d0de]">
          {bodies[tab]}
        </pre>
      </div>
    </section>
  )
}

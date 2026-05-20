import type { SourceDocuments } from '../types'

interface DocumentsPanelProps {
  documents: SourceDocuments
}

export function DocumentsPanel({ documents }: DocumentsPanelProps) {
  const docs = [
    documents.contract,
    documents.invoice,
    ...(documents.purchaseOrder ? [documents.purchaseOrder] : []),
  ]

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {docs.map((doc) => (
        <article
          key={doc.title}
          className="rounded-xl border border-[var(--color-border)] bg-[var(--color-panel)]"
        >
          <header className="border-b border-[var(--color-border)] px-4 py-2.5">
            <h3 className="text-sm font-medium text-white">{doc.title}</h3>
          </header>
          <pre className="max-h-[28rem] overflow-y-auto whitespace-pre-wrap p-4 font-mono text-xs leading-relaxed text-[#c5d0de]">
            {doc.body}
          </pre>
        </article>
      ))}
    </div>
  )
}

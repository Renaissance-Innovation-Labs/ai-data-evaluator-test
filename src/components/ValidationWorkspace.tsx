import { useState } from 'react'
import { validationCases } from '../data/validationCases'
import { CaseDetail } from './CaseDetail'
import { Dashboard } from './Dashboard'

export function ValidationWorkspace() {
  const [activeCaseId, setActiveCaseId] = useState<string | null>(null)

  const activeCase = activeCaseId
    ? validationCases.find((c) => c.id === activeCaseId)
    : null

  return (
    <div className="flex h-screen flex-col">
      <header className="flex shrink-0 items-center border-b border-[var(--color-border)] bg-[var(--color-panel)] px-5 py-3">
        <div>
          <p className="text-sm font-semibold text-white">ValidateAI</p>
          <p className="text-xs text-[var(--color-muted)]">
            Contract, invoice &amp; exception validation
          </p>
        </div>
      </header>

      <main className="flex min-h-0 flex-1 flex-col">
        {activeCase ? (
          <CaseDetail validationCase={activeCase} onBack={() => setActiveCaseId(null)} />
        ) : (
          <Dashboard onOpenCase={setActiveCaseId} />
        )}
      </main>
    </div>
  )
}

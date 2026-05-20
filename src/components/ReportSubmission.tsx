import { useRef, useState } from 'react'
import type { CandidateReport, EvaluationSession } from '../types'
import { fileToAttachment } from '../utils/storage'
import { canSubmit as sessionCanSubmit } from '../utils/session'

interface ReportSubmissionProps {
  session: EvaluationSession
  onClose: () => void
  onSave: (report: CandidateReport) => void
  onSubmit: (report: CandidateReport) => void
}

export function ReportSubmission({
  session,
  onClose,
  onSave,
  onSubmit,
}: ReportSubmissionProps) {
  const [formatNote, setFormatNote] = useState(session.report.formatNote)
  const [pastedContent, setPastedContent] = useState(session.report.pastedContent)
  const [attachments, setAttachments] = useState(session.report.attachments)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  const report: CandidateReport = { formatNote, pastedContent, attachments }

  async function handleFiles(files: FileList | null) {
    if (!files?.length) return
    setBusy(true)
    setError('')
    try {
      const added = await Promise.all(Array.from(files).map(fileToAttachment))
      setAttachments((prev) => [...prev, ...added])
    } catch {
      setError('Could not read one or more files.')
    } finally {
      setBusy(false)
    }
  }

  function handleSaveDraft() {
    onSave(report)
    onClose()
  }

  function handleSubmit() {
    const draft = { ...session, report }
    if (!sessionCanSubmit(draft)) {
      setError(
        'Open at least 3 cases and provide your report (100+ characters pasted and/or at least one file).',
      )
      return
    }
    onSubmit(report)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div
        role="dialog"
        aria-labelledby="report-title"
        className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-panel)] shadow-2xl"
      >
        <header className="border-b border-[var(--color-border)] px-6 py-4">
          <h2 id="report-title" className="text-lg font-semibold text-white">
            Submit evaluation report
          </h2>
          <p className="mt-1 text-sm text-[var(--color-muted)]">
            Use your normal workflow — spreadsheet, markdown, PDF, etc. No template is
            provided on purpose.
          </p>
        </header>

        <div className="flex-1 space-y-4 overflow-y-auto px-6 py-4">
          <div>
            <label className="block text-xs font-medium text-[var(--color-muted)]">
              Format you used (optional)
            </label>
            <input
              type="text"
              value={formatNote}
              onChange={(e) => setFormatNote(e.target.value)}
              placeholder="e.g. Google Sheet, Notion doc, Markdown notes"
              className="mt-1 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[var(--color-muted)]">
              Paste report content
            </label>
            <textarea
              value={pastedContent}
              onChange={(e) => setPastedContent(e.target.value)}
              rows={12}
              placeholder="Paste your evaluation here if you wrote it in a doc — or summarize and point to uploaded files."
              className="mt-1 w-full resize-y rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 font-mono text-sm text-white"
            />
            <p className="mt-1 text-xs text-[var(--color-muted)]">
              {pastedContent.trim().length} characters
              {pastedContent.trim().length < 100 && ' (min 100 if no file attached)'}
            </p>
          </div>

          <div>
            <label className="block text-xs font-medium text-[var(--color-muted)]">
              Upload files
            </label>
            <input
              ref={fileRef}
              type="file"
              multiple
              accept=".md,.txt,.csv,.xlsx,.xls,.pdf,.doc,.docx,.json"
              className="mt-2 block w-full text-sm text-[var(--color-muted)] file:mr-3 file:rounded-lg file:border-0 file:bg-[var(--color-accent)] file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-white"
              onChange={(e) => {
                void handleFiles(e.target.files)
                e.target.value = ''
              }}
            />
            <p className="mt-1 text-xs text-[var(--color-muted)]">
              Files under 500KB are embedded in the JSON export; larger files — include
              filename and email them separately.
            </p>
            {attachments.length > 0 && (
              <ul className="mt-2 space-y-1 text-sm text-white">
                {attachments.map((a, i) => (
                  <li key={`${a.name}-${i}`} className="flex justify-between gap-2">
                    <span>
                      {a.name}{' '}
                      <span className="text-[var(--color-muted)]">
                        ({(a.sizeBytes / 1024).toFixed(1)} KB
                        {a.dataBase64 ? ', embedded' : ', metadata only'})
                      </span>
                    </span>
                    <button
                      type="button"
                      className="text-xs text-[var(--color-danger)]"
                      onClick={() =>
                        setAttachments((prev) => prev.filter((_, j) => j !== i))
                      }
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {error && (
            <p className="text-sm text-[var(--color-danger)]" role="alert">
              {error}
            </p>
          )}
        </div>

        <footer className="flex gap-3 border-t border-[var(--color-border)] px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-[var(--color-border)] px-4 py-2 text-sm text-white hover:bg-[var(--color-surface)]"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={handleSaveDraft}
            className="rounded-lg border border-[var(--color-border)] px-4 py-2 text-sm text-white hover:bg-[var(--color-surface)]"
          >
            Save draft
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={handleSubmit}
            className="ml-auto rounded-lg bg-[var(--color-success)] px-4 py-2 text-sm font-medium text-white hover:brightness-110"
          >
            Download submission &amp; finish
          </button>
        </footer>
      </div>
    </div>
  )
}

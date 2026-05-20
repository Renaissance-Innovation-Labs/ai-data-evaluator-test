interface SubmitModalProps {
  candidateName: string
  onConfirm: () => void
  onCancel: () => void
}

export function SubmitModal({ candidateName, onConfirm, onCancel }: SubmitModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div
        role="dialog"
        aria-labelledby="submit-title"
        className="max-w-md rounded-xl border border-[var(--color-border)] bg-[var(--color-panel)] p-6 shadow-xl"
      >
        <h2 id="submit-title" className="text-lg font-semibold text-white">
          Submit evaluation
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-[var(--color-muted)]">
          Hi {candidateName}, this will download a JSON file with your responses.
          Email that file to your recruiter. You can close the browser after
          submitting — your answers are included in the download.
        </p>
        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 rounded-lg border border-[var(--color-border)] px-4 py-2.5 text-sm font-medium text-white hover:bg-[var(--color-surface)]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 rounded-lg bg-[var(--color-success)] px-4 py-2.5 text-sm font-medium text-white hover:brightness-110"
          >
            Download & finish
          </button>
        </div>
      </div>
    </div>
  )
}

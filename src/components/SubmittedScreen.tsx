interface SubmittedScreenProps {
  onReset: () => void
}

export function SubmittedScreen({ onReset }: SubmittedScreenProps) {
  return (
    <div className="mx-auto flex min-h-screen max-w-lg flex-col justify-center px-6 text-center">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-success)]/20 text-2xl text-[var(--color-success)]">
        ✓
      </div>
      <h1 className="text-2xl font-semibold text-white">Thank you</h1>
      <p className="mt-3 text-[var(--color-muted)]">
        Your evaluation file has been downloaded. Send it to your recruiter to
        complete the process.
      </p>
      <button
        type="button"
        onClick={onReset}
        className="mt-8 text-sm text-[var(--color-muted)] underline hover:text-white"
      >
        Start a new session (demo)
      </button>
    </div>
  )
}

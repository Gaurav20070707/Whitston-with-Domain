export default function Loading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-ink-900/15 border-t-brass dark:border-parchment-100/15 dark:border-t-brass-light" />
        <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-ink-500 dark:text-ink-300">
          Loading Whitston…
        </p>
      </div>
    </div>
  );
}

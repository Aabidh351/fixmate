
export default function Loading() {
  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-background px-4">
      <div className="flex flex-col items-center text-center">
        <div className="relative flex size-16 items-center justify-center">
          <div className="absolute size-full animate-spin rounded-full border-4 border-primary/15 border-t-primary" />
          <span className="text-xl">🔧</span>
        </div>

        <h2 className="mt-6 text-xl font-extrabold text-secondary">
          FixMate
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Getting your payment status...
        </p>
      </div>
    </main>
  );
}

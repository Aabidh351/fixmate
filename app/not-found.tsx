
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-[75vh] items-center justify-center bg-background px-4 py-16">
      <div className="mx-auto max-w-lg text-center">
        <div className="mx-auto flex size-24 items-center justify-center rounded-3xl bg-primary/10 text-5xl">
          🔧
        </div>

        <h1 className="mt-8 text-8xl font-extrabold tracking-tight text-primary">
          404
        </h1>

        <h2 className="mt-4 text-2xl font-extrabold text-secondary">
          Oops! Page Not Found
        </h2>

        <p className="mt-4 leading-7 text-slate-600">
          Looks like this page needs a little repair. The page you&apos;re looking
          for doesn&apos;t exist or may have been moved.
        </p>

        <Link
          href="/"
          className="mt-8 inline-flex items-center justify-center rounded-xl bg-primary px-7 py-3.5 text-sm font-bold text-white transition-colors hover:bg-primary/90"
        >
          Back to Home
        </Link>
      </div>
    </main>
  );
}

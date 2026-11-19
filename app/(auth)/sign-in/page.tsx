import Link from "next/link";
import GoogleButton from "@/components/auth/GoogleButton";
import SignInForm from "@/components/auth/SignInForm";

export default function SignInPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F5F8FA] px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-[#142B3A] text-center">
          Welcome Back
        </h1>

        <p className="mt-2 text-sm text-slate-500 text-center">
          Sign in to continue using FixMate.
        </p>

        <div className="mt-8">
          <GoogleButton />
        </div>

        <div className="my-6 flex items-center gap-4">
          <div className="h-px flex-1 bg-slate-200" />
          <span className="text-sm text-slate-400">OR</span>
          <div className="h-px flex-1 bg-slate-200" />
        </div>

        <SignInForm />

        <p className="mt-6 text-center text-sm text-slate-500">
          Don&apos;t have an account?{" "}
          <Link
            href="/sign-up"
            className="font-semibold text-[#0F9D8A] hover:underline"
          >
            Create Account
          </Link>
        </p>
      </div>
    </main>
  );
}
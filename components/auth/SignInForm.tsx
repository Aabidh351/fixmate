"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

export default function SignInForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const email = String(formData.get("email")).trim();
    const password = String(formData.get("password"));

    setLoading(true);

    try {
      const result = await authClient.signIn.email({
        email,
        password,
        callbackURL: "/",
      });

      if (result.error) {
        toast.error(result.error.message || "Sign in failed.");
        return;
      }

      toast.success("Signed in successfully!");
      router.push("/");
      router.refresh();
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="mb-2 block text-sm font-medium text-[#263746]">
          Email Address
        </label>
        <input
          type="email"
          name="email"
          placeholder="Enter your email"
          required
          className="h-12 w-full rounded-lg border border-slate-200 px-4 outline-none focus:border-[#0F9D8A]"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-[#263746]">
          Password
        </label>
        <input
          type="password"
          name="password"
          placeholder="Enter your password"
          required
          className="h-12 w-full rounded-lg border border-slate-200 px-4 outline-none focus:border-[#0F9D8A]"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="h-12 w-full rounded-lg bg-[#0F9D8A] font-semibold text-white transition hover:bg-[#0c8575] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Signing In..." : "Sign In"}
      </button>
    </form>
  );
}
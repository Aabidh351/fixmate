
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

export default function SignUpForm() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const name = String(formData.get("name")).trim();
    const email = String(formData.get("email")).trim();
    const password = String(formData.get("password"));
    const role = String(formData.get("role"));

    if (password.length < 6 || !/[a-z]/.test(password) || !/[A-Z]/.test(password)) {
      toast.error("Password must contain at least 6 characters, including uppercase and lowercase letters.");
      return;
    }

    setLoading(true);

    try {
      const result = await authClient.signUp.email({
        name,
        email,
        password,
        callbackURL: "/",
        role,
      } as Parameters<typeof authClient.signUp.email>[0]);

      if (result.error) {
        toast.error(result.error.message || "Registration failed.");
        return;
      }

      toast.success("Account created successfully!");
      router.push("/");
      router.refresh();
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-0 space-y-5">
      <div>
        <label className="mb-2 block text-sm font-medium text-[#263746]">
          Full Name
        </label>
        <input
          type="text"
          name="name"
          placeholder="Enter your full name"
          required
          className="h-12 w-full rounded-lg border border-slate-200 px-4 outline-none focus:border-[#0F9D8A]"
        />
      </div>

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
          placeholder="Create a password"
          required
          className="h-12 w-full rounded-lg border border-slate-200 px-4 outline-none focus:border-[#0F9D8A]"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-[#263746]">
          Account Type
        </label>
        <select
          name="role"
          defaultValue="customer"
          className="h-12 w-full rounded-lg border border-slate-200 bg-white px-4 outline-none focus:border-[#0F9D8A]"
        >
          <option value="customer">Customer</option>
          <option value="technician">Technician</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="h-12 w-full rounded-lg bg-[#0F9D8A] font-semibold text-white transition hover:bg-[#0c8575] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Creating Account..." : "Create Account"}
      </button>
    </form>
  );
}

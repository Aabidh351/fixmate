
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

export default function SignUpForm() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const name = String(formData.get("name")).trim();
    const email = String(formData.get("email")).trim();
    const password = String(formData.get("password"));
    const confirmPassword = String(formData.get("confirmPassword"));
    const role = String(formData.get("role"));

    if (
      password.length < 6 ||
      !/[a-z]/.test(password) ||
      !/[A-Z]/.test(password)
    ) {
      toast.error(
        "Password must contain at least 6 characters, including uppercase and lowercase letters."
      );
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
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
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Create a password"
            required
            className="h-12 w-full rounded-lg border border-slate-200 px-4 pr-12 outline-none focus:border-[#0F9D8A]"
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute top-1/2 right-4 -translate-y-1/2 text-slate-400 hover:text-[#0F9D8A]"
          >
            <PasswordIcon visible={showPassword} />
          </button>
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-[#263746]">
          Confirm Password
        </label>
        <div className="relative">
          <input
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            placeholder="Confirm your password"
            required
            className="h-12 w-full rounded-lg border border-slate-200 px-4 pr-12 outline-none focus:border-[#0F9D8A]"
          />

          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            aria-label={
              showConfirmPassword
                ? "Hide confirm password"
                : "Show confirm password"
            }
            className="absolute top-1/2 right-4 -translate-y-1/2 text-slate-400 hover:text-[#0F9D8A]"
          >
            <PasswordIcon visible={showConfirmPassword} />
          </button>
        </div>
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
          <option value="admin" disabled>
            Admin (Unavailable)
          </option>
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

function PasswordIcon({ visible }: { visible: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-5"
      aria-hidden="true"
    >
      {visible ? (
        <>
          <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z" />
          <circle cx="12" cy="12" r="3" />
        </>
      ) : (
        <>
          <path d="m3 3 18 18" />
          <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
          <path d="M9.9 5.2A10.8 10.8 0 0 1 12 5c6.4 0 10 7 10 7a15.5 15.5 0 0 1-3.1 3.8" />
          <path d="M6.2 6.2C3.5 8.1 2 12 2 12s3.6 7 10 7a10.8 10.8 0 0 0 4.1-.8" />
        </>
      )}
    </svg>
  );
}

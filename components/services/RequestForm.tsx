
"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

type RequestFormProps = {
  serviceId: string;
  name: string;
  email: string;
  phone: string;
};

export default function RequestForm({
  serviceId,
  name,
  email,
  phone,
}: RequestFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const today = new Date();
  const minDate = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0"),
  ].join("-");

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
  e.preventDefault();

  const formData = new FormData(e.currentTarget);

  setIsSubmitting(true);

  try {
    const { data, error } = await authClient.token();

    if (error || !data?.token) {
      throw new Error(
        "Unable to authenticate your request. Please sign in again."
      );
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/bookings`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${data.token}`,
        },
        body: JSON.stringify({
          serviceId,
          phone: formData.get("phone"),
          address: formData.get("address"),
          preferredDate: formData.get("preferredDate"),
          problemDescription: formData.get("problemDescription"),
        }),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to submit repair request.");
    }

    toast.success("Repair request submitted successfully!");
    setSubmitted(true);
  } catch (error) {
    toast.error(
      error instanceof Error
        ? error.message
        : "Something went wrong. Please try again."
    );
  } finally {
    setIsSubmitting(false);
  }
};

  if (submitted) {
    return (
      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-8 text-center">
        <h2 className="text-xl font-bold text-secondary">
          Request Submitted!
        </h2>
        <p className="mt-2 text-slate-600">
          Your repair request has been sent successfully.
        </p>
        <Link
          href="/dashboard/customer/bookings"
          className="mt-6 inline-flex rounded-lg bg-primary px-6 py-3 font-semibold text-white hover:bg-primary/90"
        >
          Go to My Bookings
        </Link>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-8 space-y-5 rounded-2xl border border-slate-200 bg-white p-6"
    >
      <div>
        <label className="mb-2 block text-sm font-semibold text-secondary">
          Full Name
        </label>
        <input
          type="text"
          value={name}
          readOnly
          className="h-12 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 text-sm text-slate-500"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-secondary">
          Email Address
        </label>
        <input
          type="email"
          value={email}
          readOnly
          className="h-12 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 text-sm text-slate-500"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-secondary">
          Phone Number
        </label>
        <input
          type="tel"
          name="phone"
          defaultValue={phone}
          required
          placeholder="Enter your phone number"
          className="h-12 w-full rounded-lg border border-slate-200 px-4 text-sm outline-none focus:border-primary"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-secondary">
          Address
        </label>
        <textarea
          name="address"
          required
          rows={3}
          placeholder="Enter your complete address"
          className="w-full rounded-lg border border-slate-200 p-4 text-sm outline-none focus:border-primary"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-secondary">
          Preferred Date
        </label>
        <input
          type="date"
          name="preferredDate"
          min={minDate}
          required
          className="h-12 w-full rounded-lg border border-slate-200 px-4 text-sm outline-none focus:border-primary"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-secondary">
          Describe Your Problem
        </label>
        <textarea
          name="problemDescription"
          required
          minLength={20}
          rows={4}
          placeholder="Describe the issue with your device or appliance (at least 20 characters)"
          className="w-full rounded-lg border border-slate-200 p-4 text-sm outline-none focus:border-primary"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-lg bg-primary px-6 py-3 font-semibold text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Submitting..." : "Submit Repair Request"}
      </button>
    </form>
  );
}

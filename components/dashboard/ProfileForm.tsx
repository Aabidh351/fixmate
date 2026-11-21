
"use client";

import { useState } from "react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

type ProfileFormProps = {
  name: string;
  email: string;
  phone: string;
  area: string;
  bio: string;
};

export default function ProfileForm({
  name: initialName,
  email,
  phone: initialPhone,
  area: initialArea,
  bio: initialBio,
}: ProfileFormProps) {
  const [name, setName] = useState(initialName);
  const [phone, setPhone] = useState(initialPhone);
  const [area, setArea] = useState(initialArea);
  const [bio, setBio] = useState(initialBio);
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);

    const { error } = await authClient.updateUser({
      name,
      phone,
      area,
      bio,
    });

    setIsSaving(false);

    if (error) {
      toast.error(error.message || "Failed to update profile.");
      return;
    }

    toast.success("Profile updated successfully!");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="mb-2 block text-sm font-medium text-[#263746]">
          Full Name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
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
          value={email}
          disabled
          className="h-12 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 text-slate-500"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-[#263746]">
          Phone Number
        </label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="h-12 w-full rounded-lg border border-slate-200 px-4 outline-none focus:border-[#0F9D8A]"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-[#263746]">
          Area
        </label>
        <input
          type="text"
          value={area}
          onChange={(e) => setArea(e.target.value)}
          className="h-12 w-full rounded-lg border border-slate-200 px-4 outline-none focus:border-[#0F9D8A]"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-[#263746]">
          Bio
        </label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={4}
          className="w-full rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-[#0F9D8A]"
        />
      </div>

      <button
        type="submit"
        disabled={isSaving}
        className="rounded-lg bg-[#0F9D8A] px-6 py-3 font-semibold text-white transition-colors hover:bg-[#0c8979] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSaving ? "Saving..." : "Save Changes"}
      </button>
    </form>
  );
}

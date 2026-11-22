
"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

type ProfileFormProps = {
  name: string;
  email: string;
  role: string;
  phone: string;
  area: string;
  bio: string;
  image: string;
};

export default function ProfileForm({
  name: initialName,
  email,
  role,
  phone: initialPhone,
  area: initialArea,
  bio: initialBio,
  image: initialImage,
}: ProfileFormProps) {
  const [name, setName] = useState(initialName);
  const [phone, setPhone] = useState(initialPhone);
  const [area, setArea] = useState(initialArea);
  const [bio, setBio] = useState(initialBio);
  const [image, setImage] = useState(initialImage);
  const [preview, setPreview] = useState(initialImage);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB.");
      return;
    }

    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const uploadImage = async () => {
    if (!selectedFile) return image;

    const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

    if (!apiKey) {
      throw new Error("ImgBB API key is missing.");
    }

    const formData = new FormData();
    formData.append("image", selectedFile);

    setIsUploading(true);

    try {
      const response = await fetch(
        `https://api.imgbb.com/1/upload?key=${apiKey}`,
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error("Image upload failed.");
      }

      return result.data.url as string;
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Name is required.");
      return;
    }

    setIsSaving(true);

    try {
      const uploadedImage = await uploadImage();

      const { error } = await authClient.updateUser({
        name: name.trim(),
        phone,
        area,
        bio,
        image: uploadedImage,
      });

      if (error) {
        throw new Error(error.message || "Failed to update profile.");
      }

      setImage(uploadedImage);
      setPreview(uploadedImage);
      setSelectedFile(null);

      toast.success("Profile updated successfully!");

      // Refresh server-rendered session data.
      await authClient.getSession();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Profile Photo */}
      <div>
        <label className="mb-3 block text-sm font-medium text-[#263746]">
          Profile Photo
        </label>

        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          <div className="relative h-24 w-24 overflow-hidden rounded-full border border-slate-200 bg-slate-100">
            {preview ? (
              <Image
                src={preview}
                alt="Profile photo"
                fill
                unoptimized
                className="object-cover"
                sizes="96px"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-3xl font-semibold text-slate-400">
                {name.charAt(0).toUpperCase() || "U"}
              </div>
            )}
          </div>

          <div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-[#263746] transition-colors hover:bg-slate-50"
            >
              Choose Photo
            </button>

            <p className="mt-2 text-xs text-slate-500">
              JPG, PNG or other image formats. Maximum 5MB.
            </p>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>
        </div>
      </div>

      {/* Full Name */}
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

      {/* Email */}
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

      {/* Role */}
      <div>
        <label className="mb-2 block text-sm font-medium text-[#263746]">
          Account Role
        </label>

        <input
          type="text"
          value={role.charAt(0).toUpperCase() + role.slice(1)}
          disabled
          className="h-12 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 capitalize text-slate-500"
        />
      </div>

      {/* Phone */}
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

      {/* Area */}
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

      {/* Bio */}
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

      {/* Submit */}
      <button
        type="submit"
        disabled={isSaving || isUploading}
        className="rounded-lg bg-[#0F9D8A] px-6 py-3 font-semibold text-white transition-colors hover:bg-[#0c8979] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isUploading
          ? "Uploading Photo..."
          : isSaving
            ? "Saving..."
            : "Save Changes"}
      </button>
    </form>
  );
}

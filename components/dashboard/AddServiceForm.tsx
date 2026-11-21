
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import Image from "next/image";

export default function AddServiceForm() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState("");

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB.");
      return;
    }

    setImage(file);
    setPreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);

    if (!image) {
      toast.error("Please upload a service image.");
      return;
    }

    setLoading(true);

    try {
      const imageData = new FormData();
      imageData.append("image", image);

      const imageResponse = await fetch(
        `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`,
        {
          method: "POST",
          body: imageData,
        }
      );

      const imageResult = await imageResponse.json();

      if (!imageResponse.ok || !imageResult.success) {
        toast.error("Image upload failed.");
        return;
      }

      const imageUrl = imageResult.data.url;

      const { data, error } = await authClient.token();

      if (error || !data?.token) {
        toast.error("Authentication failed. Please sign in again.");
        return;
      }

      // Submit service
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/services`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${data.token}`,
          },
          body: JSON.stringify({
            title: formData.get("title"),
            description: formData.get("description"),
            category: formData.get("category"),
            basePrice: Number(formData.get("basePrice")),
            image: imageUrl,
            serviceMode: formData.get("serviceMode"),
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.message || "Failed to add service.");
        return;
      }

      toast.success(result.message);
      form.reset();
      setImage(null);
      setPreview("");
      router.push("/dashboard/technician/my-services");
      router.refresh();
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-xl border border-slate-200 bg-white p-6"
    >
      <div>
        <label className="mb-2 block text-sm font-medium">Service Title</label>
        <input
          name="title"
          required
          placeholder="e.g. AC Repair"
          className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">Description</label>
        <textarea
          name="description"
          required
          rows={4}
          placeholder="Describe the service..."
          className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">Category</label>
        <select
          name="category"
          required
          defaultValue=""
          className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
        >
          <option value="" disabled>Select category</option>
          <option value="Laptop & PC">Laptop & PC</option>
          <option value="AC Repair">AC Repair</option>
          <option value="Refrigerator Repair">Refrigerator Repair</option>
          <option value="TV Repair">TV Repair</option>
          <option value="Washing Machine Repair">Washing Machine Repair</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">Base Price (USD)</label>
        <input
          name="basePrice"
          type="number"
          min="1"
          step="0.01"
          required
          placeholder="e.g. 50"
          className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">Service Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full rounded-lg border border-slate-300 px-4 py-3"
        />

        {preview && (
          <Image
            src={preview}
            alt="Service preview"
            width={600}
            height={300}
            unoptimized
            className="mt-4 h-48 w-full rounded-lg object-cover"
          />
        )}
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">Service Mode</label>
        <select
          name="serviceMode"
          required
          defaultValue=""
          className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
        >
          <option value="" disabled>Select service mode</option>
          <option value="Home Visit">Home Visit</option>
          <option value="Shop Drop-off">Shop Drop-off</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Uploading & Submitting..." : "Submit Service"}
      </button>
    </form>
  );
}

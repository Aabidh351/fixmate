"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

type Service = {
  _id: string;
  title: string;
  description: string;
  category: string;
  basePrice: number;
  image: string;
  estimatedDuration: string;
  serviceMode: string;
  serviceArea: string;
};

export default function EditServiceForm({
  service,
}: {
  service: Service;
}) {
  const router = useRouter();

  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState(service.image);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5 MB.");
      return;
    }

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);

    setLoading(true);

    try {
      let imageUrl = service.image;

      // Upload a new image only if the technician selected one.
      if (image) {
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
          throw new Error("Image upload failed.");
        }

        imageUrl = imageResult.data.url;
      }

      const { data, error } = await authClient.token();

      if (error || !data?.token) {
        throw new Error("Authentication failed. Please sign in again.");
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/services/${service._id}`,
        {
          method: "PATCH",
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
            estimatedDuration: formData.get("estimatedDuration"),
            serviceMode: formData.get("serviceMode"),
            serviceArea: formData.get("serviceArea"),
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to update service.");
      }

      toast.success("Service updated and submitted for approval.");
      router.push("/dashboard/technician/my-services");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    "Smartphone",
    "Laptop & PC",
    "AC",
    "Refrigerator",
    "TV",
    "Washing Machine",
    "Electrical",
  ];

  const serviceModes = ["Home Visit", "Shop Drop-off"];

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-xl border border-slate-200 bg-white p-6"
    >
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Service Title
        </label>
        <input
          name="title"
          type="text"
          required
          defaultValue={service.title}
          className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Description
        </label>
        <textarea
          name="description"
          rows={4}
          required
          defaultValue={service.description}
          className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Category
          </label>
          <select
            name="category"
            required
            defaultValue={service.category}
            className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
          >
            {!categories.includes(service.category) && (
              <option value={service.category}>{service.category}</option>
            )}

            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Starting Price (USD)
          </label>
          <input
            name="basePrice"
            type="number"
            min="1"
            required
            defaultValue={service.basePrice}
            className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Estimated Duration
          </label>
          <input
            name="estimatedDuration"
            type="text"
            required
            defaultValue={service.estimatedDuration}
            placeholder="e.g. 2-3 hours"
            className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Service Mode
          </label>
          <select
            name="serviceMode"
            required
            defaultValue={service.serviceMode}
            className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
          >
            {!serviceModes.includes(service.serviceMode) && (
              <option value={service.serviceMode}>
                {service.serviceMode}
              </option>
            )}

            {serviceModes.map((mode) => (
              <option key={mode} value={mode}>
                {mode}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Service Area
        </label>
        <input
          name="serviceArea"
          type="text"
          required
          defaultValue={service.serviceArea}
          placeholder="e.g. Chattogram"
          className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Service Image
        </label>

        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full rounded-lg border border-slate-300 p-3 text-sm"
        />

        {preview && (
          <div className="relative mt-4 h-52 w-full overflow-hidden rounded-lg">
            <Image
              src={preview}
              alt="Service preview"
              fill
              unoptimized
              className="object-cover"
            />
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Updating..." : "Save Changes"}
      </button>
    </form>
  );
}
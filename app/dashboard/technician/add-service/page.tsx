
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import AddServiceForm from "@/components/dashboard/AddServiceForm";

export default async function AddServicePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  if (session.user.role !== "technician") {
    redirect("/dashboard");
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">
          Add New Service
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Submit a new repair service for admin approval.
        </p>
      </div>

      <AddServiceForm />
    </div>
  );
}

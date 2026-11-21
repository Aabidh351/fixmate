
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import MyServicesList from "@/components/dashboard/MyServicesList";

type Service = {
  _id: string;
  title: string;
  description: string;
  category: string;
  basePrice: number;
  image: string;
  serviceMode: string;
  approvalStatus: string;
  isAvailable?: boolean;
  createdAt: string;
};

async function getMyServices(): Promise<Service[]> {
  const { token } = await auth.api.getToken({
    headers: await headers(),
  });

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/technician/services`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to load your services.");
  }

  return response.json();
}

export default async function MyServicesPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/sign-in");
  if (session.user.role !== "technician") redirect("/dashboard");

  const services = await getMyServices();

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">
          My Services
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Manage the repair services you have submitted.
        </p>
      </div>

      <MyServicesList services={services} />
    </div>
  );
}

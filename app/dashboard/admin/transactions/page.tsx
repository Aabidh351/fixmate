
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import AdminTransactionsList from "@/components/dashboard/AdminTransactionsList";

export type AdminPayment = {
  _id: string;
  bookingId: string;
  serviceTitle: string;
  customerName: string;
  customerEmail: string;
  technicianName: string;
  technicianEmail: string;
  amount: number;
  currency: string;
  paymentIntentId: string;
  stripeSessionId: string;
  status: string;
  createdAt: string;
};

export default async function AdminTransactionsPage() {
  const requestHeaders = await headers();

  const session = await auth.api.getSession({
    headers: requestHeaders,
  });

  if (!session) redirect("/sign-in");
  if (session.user.role !== "admin") redirect("/dashboard");

  const { token } = await auth.api.getToken({
    headers: requestHeaders,
  });

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/admin/payments`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to load transactions.");
  }

  const payments: AdminPayment[] = await response.json();

  return <AdminTransactionsList payments={payments} />;
}

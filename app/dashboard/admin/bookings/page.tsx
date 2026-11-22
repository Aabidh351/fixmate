
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import AdminBookingsList from "@/components/dashboard/AdminBookingsList";

export type AdminBooking = {
  _id: string;
  serviceTitle: string;
  customerName: string;
  customerEmail: string;
  technicianName: string;
  technicianEmail: string;
  preferredDate: string;
  basePrice: number;
  finalAmount: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
};

export default async function AdminBookingsPage() {
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
    `${process.env.NEXT_PUBLIC_API_URL}/api/admin/bookings`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to load bookings.");
  }

  const bookings: AdminBooking[] = await response.json();

  return <AdminBookingsList bookings={bookings} />;
}

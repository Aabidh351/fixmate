
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import CustomerBookingsList from "@/components/dashboard/CustomerBookingsList";

type Booking = {
  _id: string;
  serviceTitle: string;
  serviceImage?: string;
  category: string;
  basePrice: number;
  finalAmount: number;
  technicianName: string;
  preferredDate: string;
  status: string;
  paymentStatus: string;
  createdAt: string;
};

async function getBookings(): Promise<Booking[]> {
  const tokenResponse = await auth.api.getToken({
    headers: await headers(),
  });

  const token = tokenResponse?.token;

  if (!token) {
    redirect("/sign-in");
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/bookings/my`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch your bookings.");
  }

  return response.json();
}

export default async function CustomerBookingsPage() {
  const bookings = await getBookings();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-secondary">
          My Bookings
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Track and manage your repair requests.
        </p>
      </div>

      <CustomerBookingsList bookings={bookings} />
    </div>
  );
}

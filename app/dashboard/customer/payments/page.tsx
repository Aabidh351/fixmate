
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

type Payment = {
  _id: string;
  bookingId: string;
  serviceTitle: string;
  technicianEmail: string;
  amount: number;
  currency: string;
  status: string;
  createdAt: string;
};

async function getPayments(): Promise<Payment[]> {
  const requestHeaders = await headers();

  const session = await auth.api.getSession({
    headers: requestHeaders,
  });

  if (!session) redirect("/sign-in");
  if (session.user.role !== "customer") redirect("/dashboard");

  const { token } = await auth.api.getToken({
    headers: requestHeaders,
  });

  if (!token) return [];

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/payments/my`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to load payment history.");
  }

  return response.json();
}

export default async function CustomerPaymentsPage() {
  const payments = await getPayments();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">
          Payment History
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          View all your completed transactions.
        </p>
      </div>

      {payments.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-10 text-center">
          <h2 className="text-lg font-semibold text-slate-800">
            No payments yet
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Your completed transactions will appear here.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-5 py-4 font-semibold">Service</th>
                  <th className="px-5 py-4 font-semibold">Technician</th>
                  <th className="px-5 py-4 font-semibold">Amount</th>
                  <th className="px-5 py-4 font-semibold">Date</th>
                  <th className="px-5 py-4 font-semibold">Status</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {payments.map((payment) => (
                  <tr key={payment._id}>
                    <td className="px-5 py-4 font-medium text-slate-800">
                      {payment.serviceTitle}
                    </td>

                    <td className="px-5 py-4 text-slate-600">
                      {payment.technicianEmail}
                    </td>

                    <td className="px-5 py-4 font-medium text-slate-800">
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: payment.currency.toUpperCase(),
                      }).format(payment.amount)}
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 text-slate-600">
                      {new Date(payment.createdAt).toLocaleDateString()}
                    </td>

                    <td className="px-5 py-4">
                      <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                        {payment.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}


import type { AdminPayment } from "@/app/dashboard/admin/transactions/page";

type Props = {
  payments: AdminPayment[];
};

export default function AdminTransactionsList({ payments }: Props) {
  const totalRevenue = payments.reduce(
    (total, payment) => total + payment.amount,
    0
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Transactions
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Monitor all successful customer payments.
        </p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <p className="text-sm font-medium text-slate-500">
          Total Revenue
        </p>
        <h2 className="mt-2 text-3xl font-bold text-slate-900">
          ${totalRevenue.toFixed(2)}
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          From {payments.length} transactions
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="border-b border-slate-200 px-6 py-4">
          <p className="font-semibold text-slate-800">
            All Transactions ({payments.length})
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-6 py-4 font-medium">Service</th>
                <th className="px-6 py-4 font-medium">Customer</th>
                <th className="px-6 py-4 font-medium">Technician</th>
                <th className="px-6 py-4 font-medium">Amount</th>
                <th className="px-6 py-4 font-medium">Transaction ID</th>
                <th className="px-6 py-4 font-medium">Payment Date</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {payments.map((payment) => (
                <tr key={payment._id}>
                  <td className="whitespace-nowrap px-6 py-4 font-medium text-slate-800">
                    {payment.serviceTitle}
                  </td>

                  <td className="px-6 py-4">
                    <p className="font-medium text-slate-800">
                      {payment.customerName}
                    </p>
                    <p className="text-xs text-slate-500">
                      {payment.customerEmail}
                    </p>
                  </td>

                  <td className="px-6 py-4">
                    <p className="font-medium text-slate-800">
                      {payment.technicianName || "—"}
                    </p>
                    <p className="text-xs text-slate-500">
                      {payment.technicianEmail}
                    </p>
                  </td>

                  <td className="whitespace-nowrap px-6 py-4 font-semibold text-slate-800">
                    ${payment.amount.toFixed(2)}
                  </td>

                  <td className="max-w-48 truncate px-6 py-4 text-slate-500">
                    {payment.paymentIntentId || payment.stripeSessionId}
                  </td>

                  <td className="whitespace-nowrap px-6 py-4 text-slate-500">
                    {new Date(payment.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}

              {payments.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-10 text-center text-slate-500"
                  >
                    No transactions found yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

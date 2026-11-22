import Link from "next/link";

export default function PaymentCancelPage() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-xl items-center justify-center px-4">
      <div className="w-full rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto mb-5 flex size-14 items-center justify-center rounded-full bg-amber-100 text-2xl text-amber-600">
          !
        </div>

        <h1 className="text-2xl font-bold text-slate-900">
          Payment Cancelled
        </h1>

        <p className="mt-3 text-sm text-slate-600">
          Your payment was not completed. Your booking is still available for payment.
        </p>

        <Link
          href="/dashboard/customer/bookings"
          className="mt-7 inline-block rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          Back to My Bookings
        </Link>
      </div>
    </div>
  );
}
import PaymentSuccess from "@/components/payment/PaymentSuccess";

type Props = {
  searchParams: Promise<{
    session_id?: string;
  }>;
};

export default async function PaymentSuccessPage({ searchParams }: Props) {
  const { session_id } = await searchParams;

  return <PaymentSuccess sessionId={session_id} />;
}
import { VerifyStatus } from "./_components/verify-status";
import { VerifyTokenForm } from "./_components/verify-token-form";

interface VerifyPageProps {
  searchParams: Promise<{
    token?: string;
  }>;
}

export default async function VerifyEmailPage({
  searchParams,
}: VerifyPageProps) {
  const { token } = await searchParams;

  if (!token) {
    return <VerifyTokenForm />;
  }

  return <VerifyStatus token={token} />;
}

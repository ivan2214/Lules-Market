import { VerifyStatus } from "@/components/auth/verify-status";
import { VerifyTokenForm } from "@/components/auth/verify-token-form";

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

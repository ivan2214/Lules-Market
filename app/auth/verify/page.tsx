import { VerifyStatus } from "@/app/auth/_components/verify-status";
import { VerifyTokenForm } from "@/app/auth/_components/verify-token-form";

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

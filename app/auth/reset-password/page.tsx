import { InvalidTokenState } from "@/components/auth/invalid-token-state";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";

interface ResetPasswordPageProps {
  searchParams: Promise<{
    token?: string;
  }>;
}

export default async function ResetPasswordPage({
  searchParams,
}: ResetPasswordPageProps) {
  const { token } = await searchParams;

  if (!token) {
    return <InvalidTokenState />;
  }

  return <ResetPasswordForm token={token} />;
}

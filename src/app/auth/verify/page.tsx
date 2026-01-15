import { EmailVerificationCard } from "./_components/email-verification-card";

interface VerifyEmailPageProps {
  searchParams: Promise<{
    email?: string;
    status?: "pending" | "verified" | "error" | "expired";
    error?: string;
    token?: string; // Added token from URL for auto-verification
  }>;
}

export default async function VerifyEmailPage({
  searchParams,
}: VerifyEmailPageProps) {
  const params = await searchParams;
  const { email, status = "pending", error, token } = params;

  return (
    <EmailVerificationCard
      initialStatus={status}
      email={email}
      error={error}
      token={token}
    />
  );
}

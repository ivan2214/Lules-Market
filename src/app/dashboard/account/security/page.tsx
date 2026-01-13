import { headers } from "next/headers";
import { redirect } from "next/navigation";
import pathsConfig from "@/config/paths.config";
import { auth } from "@/lib/auth";
import { withAuthenticate } from "@/shared/components/acccess/with-authenticate";
import { AccountSessions } from "@/shared/components/user/account-sessions";
import { TwoFactorContainer } from "@/shared/components/user/two-factor-container";
import { UpdateAccountPasswordForm } from "@/shared/components/user/update-account-password";

async function AccountPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect(pathsConfig.auth.signIn);
  }

  const sessions = await auth.api.listSessions({
    headers: await headers(),
  });

  const response = session;

  return (
    <div className="flex w-full flex-col gap-4">
      <UpdateAccountPasswordForm />
      <AccountSessions sessionId={response.session.id} sessions={sessions} />
      <TwoFactorContainer />
    </div>
  );
}

export default withAuthenticate(AccountPage, {
  role: "user",
  redirect: pathsConfig.auth.signIn,
});

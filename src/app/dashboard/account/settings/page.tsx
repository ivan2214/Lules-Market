import { redirect } from "next/navigation";
import pathsConfig from "@/config/paths.config";
import { requireSession } from "@/orpc/actions/user/require-session";
import { AccountDangerZone } from "@/shared/components/user/account-danger-zone";
import { AccountRoles } from "@/shared/components/user/account-roles";
import { UpdateAccountDetailsForm } from "@/shared/components/user/update-account-details-form";
import { UpdateAccountEmailForm } from "@/shared/components/user/update-account-email-form";

export default async function SettingsPage() {
  const [error, response] = await requireSession();

  if (error || !response) {
    console.log(error);
    redirect(pathsConfig.auth.signIn);
  }

  const user = response.user;

  return (
    <div className="flex w-full flex-col gap-4">
      <UpdateAccountDetailsForm />
      <UpdateAccountEmailForm email={user.email} />
      <AccountRoles roles={user.role?.split(",") ?? []} />
      <AccountDangerZone />
    </div>
  );
}

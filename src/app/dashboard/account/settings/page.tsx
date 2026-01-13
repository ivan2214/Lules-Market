import { AccountDangerZone } from "@/shared/components/user/account-danger-zone";
import { AccountRoles } from "@/shared/components/user/account-roles";
import { UpdateAccountDetailsForm } from "@/shared/components/user/update-account-details-form";
import { UpdateAccountEmailForm } from "@/shared/components/user/update-account-email-form";

export default async function SettingsPage() {
  return (
    <div className="flex w-full flex-col gap-4">
      <UpdateAccountDetailsForm />
      <UpdateAccountEmailForm />
      <AccountRoles />
      <AccountDangerZone />
    </div>
  );
}

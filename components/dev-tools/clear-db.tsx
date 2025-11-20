"use client";
import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import { clearUsersCache } from "./actions";

export const ClearCacheDb = ({
  data,
}: {
  data: {
    users: number;
    sessions: number;
    accounts: number;
    businesses: number;
    admin: number;
    emailVerificationToken: number;
    passwordResetToken: number;
    account: number;
  };
}) => {
  const [isPending, startTransition] = useTransition();

  const handleClearUsers = () => {
    startTransition(() => {
      clearUsersCache().then((res) => {
        if (res?.error) {
          toast.error(res.error);
        } else {
          toast.success("Usuarios borrados");
        }
      });
    });
  };

  return (
    <section className="flex flex-col items-start gap-2 text-xs">
      <div className="flex flex-col items-start gap-2">
        <p>Usuarios: {data.users}</p>
        <p>Sessions: {data.sessions}</p>
        <p>Accounts: {data.accounts}</p>
        <p>Businesses: {data.businesses}</p>
        <p>Admin: {data.admin}</p>
        <p>Email Verification Token: {data.emailVerificationToken}</p>
        <p>Password Reset Token: {data.passwordResetToken}</p>
        <p>Account: {data.account}</p>
      </div>
      <Button onClick={handleClearUsers} disabled={isPending}>
        {isPending ? (
          <>
            <Spinner className="mr-2 h-4 w-4" />
            Borrando...
          </>
        ) : (
          "Borrar usuarios"
        )}
      </Button>
    </section>
  );
};

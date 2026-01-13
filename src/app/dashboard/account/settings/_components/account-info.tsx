"use client";

import { KeyRound } from "lucide-react";
import { Card, CardContent } from "@/shared/components/ui/card";
import { useAuth } from "@/shared/providers/auth-provider";

export const AccountInfo = () => {
  const { user } = useAuth();
  if (!user) {
    throw new Error("User not found");
  }
  return (
    <div>
      <h2 className="mb-4 font-semibold text-xl">Account Info</h2>
      <Card>
        <CardContent className="pt-6">
          <dl className="grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-muted-foreground text-sm">Email</dt>
              <dd className="font-medium">{user.email}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground text-sm">Email Verified</dt>
              <dd className="font-medium">
                {user.emailVerified ? "Yes" : "No"}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground text-sm">Role</dt>
              <dd className="font-medium capitalize">{user.role || "User"}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground text-sm">Two-Factor</dt>
              <dd className="flex items-center gap-2 font-medium">
                <KeyRound className="h-4 w-4" />
                {user.twoFactorEnabled ? "Enabled" : "Disabled"}
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    </div>
  );
};

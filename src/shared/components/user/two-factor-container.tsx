"use client";

import type { session as sessionSchema, user as userSchema } from "@/db/schema";
import { If } from "@/shared/components/if";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";

import { TwoFactorEnableDisable } from "./two-factor-enable-disable";
import { TwoFactorScanQrCode } from "./two-factor-scan-qr-code";

export function TwoFactorContainer({
  session,
}: {
  session: {
    user: typeof userSchema.$inferInsert;
    session: typeof sessionSchema.$inferInsert;
  };
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Multi-Factor Authentication</CardTitle>
        <CardDescription>
          Set up Multi-Factor Authentication method to further secure your
          account
        </CardDescription>
      </CardHeader>
      <CardContent className="flex gap-2">
        <If condition={!!session.user.twoFactorEnabled}>
          <TwoFactorScanQrCode />
        </If>
        <TwoFactorEnableDisable session={session} />
      </CardContent>
    </Card>
  );
}

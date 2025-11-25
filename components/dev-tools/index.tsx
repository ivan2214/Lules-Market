import { cacheTag } from "next/cache";
import { Suspense } from "react";
import prisma from "@/lib/prisma";
import { Skeleton } from "../ui/skeleton";
import { ClearCacheDb } from "./clear-db";

export const DevTools = () => {
  return (
    <div className="absolute bottom-0 left-0 w-[200px] bg-primary/50 p-4">
      <Suspense fallback={<Skeleton className="h-10 w-20" />}>
        <ClearCacheWrapper />
      </Suspense>
    </div>
  );
};

async function ClearCacheWrapper() {
  "use cache";
  cacheTag("dev-tools");
  const users = await prisma.user.count();
  const sessions = await prisma.session.count();
  const accounts = await prisma.account.count();
  const businesses = await prisma.business.count();
  const admin = await prisma.admin.count();
  const emailVerificationToken = await prisma.emailVerificationToken.count();
  const passwordResetToken = await prisma.passwordResetToken.count();
  const account = await prisma.account.count();
  return (
    <ClearCacheDb
      data={{
        users,
        sessions,
        accounts,
        businesses,
        admin,
        emailVerificationToken,
        passwordResetToken,
        account,
      }}
    />
  );
}

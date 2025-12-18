import { count } from "drizzle-orm";
import { cacheTag } from "next/cache";
import { Suspense } from "react";
import { Skeleton } from "@/app/shared/components/ui/skeleton";
import { db, schema } from "@/db";
import { CACHE_TAGS } from "@/lib/cache-tags";
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
  cacheTag(CACHE_TAGS.DEV_TOOLS.GET_ALL);

  const [
    usersResult,
    sessionsResult,
    accountsResult,
    businessesResult,
    adminResult,
    emailVerificationTokenResult,
    passwordResetTokenResult,
  ] = await Promise.all([
    db.select({ count: count() }).from(schema.user),
    db.select({ count: count() }).from(schema.session),
    db.select({ count: count() }).from(schema.account),
    db.select({ count: count() }).from(schema.business),
    db.select({ count: count() }).from(schema.admin),
    db.select({ count: count() }).from(schema.emailVerificationToken),
    db.select({ count: count() }).from(schema.passwordResetToken),
  ]);

  return (
    <ClearCacheDb
      data={{
        users: usersResult[0]?.count ?? 0,
        sessions: sessionsResult[0]?.count ?? 0,
        accounts: accountsResult[0]?.count ?? 0,
        businesses: businessesResult[0]?.count ?? 0,
        admin: adminResult[0]?.count ?? 0,
        emailVerificationToken: emailVerificationTokenResult[0]?.count ?? 0,
        passwordResetToken: passwordResetTokenResult[0]?.count ?? 0,
        account: accountsResult[0]?.count ?? 0,
      }}
    />
  );
}

import { count } from "drizzle-orm";
import { Suspense } from "react";
import { db } from "@/db";
import { account, admin, business, session, user } from "@/db/schema";
import { Skeleton } from "@/shared/components/ui/skeleton";
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
  const [
    usersResult,
    sessionsResult,
    accountsResult,
    businessesResult,
    adminResult,
  ] = await Promise.all([
    db.select({ count: count() }).from(user),
    db.select({ count: count() }).from(session),
    db.select({ count: count() }).from(account),
    db.select({ count: count() }).from(business),
    db.select({ count: count() }).from(admin),
  ]);

  return (
    <ClearCacheDb
      data={{
        users: usersResult[0]?.count ?? 0,
        sessions: sessionsResult[0]?.count ?? 0,
        accounts: accountsResult[0]?.count ?? 0,
        businesses: businessesResult[0]?.count ?? 0,
        admin: adminResult[0]?.count ?? 0,
        account: accountsResult[0]?.count ?? 0,
      }}
    />
  );
}

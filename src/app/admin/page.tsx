import {
  ArrowRight,
  Ban,
  KeyRound,
  Shield,
  UserCog,
  UserPlus,
  Users,
  UserX,
} from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";

export const dynamic = "force-dynamic";
/* revalidar cada 30 minutos */
export const revalidate = 60 * 30;

export default async function AdminPage() {
  const data = await auth.api.listUsers({
    query: {
      limit: 5,
      sortBy: "createdAt",
      sortDirection: "desc",
    },
    headers: await headers(),
  });

  const totalUsers = data.total;
  const recentUsers = data.users;

  const bannedUsers = recentUsers.filter((user) => user.banned).length;

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
      <div>
        <h1 className="font-bold text-3xl tracking-tight">Admin Dashboard</h1>
        <p className="mt-2 text-muted-foreground">
          Manage users, roles, sessions, and system settings.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">{totalUsers}</div>
            <p className="text-muted-foreground text-xs">Registered accounts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">Banned Users</CardTitle>
            <Ban className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">{bannedUsers}</div>
            <p className="text-muted-foreground text-xs">
              Currently restricted
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">
              Recent Signups
            </CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">{recentUsers.length}</div>
            <p className="text-muted-foreground text-xs">Last 5 users</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">Admin Actions</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">8+</div>
            <p className="text-muted-foreground text-xs">Available actions</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common administrative tasks powered by Better Auth Admin plugin.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            <Link href="/admin/users">
              <Button variant="outline" className="w-full justify-start">
                <Users className="mr-2 h-4 w-4" />
                Manage Users
              </Button>
            </Link>
            <Link href="/admin/users">
              <Button variant="outline" className="w-full justify-start">
                <UserPlus className="mr-2 h-4 w-4" />
                Create User
              </Button>
            </Link>
            <Link href="/admin/users">
              <Button variant="outline" className="w-full justify-start">
                <UserCog className="mr-2 h-4 w-4" />
                Manage Roles
              </Button>
            </Link>
            <Link href="/admin/users">
              <Button variant="outline" className="w-full justify-start">
                <UserX className="mr-2 h-4 w-4" />
                Delete User
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Admin Capabilities</CardTitle>
            <CardDescription>
              Features available through the Better Auth Admin plugin.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-muted-foreground text-sm">
              <li className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                List, search, and filter users
              </li>
              <li className="flex items-center gap-2">
                <UserPlus className="h-4 w-4" />
                Create new user accounts
              </li>
              <li className="flex items-center gap-2">
                <UserX className="h-4 w-4" />
                Delete user accounts
              </li>
              <li className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Assign roles and permissions
              </li>
              <li className="flex items-center gap-2">
                <Ban className="h-4 w-4" />
                Ban and unban users
              </li>
              <li className="flex items-center gap-2">
                <KeyRound className="h-4 w-4" />
                Reset user passwords
              </li>
              <li className="flex items-center gap-2">
                <UserCog className="h-4 w-4" />
                Impersonate users for debugging
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Users</CardTitle>
            <CardDescription>
              Latest user registrations in your application.
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href="/admin/users">
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                    {user.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-muted-foreground text-sm">
                      {user.email}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {user.banned && (
                    <span className="rounded-full bg-red-100 px-2 py-1 text-red-700 text-xs dark:bg-red-900 dark:text-red-300">
                      Banned
                    </span>
                  )}
                  {user.emailVerified && (
                    <span className="rounded-full bg-green-100 px-2 py-1 text-green-700 text-xs dark:bg-green-900 dark:text-green-300">
                      Verified
                    </span>
                  )}
                  <span className="rounded-full border px-2 py-1 text-muted-foreground text-xs capitalize">
                    {user.role || "user"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

import {
  ArrowRight,
  KeyRound,
  LayoutDashboard,
  Settings,
  Shield,
  Users,
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import pathsConfig from "@/config/paths.config";
import { getCurrentSession } from "@/data/session/get-current-session";
import { HasRole } from "@/shared/components/acccess/has-role";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";

export default async function HomePage() {
  const { session } = await getCurrentSession();

  if (!session?.user) {
    redirect(pathsConfig.auth.signIn);
  }

  const { user } = session;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-bold text-3xl tracking-tight">
          Welcome back, {user.name}
        </h1>
        <p className="mt-2 text-muted-foreground">
          Here&apos;s an overview of your account and quick actions.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">Preferences</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <CardDescription className="mb-4">
              Update your preferences.
            </CardDescription>
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard/account/preferences">
                Manage Preferences
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">Security</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <CardDescription className="mb-4">
              Password, sessions, and two-factor auth.
            </CardDescription>
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard/account/security">
                Security Settings
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">Settings</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <CardDescription className="mb-4">
              Update your account settings.
            </CardDescription>
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard/account/settings">
                Manage Settings
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <HasRole role="admin">
        <div>
          <h2 className="mb-4 font-semibold text-xl">Admin Quick Actions</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="font-medium text-sm">
                  User Management
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">
                  Manage users, roles, and permissions.
                </CardDescription>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/admin/users">
                    Manage Users
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="font-medium text-sm">
                  Admin Dashboard
                </CardTitle>
                <LayoutDashboard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">
                  Access the full admin dashboard.
                </CardDescription>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/admin">
                    Go to Admin
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </HasRole>

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
                <dt className="text-muted-foreground text-sm">
                  Email Verified
                </dt>
                <dd className="font-medium">
                  {user.emailVerified ? "Yes" : "No"}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground text-sm">Role</dt>
                <dd className="font-medium capitalize">
                  {user.role || "User"}
                </dd>
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
    </div>
  );
}

import {
  ArrowRight,
  LayoutDashboard,
  Settings,
  Shield,
  Users,
} from "lucide-react";
import Link from "next/link";
import { HasRole } from "@/shared/components/acccess/has-role";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { AccountInfo } from "./settings/_components/account-info";

export default async function HomePage() {
  return (
    <div className="space-y-8">
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

      <AccountInfo />
    </div>
  );
}

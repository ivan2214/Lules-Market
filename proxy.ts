import { headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import pathsConfig from "@/config/paths.config";
import { auth } from "@/lib/auth";

export default async function proxy(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Protect dashboard routes
  if (
    request.nextUrl.pathname.startsWith(pathsConfig.dashboard.root) ||
    request.nextUrl.pathname.startsWith(pathsConfig.admin.root)
  ) {
    if (!session) {
      return NextResponse.redirect(
        new URL(pathsConfig.auth.signIn, request.url),
      );
    }
  }

  return NextResponse.next();
}

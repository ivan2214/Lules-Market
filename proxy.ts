import type { Route } from "next";
import { headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import pathsConfig from "@/config/paths.config";
import { auth } from "@/lib/auth";

const protectedAdminRoutes = [pathsConfig.admin.root, pathsConfig.admin.users];

const protectedBusinessRoutes = [
  pathsConfig.dashboard.root,
  pathsConfig.dashboard.products,
  pathsConfig.dashboard.subscription,
];

const protecteSetupRoutes = [pathsConfig.business.setup];

const authRoutes = [
  pathsConfig.auth.forgotPassword,
  pathsConfig.auth.resetPassword,
  pathsConfig.auth.signIn,
  pathsConfig.auth.signUp,
  pathsConfig.auth.twoFactor,
];

export default async function proxy(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const userRole = session?.user?.role;
  const isLoggedIn = !!session;
  const isAdmin = userRole === "ADMIN" && isLoggedIn;
  const isBusiness = userRole === "BUSINESS" && isLoggedIn;
  const isUser = userRole === "USER" && isLoggedIn;

  // a la ruta de admin solo puede entra el admin logueado
  if (
    isAdmin &&
    protectedAdminRoutes.includes(request.nextUrl.pathname as Route)
  ) {
    return NextResponse.redirect(new URL(pathsConfig.admin.root, request.url));
  }

  // si la ruta comienza con algun path de admin y el usuario no es admin lo redirijo al login
  const isAdminRoute = protectedAdminRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route),
  );
  if (isAdminRoute && !isAdmin) {
    return NextResponse.redirect(new URL(pathsConfig.auth.signIn, request.url));
  }

  // si la ruta comienza con algun path de comercio y el usuario no es comercio lo redirijo al login
  const isBusinessRoute = protectedBusinessRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route as Route),
  );
  if (isBusinessRoute && !isBusiness) {
    return NextResponse.redirect(new URL(pathsConfig.auth.signIn, request.url));
  }

  // si la ruta comienza con algun path de setup y el usuario no es usuario lo redirijo al login
  const isSetupRoute = protecteSetupRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route),
  );
  if (isSetupRoute && !isUser) {
    return NextResponse.redirect(new URL(pathsConfig.auth.signIn, request.url));
  }

  // si la ruta comienza con algun path de auth y el usuario esta logueado lo redirijo al dashboard o al admin segun corresponda
  const isAuthRoute = authRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route),
  );
  if (isAuthRoute && isLoggedIn) {
    const redirect = isAdmin
      ? pathsConfig.admin.root
      : pathsConfig.dashboard.root;
    return NextResponse.redirect(new URL(redirect, request.url));
  }

  return NextResponse.next();
}

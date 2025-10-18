"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function getSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return session;
}

export async function requireAuth() {
  const session = await getSession();
  if (!session) {
    redirect("/auth/signin");
  }
  return session;
}

export async function requireBusiness() {
  const session = await requireAuth();

  const business = await prisma.business.findUnique({
    where: { userId: session.user.id },
  });

  if (!business) {
    redirect("/dashboard/setup");
  }

  return { session, business };
}

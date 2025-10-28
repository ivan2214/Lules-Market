"use server";

import { updateTag } from "next/cache";
import { headers } from "next/headers";
import prisma from "@/lib/prisma";

export async function trackProductView(productId: string) {
  try {
    const currentHeaders = await headers();
    const referrer = currentHeaders.get("referer") || undefined;
    await prisma.productView.create({
      data: {
        productId,
        referrer,
      },
    });
  } catch (error) {
    console.error("Error tracking product view:", error);
  } finally {
    updateTag("analytics");
  }
}

export async function trackBusinessView(businessId: string) {
  try {
    const currentHeaders = await headers();
    const referrer = currentHeaders.get("referer") || undefined;
    await prisma.businessView.create({
      data: {
        businessId,
        referrer,
      },
    });
  } catch (error) {
    console.error("Error tracking business view:", error);
  } finally {
    updateTag("analytics");
  }
}

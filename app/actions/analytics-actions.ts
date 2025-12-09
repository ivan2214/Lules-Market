"use server";

import { updateTag } from "next/cache";
import { headers } from "next/headers";
import { db, schema } from "@/db";

export async function trackProductView(productId: string) {
  try {
    const currentHeaders = await headers();
    const referrer = currentHeaders.get("referer") || undefined;
    await db.insert(schema.productView).values({
      productId,
      referrer,
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
    await db.insert(schema.businessView).values({
      businessId,
      referrer,
    });
  } catch (error) {
    console.error("Error tracking business view:", error);
  } finally {
    updateTag("analytics");
  }
}

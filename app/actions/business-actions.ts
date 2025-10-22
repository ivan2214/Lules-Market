"use server";

import { revalidatePath } from "next/cache";
import type { Prisma } from "@/app/generated/prisma";
import prisma from "@/lib/prisma";
import { requireUser } from "../data/user/require-user";

export async function createBusiness(data: {
  name: string;
  description?: string;
  phone?: string;
  whatsapp?: string;
  email?: string;
  website?: string;
  facebook?: string;
  instagram?: string;
  twitter?: string;
  address?: string;
}) {
  const session = await requireUser();

  // Check if user already has a business
  const existingBusiness = await prisma.business.findUnique({
    where: { userId: session.id },
  });

  if (existingBusiness) {
    throw new Error("Ya tienes un negocio registrado");
  }

  const business = await prisma.business.create({
    data: {
      ...data,
      userId: session.id,
    },
  });

  revalidatePath("/dashboard");
  return business;
}

export async function updateBusiness(data: {
  name?: string;
  description?: string;
  logo?: Prisma.ImageCreateInput;
  coverImage?: Prisma.ImageCreateInput;
  phone?: string;
  whatsapp?: string;
  email?: string;
  website?: string;
  facebook?: string;
  instagram?: string;
  twitter?: string;
  address?: string;
}) {
  const session = await requireUser();

  const business = await prisma.business.findUnique({
    where: { userId: session.id },
  });

  if (!business) {
    throw new Error("No tienes un negocio registrado");
  }

  const { logo, coverImage, ...rest } = data;

  // eliminamos la imagen anterior del comercio
  if (logo) {
    await prisma.image.deleteMany({
      where: { logoBusinessId: business.id },
    });
  }

  // eliminamos la imagen anterior del comercio
  if (coverImage) {
    await prisma.image.deleteMany({
      where: { coverBusinessId: business.id },
    });
  }

  const updated = await prisma.business.update({
    where: { id: business.id },
    data: {
      ...rest,
      logo: logo ? { create: logo } : undefined,
      coverImage: coverImage ? { create: coverImage } : undefined,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/settings");
  return !!updated;
}

export async function getBusiness() {
  const session = await requireUser();

  const business = await prisma.business.findUnique({
    where: { userId: session.id },
    include: {
      logo: true,
      coverImage: true,
      products: {
        orderBy: { createdAt: "desc" },
        include: {
          images: true,
        },
      },
      _count: {
        select: { products: true },
      },
    },
  });

  return business;
}

import "server-only";
import type { Prisma } from "@/app/generated/prisma";
import type { ActionResult } from "@/hooks/use-action";
import prisma from "@/lib/prisma";
import { requireUser } from "../user/require-user";
import {
  type BusinessCreateInput,
  BusinessCreateInputSchema,
  type BusinessDTO,
  type BusinessProductDTO,
  type BusinessUpdateInput,
  BusinessUpdateInputSchema,
} from "./business.dto";
import { canEditBusiness } from "./business.policy";
import { requireBusiness } from "./require-busines";

export class BusinessDAL {
  private constructor(private readonly userId?: string) { }

  static async create() {
    const user = await requireUser();
    await requireBusiness();
    return new BusinessDAL(user.id);
  }

  static async public() {
    return new BusinessDAL();
  }

  async listAllBusinesses({
    search,
    category,
    limit, page
  }: {
    search?: string;
    category?: string;
    page: number;
    limit: number;
  }) {

    const where: Prisma.BusinessWhereInput = {
      planStatus: "ACTIVE" as const,
      products: {
        some: {
          active: true,
        },
      },
      ...(search && {
        OR: [
          { name: { contains: search, mode: "insensitive" as const } },
          { description: { contains: search, mode: "insensitive" as const } },
        ],
      }),
      ...(category && { category }),
    };

    const [businesses, total] = await prisma.$transaction([
      prisma.business.findMany({
        where,
        include: {
          products: {
            where: { active: true },
            take: 4,
            orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
          },
          logo: true,
          _count: {
            select: { products: true },
          },
        },
        orderBy: [
          // Premium businesses first
          {
            plan: "asc" as const,
          },
          { createdAt: "desc" },
        ],
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.business.count({ where }),
    ]);

    return { businesses, total };
  }

  async getBusinessById(businessId: string): Promise<BusinessDTO | null> {
    const business = await prisma.business.findFirst({
      where: {
        id: businessId,
        planStatus: "ACTIVE",
      },
      include: {
        logo: true,
        coverImage: true,
        products: {
          include: {
            images: true,
          },
          where: { active: true },
          orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
        },
      },
    });
    return business;
  }

  async getMyBusiness(): Promise<BusinessDTO> {
    const business = await prisma.business.findUnique({
      where: { userId: this.userId },
      include: {
        logo: true,
        coverImage: true,
        products: {
          include: {
            images: true,
          },
          where: { active: true },
          orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
        },
      },
    });
    if (!business) {
      throw new Error("No tienes un negocio registrado");
    }

    return {
      ...business,
      products: business?.products ?? [],
      logo: business?.logo,
      coverImage: business?.coverImage,
    };
  }

  async createBusiness(data: BusinessCreateInput): Promise<ActionResult> {
    const validated = BusinessCreateInputSchema.safeParse(data);
    if (!validated.success) {
      return {
        errorMessage: validated.error.issues
          .map((i) => `${i.path.join(".")}: ${i.message}`)
          .join(", "),
      };
    }

    const user = await requireUser();

    // Check if user already has a business
    const existing = await prisma.business.findUnique({
      where: { userId: user.id },
    });
    if (existing) return { errorMessage: "Ya tienes un negocio registrado" };

    try {
      const {
        name,
        description,
        phone,
        whatsapp,
        email,
        website,
        facebook,
        instagram,
        twitter,
        address,
        logo,
        coverImage,
      } = data as BusinessCreateInput;

      const created = await prisma.business.create({
        data: {
          name,
          description,
          phone,
          whatsapp,
          email,
          website,
          facebook,
          instagram,
          twitter,
          address,
          user: { connect: { id: user.id } },
          logo: logo ? { create: logo as Prisma.ImageCreateInput } : undefined,
          coverImage: coverImage
            ? { create: coverImage as Prisma.ImageCreateInput }
            : undefined,
        },
      });

      return {
        successMessage: "Negocio creado exitosamente",
        data: created,
      };
    } catch (error) {
      return {
        errorMessage:
          error instanceof Error ? error.message : "Error al crear negocio",
      };
    }
  }

  async updateBusiness(data: BusinessUpdateInput): Promise<ActionResult> {
    const validated = BusinessUpdateInputSchema.safeParse(data);
    if (!validated.success) {
      return {
        errorMessage: validated.error.issues
          .map((i) => `${i.path.join(".")}: ${i.message}`)
          .join(", "),
      };
    }

    const user = await requireUser();
    const business = await prisma.business.findUnique({
      where: { userId: user.id },
    });
    if (!business) return { errorMessage: "No tienes un negocio registrado" };

    if (!canEditBusiness(user, { id: business.id, userId: business.userId })) {
      return { errorMessage: "No tienes permisos para editar este negocio" };
    }

    const { logo, coverImage, ...rest } = data as BusinessUpdateInput;

    try {
      // eliminar logo previo si está siendo reemplazado
      if (logo) {
        await prisma.image.deleteMany({
          where: { logoBusinessId: business.id },
        });
      }
      if (coverImage) {
        await prisma.image.deleteMany({
          where: { coverBusinessId: business.id },
        });
      }

      const updated = await prisma.business.update({
        where: { id: business.id },
        data: {
          ...rest,
          logo: logo ? { create: logo as Prisma.ImageCreateInput } : undefined,
          coverImage: coverImage
            ? { create: coverImage as Prisma.ImageCreateInput }
            : undefined,
        },
      });

      return {
        successMessage: "Negocio actualizado exitosamente",
        data: updated,
      };
    } catch (error) {
      return {
        errorMessage:
          error instanceof Error
            ? error.message
            : "Error al actualizar negocio",
      };
    }
  }

  async getBusinessProducts({
    limit,
    offset,
  }: {
    limit: number;
    offset: number;
  }): Promise<BusinessProductDTO[]> {
    const products = await prisma.product.findMany({
      where: { business: { userId: this.userId } },
      take: limit,
      skip: offset,
      orderBy: { createdAt: "desc" },
      include: {
        images: true,
      },
    });

    return products;
  }
}

// prisma/seed.ts
import { faker } from "@faker-js/faker";
import { auth } from "@/lib/auth";
import {
  Permission,
  type PlanType,
  type Prisma,
  PrismaClient,
} from "../app/generated/prisma";

const prisma = new PrismaClient();

async function main() {
  console.log("🧹Deleting existing data...");
  await prisma.$transaction([
    prisma.subCategory.deleteMany(),
    prisma.category.deleteMany(),
    prisma.plan.deleteMany(),
    prisma.admin.deleteMany(),
    prisma.user.deleteMany(),
    prisma.business.deleteMany(),
    prisma.product.deleteMany(),
    prisma.image.deleteMany(),
  ]);

  console.log("🌱 Starting enhanced seed...");

  // --- PLANES ---
  const count = await prisma.plan.count();
  if (count === 0) {
    await prisma.plan.createMany({
      data: [
        {
          type: "FREE",
          name: "Plan Gratuito",
          description: "Perfecto para comenzar tu negocio online",
          price: 0,
          features: [
            "Hasta 10 productos",
            "3 imágenes por producto",
            "Catálogo básico",
            "Soporte por email",
          ],
          maxProducts: 10,
          maxImages: 3,
          isActive: true,
          createdAt: new Date("2023-12-01"),
        },
        {
          type: "BASIC",
          name: "Plan Básico",
          description: "Para negocios en crecimiento",
          price: 14999,
          features: [
            "Hasta 50 productos",
            "10 imágenes por producto",
            "Catálogo personalizado",
            "Estadísticas básicas",
            "Soporte prioritario",
          ],
          maxProducts: 50,
          maxImages: 10,
          isActive: true,
          createdAt: new Date("2023-12-01"),
        },
        {
          type: "PREMIUM",
          name: "Plan Premium",
          description: "Para negocios profesionales",
          price: 29999,
          features: [
            "Productos ilimitados",
            "Imágenes ilimitadas",
            "Catálogo premium",
            "Estadísticas avanzadas",
            "Soporte 24/7",
            "Dominio personalizado",
            "Sin comisiones",
          ],
          maxProducts: -1,
          maxImages: -1,
          isActive: true,
          createdAt: new Date("2023-12-01"),
        },
      ],
    });
  }

  // --- CATEGORÍAS Y SUBCATEGORÍAS (batch) ---
  const existingCategories = await prisma.category.count();
  if (existingCategories === 0) {
    console.log("🗂 Creando categorías y subcategorías...");

    const categoryData = [
      {
        value: "supermercado",
        label: "Supermercado",
        subcategories: [
          "Lácteos",
          "Bebidas",
          "Limpieza",
          "Almacén",
          "Congelados",
        ],
      },
      {
        value: "tecnologia",
        label: "Tecnología",
        subcategories: ["Celulares", "Notebooks", "Accesorios", "Gaming", "TV"],
      },
      {
        value: "indumentaria",
        label: "Indumentaria",
        subcategories: ["Hombre", "Mujer", "Calzado", "Deportes", "Niños"],
      },
      {
        value: "belleza_salud",
        label: "Belleza y Salud",
        subcategories: [
          "Cosméticos",
          "Perfumería",
          "Farmacia",
          "Cuidado Capilar",
        ],
      },
      {
        value: "mascotas",
        label: "Mascotas",
        subcategories: ["Alimentos", "Accesorios", "Veterinarias"],
      },
    ];

    // Crear todas las categorías con sus subcategorías en una sola transacción
    await prisma.$transaction(
      categoryData.map((cat) =>
        prisma.category.create({
          data: {
            value: cat.value,
            label: cat.label,
            subCategories: {
              create: cat.subcategories.map((s) => ({
                value: s.toLowerCase().replace(/\s+/g, "_"),
                label: s,
              })),
            },
          },
        }),
      ),
    );
    console.log(`✅ Creadas ${categoryData.length} categorías`);
  }

  // --- SUPER ADMIN ---
  const { user: superAdmin } = await auth.api.signUpEmail({
    body: {
      name: "Super Admin",
      email: "superadmin@gmail.com",
      password: "test2214",
      image: faker.image.avatar(),
    },
  });

  await prisma.$transaction([
    prisma.admin.create({
      data: {
        userId: superAdmin.id,
        permissions: ["ALL"],
      },
    }),
    prisma.user.update({
      where: { id: superAdmin.id },
      data: { userRole: "ADMIN" },
    }),
  ]);

  // --- ADMINS (batch creation) ---
  const permissions = [
    Permission.ALL,
    Permission.BAN_USERS,
    Permission.MANAGE_COUPONS,
    Permission.MANAGE_PAYMENTS,
    Permission.MODERATE_CONTENT,
    Permission.VIEW_ANALYTIICS,
  ];
  const adminsToCreate = faker.number.int({ min: 1, max: 5 });

  const adminUsers = [];
  for (let i = 0; i < adminsToCreate; i++) {
    const { user: userAdmin } = await auth.api.signUpEmail({
      body: {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: "test2214",
        image: faker.image.avatar(),
      },
    });
    adminUsers.push({
      userId: userAdmin.id,
      permissions: faker.helpers.arrayElements(permissions),
      createdAt: faker.date.recent({ days: 31 * 3 }),
    });
  }

  // Crear todos los admins en batch
  await prisma.$transaction([
    ...adminUsers.map((admin) =>
      prisma.admin.create({
        data: {
          userId: admin.userId,
          permissions: admin.permissions.includes("ALL")
            ? ["ALL"]
            : admin.permissions,
        },
      }),
    ),
    ...adminUsers.map((admin) =>
      prisma.user.update({
        where: { id: admin.userId },
        data: { userRole: "ADMIN", createdAt: admin.createdAt },
      }),
    ),
  ]);

  const admins = await prisma.admin.findMany();
  const plans = await prisma.plan.findMany();
  const categories = await prisma.category.findMany({
    include: { subCategories: true },
  });

  // --- BUSINESSES (optimizado con menos queries) ---
  for (let i = 0; i < 15; i++) {
    const { user } = await auth.api.signUpEmail({
      body: {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: "test2214",
        image: faker.image.avatar(),
      },
    });

    const { type: plan } = faker.helpers.arrayElement(plans);
    const status = faker.helpers.arrayElement([
      "ACTIVE",
      "EXPIRED",
      "INACTIVE",
      "CANCELLED",
    ]);
    const isActive = status === "ACTIVE";

    // ✅ Seleccionar categorías aleatorias (1 a 3)
    const randomCategories = faker.helpers.arrayElements(
      categories,
      faker.number.int({ min: 1, max: 3 }),
    );

    // ✅ Obtener subcategorías SOLO de las categorías seleccionadas
    const availableSubCategories = randomCategories.flatMap(
      (cat) => cat.subCategories,
    );

    // ✅ Seleccionar subcategorías aleatorias (0 a 6) de las disponibles
    const randomSubCategories =
      availableSubCategories.length > 0
        ? faker.helpers.arrayElements(
            availableSubCategories,
            faker.number.int({
              min: 0,
              max: Math.min(6, availableSubCategories.length),
            }),
          )
        : [];

    // Actualizar usuario y crear business en una transacción
    const business = await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: user.id },
        data: {
          userRole: "BUSINESS",
          createdAt: faker.date.recent({ days: 31 * 3 }),
        },
      });

      return await tx.business.create({
        data: {
          name: user.name,
          description: faker.company.catchPhrase(),
          phone: faker.phone.number(),
          whatsapp: faker.phone.number(),
          email: user.email,
          website: faker.internet.url(),
          facebook: faker.internet.url(),
          instagram: faker.internet.url(),
          address: faker.location.streetAddress(),
          categories: {
            connect: randomCategories.map((category) => ({
              id: category.id,
            })),
          },
          subCategories: {
            connect: randomSubCategories.map((subCat) => ({
              id: subCat.id,
            })),
          },
          plan,
          planStatus: status,
          isActive,
          planExpiresAt:
            status === "EXPIRED"
              ? faker.date.past({ years: 0.3 })
              : faker.date.soon({ days: 60 }),
          userId: user.id,
          createdAt: faker.date.recent({ days: 31 * 3 }),
        },
      });
    });

    // Ban business si aplica
    if (faker.datatype.boolean() && !isActive) {
      const adminUser = faker.helpers.arrayElement(admins);
      await prisma.$transaction([
        prisma.bannedBusiness.create({
          data: {
            bannedById: adminUser.userId,
            businessId: business.id,
          },
        }),
        prisma.business.update({
          where: { id: business.id },
          data: { isBanned: true },
        }),
      ]);
    }

    // --- IMÁGENES: Logo y Cover (batch) ---
    const isReportedLogo = faker.datatype.boolean();
    const isBannedLogo = isReportedLogo && faker.datatype.boolean();
    const isReportedCover = faker.datatype.boolean();
    const isBannedCover = isReportedCover && faker.datatype.boolean();

    await prisma.image.createMany({
      data: [
        {
          key: faker.string.uuid(),
          url: faker.image.urlPicsumPhotos({ width: 300, height: 300 }),
          isMainImage: true,
          logoBusinessId: business.id,
          size: faker.number.float({ min: 50, max: 250 }),
          isReported: isReportedLogo,
          isBanned: isBannedLogo,
        },
        {
          key: faker.string.uuid(),
          url: faker.image.urlPicsumPhotos({ width: 1200, height: 400 }),
          isMainImage: false,
          coverBusinessId: business.id,
          size: faker.number.float({ min: 400, max: 2000 }),
          isReported: isReportedCover,
          isBanned: isBannedCover,
        },
      ],
    });

    // --- PRODUCTOS (batch operations) ---
    const productCount = faker.number.int({ min: 3, max: 10 });
    const productsData: Prisma.ProductUncheckedCreateInput[] = [];
    const allProductImages: Prisma.ImageUncheckedCreateInput[] = [];
    const allProductViews: Prisma.productViewUncheckedCreateInput[] = [];

    for (let j = 0; j < productCount; j++) {
      const active = faker.datatype.boolean({ probability: 0.85 });

      // ✅ Categorías del producto (1 a 2) de las del negocio
      const productCategories = faker.helpers.arrayElements(
        randomCategories,
        faker.number.int({ min: 1, max: Math.min(2, randomCategories.length) }),
      );

      // ✅ Subcategorías del producto de las categorías seleccionadas
      const productAvailableSubCategories = productCategories.flatMap(
        (cat) => cat.subCategories,
      );

      const productSubCategories =
        productAvailableSubCategories.length > 0
          ? faker.helpers.arrayElements(
              productAvailableSubCategories,
              faker.number.int({
                min: 0,
                max: Math.min(3, productAvailableSubCategories.length),
              }),
            )
          : [];

      const productId = faker.string.uuid();
      productsData.push({
        id: productId,
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: parseFloat(faker.commerce.price({ min: 100, max: 20000 })),
        featured: plan === "PREMIUM" && faker.datatype.boolean(),
        businessId: business.id,
        active,
        categories: {
          connect: productCategories.map((category) => ({ id: category.id })),
        },
        subCategories: {
          connect: productSubCategories.map((subCat) => ({ id: subCat.id })),
        },
      });

      // Preparar imágenes del producto
      const imageCount = faker.number.int({ min: 1, max: 4 });
      for (let k = 0; k < imageCount; k++) {
        const isReported = faker.datatype.boolean();
        const isBanned = isReported && faker.datatype.boolean();
        allProductImages.push({
          key: faker.string.uuid(),
          url: faker.image.urlPicsumPhotos({ width: 800, height: 600 }),
          isMainImage: k === 0,
          productId: productsData[productsData.length - 1].id,
          size: faker.number.float({ min: 100, max: 1800 }),
          isReported,
          isBanned,
        });
      }

      // Preparar vistas del producto
      const views = faker.number.int({ min: 5, max: 30 });
      for (let v = 0; v < views; v++) {
        allProductViews.push({
          productId: productId,
          referrer: faker.internet.url(),
          createdAt: faker.date.between({
            from: faker.date.past({ years: 0.5 }),
            to: new Date(),
          }),
        });
      }
    }

    // Crear productos con sus relaciones en batch
    await prisma.$transaction(async (tx) => {
      // Crear productos
      for (const prod of productsData) {
        await tx.product.create({
          data: {
            id: prod.id,
            name: prod.name,
            description: prod.description,
            price: prod.price,
            featured: prod.featured,
            businessId: prod.businessId,
            active: prod.active,
            categories: prod.categories,
            subCategories: prod.subCategories,
          },
        });
      }

      // Ban algunos productos si aplica
      const productsToBan = productsData.filter(
        () =>
          faker.datatype.boolean() && faker.number.int({ min: 1, max: 10 }) > 9,
      );

      if (productsToBan.length > 0) {
        const adminUser = faker.helpers.arrayElement(admins);
        await tx.bannedProduct.createMany({
          data: productsToBan.map((p) => ({
            bannedById: adminUser.userId,
            productId: p.id as string,
          })),
        });

        await Promise.all(
          productsToBan.map((p) =>
            tx.product.update({
              where: { id: p.id },
              data: { isBanned: true },
            }),
          ),
        );
      }

      // Crear imágenes en batch
      if (allProductImages.length > 0) {
        await tx.image.createMany({ data: allProductImages });
      }

      // Crear vistas en batch
      if (allProductViews.length > 0) {
        await tx.productView.createMany({ data: allProductViews });
      }
    });

    // --- PAYMENTS (batch) ---
    const paymentsCount = faker.number.int({ min: 1, max: 20 });
    const paymentsData = [];
    let hasApprovedPayment = false;

    for (let p = 0; p < paymentsCount; p++) {
      const status = faker.helpers.arrayElement([
        "pending",
        "approved",
        "rejected",
      ]);
      const paymentPlan: PlanType = faker.helpers.arrayElement([
        "FREE",
        "BASIC",
        "PREMIUM",
      ]);

      if (status === "approved") hasApprovedPayment = true;

      paymentsData.push({
        amount: faker.number.float({ min: 1000, max: 15000 }),
        currency: "ARS",
        status,
        paymentMethod: faker.helpers.arrayElement(["card", "pix", "transfer"]),
        plan: paymentPlan,
        businessId: business.id,
        mpPaymentId: faker.string.uuid(),
        mpStatus: status === "approved" ? "approved" : "rejected",
        createdAt: faker.date.recent({
          days: faker.number.int({ min: 14, max: 365 }),
        }),
      });
    }

    await prisma.payment.createMany({ data: paymentsData });

    // --- TRIAL ---
    if (!hasApprovedPayment && faker.datatype.boolean()) {
      const isActive = faker.datatype.boolean();
      const expiresAt = isActive
        ? faker.date.soon({ days: 10 })
        : faker.date.recent({ days: 31 * 6 });

      await prisma.trial.create({
        data: {
          businessId: business.id,
          plan: "PREMIUM",
          expiresAt,
          isActive,
        },
      });
    }

    // --- COUPONS & REDEMPTIONS (batch) ---
    const couponsCount = faker.number.int({ min: 1, max: 3 });
    const allRedemptions = [];

    for (let c = 0; c < couponsCount; c++) {
      const maxUses = faker.number.int({ min: 1, max: 10 });
      const usedCount = faker.number.int({ min: 0, max: maxUses });
      const expiresAt = faker.helpers.maybe(
        () => faker.date.soon({ days: 90 }),
        {
          probability: 0.7,
        },
      );

      const coupon = await prisma.coupon.create({
        data: {
          code: faker.string.alphanumeric({ length: 8 }).toUpperCase(),
          plan: "PREMIUM",
          durationDays: faker.helpers.arrayElement([15, 30, 45]),
          maxUses,
          usedCount,
          expiresAt,
          active: usedCount < (maxUses || 10),
        },
      });

      const redemptions = faker.number.int({ min: 0, max: usedCount });
      for (let r = 0; r < redemptions; r++) {
        allRedemptions.push({
          couponId: coupon.id,
          businessId: business.id,
          redeemedAt: faker.date.recent({ days: 120 }),
        });
      }
    }

    if (allRedemptions.length > 0) {
      await prisma.couponRedemption.createMany({ data: allRedemptions });
    }

    // --- BUSINESS VIEWS (batch) ---
    const businessViews = faker.number.int({ min: 3, max: 25 });
    const businessViewsData = [];

    for (let v = 0; v < businessViews; v++) {
      businessViewsData.push({
        businessId: business.id,
        referrer: faker.internet.url(),
        createdAt: faker.date.between({
          from: faker.date.past({ years: 0.5 }),
          to: new Date(),
        }),
      });
    }

    await prisma.businessView.createMany({ data: businessViewsData });

    // --- ANALYTICS ---
    const date = faker.date.recent({ days: 90 });
    await prisma.analytics.upsert({
      where: { date },
      update: {
        totalPayments: { increment: paymentsCount },
        totalTrials: { increment: 1 },
        activeTrials: { increment: 1 },
        totalRedemptions: { increment: 1 },
        totalRevenue: {
          increment: faker.number.float({ min: 1000, max: 10000 }),
        },
      },
      create: {
        date,
        totalPayments: paymentsCount,
        totalTrials: 1,
        activeTrials: 1,
        totalRedemptions: 1,
        totalRevenue: faker.number.float({ min: 1000, max: 10000 }),
      },
    });
  }

  // --- ASIGNAR IMÁGENES DESTACADAS (optimizado) ---
  console.log("🏁 Asignando imágenes destacadas...");

  const allCategories = await prisma.category.findMany({
    include: {
      products: {
        include: {
          productView: true,
          images: { where: { isMainImage: true } },
        },
      },
      subCategories: {
        include: {
          products: {
            include: {
              productView: true,
              images: { where: { isMainImage: true } },
            },
          },
        },
      },
    },
  });

  const imageUpdates = [];

  for (const category of allCategories) {
    // Imagen destacada de categoría
    let bestCategoryProduct = null;
    let bestCategoryViews = -1;

    for (const product of category.products) {
      const views = product.productView.length;
      if (views > bestCategoryViews && product.images.length > 0) {
        bestCategoryProduct = product;
        bestCategoryViews = views;
      }
    }

    if (bestCategoryProduct?.images?.[0]) {
      imageUpdates.push({
        key: bestCategoryProduct.images[0].key,
        categoryId: category.id,
        subCategoryId: null,
      });
    }

    // Imágenes destacadas de subcategorías
    for (const sub of category.subCategories) {
      let bestSubProduct = null;
      let bestSubViews = -1;

      for (const product of sub.products) {
        const views = product.productView.length;
        if (views > bestSubViews && product.images.length > 0) {
          bestSubProduct = product;
          bestSubViews = views;
        }
      }

      if (bestSubProduct?.images?.[0]) {
        imageUpdates.push({
          key: bestSubProduct.images[0].key,
          categoryId: null,
          subCategoryId: sub.id,
        });
      }
    }
  }

  // Aplicar todas las actualizaciones de imágenes en batch
  if (imageUpdates.length > 0) {
    await prisma.$transaction(
      imageUpdates.map((update) =>
        prisma.image.update({
          where: { key: update.key },
          data: {
            categoryId: update.categoryId,
            subCategoryId: update.subCategoryId,
          },
        }),
      ),
    );
    console.log(`📸 Asignadas ${imageUpdates.length} imágenes destacadas`);
  }

  console.log("✅ Enhanced seed completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

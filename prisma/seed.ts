// seed.ts (versión ampliada)
// Contraseña fija: test2214
// Datos realistas en español
// Agrega planes, pagos en todos los estados, webhooks, notificaciones, reviews de negocios y escenarios.

import { faker } from "@faker-js/faker";
import { addDays, addMonths, subMonths } from "date-fns";
import { auth } from "@/lib/auth";
import {
  type Business,
  type CurrentPlan,
  Permission,
  type Plan,
  PlanStatus,
  PlanType,
  type Prisma,
  PrismaClient,
  type Product,
  ProductCondition,
} from "../app/generated/prisma";

const prisma = new PrismaClient();

interface CurrentPlanSeed extends CurrentPlan {
  plan: Plan;
}

interface BusinessSeed extends Business {
  currentPlan: CurrentPlanSeed;
}

async function crearUsuario(name: string, email: string, password: string) {
  const { user } = await auth.api.signUpEmail({
    body: { name, email, password },
  });
  return user;
}

function randomFrom<T>(arr: T[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomBrandName() {
  const brands = [
    "Acme Corp",
    "Globex",
    "Initech",
    "Umbrella",
    "Soylent",
    "Hooli",
    "Vehement Capital Partners",
    "Stark Industries",
    "Wayne Enterprises",
    "Wonka Industries",
  ];
  return randomFrom(brands);
}

const pickPlanForBusiness = async (): Promise<{
  plan: Plan;
  planStatus: PlanStatus;
  expiresAt: Date;
}> => {
  const roll = Math.random();
  if (roll < 0.55) {
    // mayoría FREE
    return {
      plan: (await prisma.plan.findUnique({
        where: { type: PlanType.FREE },
      })) as Plan,
      planStatus: PlanStatus.ACTIVE,
      expiresAt: addMonths(new Date(), faker.number.int({ min: 1, max: 6 })),
    };
  } else if (roll < 0.85) {
    // básico
    return {
      plan: (await prisma.plan.findUnique({
        where: { type: PlanType.BASIC },
      })) as Plan,
      planStatus: PlanStatus.ACTIVE,
      expiresAt: addMonths(new Date(), faker.number.int({ min: 1, max: 6 })),
    };
  } else {
    // premium
    return {
      plan: (await prisma.plan.findUnique({
        where: { type: PlanType.PREMIUM },
      })) as Plan,
      planStatus: PlanStatus.ACTIVE,
      expiresAt: addMonths(new Date(), faker.number.int({ min: 1, max: 12 })),
    };
  }
};

async function main() {
  console.log("🧹 Eliminando datos anteriores");
  await prisma.$transaction([
    // Webhooks / Notificaciones / Pagos
    prisma.webhookEvent.deleteMany(),
    prisma.notification.deleteMany(),
    prisma.payment.deleteMany(),

    // Trials / Cupones / Analíticas
    prisma.trial.deleteMany(),
    prisma.couponRedemption.deleteMany(),
    prisma.coupon.deleteMany(),
    prisma.analytics.deleteMany(),

    // Vistas
    prisma.businessView.deleteMany(),
    prisma.productView.deleteMany(),

    // Reviews / posts / answers
    prisma.review.deleteMany(),
    prisma.answer.deleteMany(),
    prisma.post.deleteMany(),

    // Imágenes + baneos
    prisma.bannedImages.deleteMany(),
    prisma.image.deleteMany(),

    // Productos + baneos
    prisma.bannedProduct.deleteMany(),
    prisma.product.deleteMany(),

    // Negocios + baneos
    prisma.bannedBusiness.deleteMany(),
    prisma.business.deleteMany(),
    prisma.currentPlan.deleteMany(),

    // Profile / Admin / Users
    prisma.profile.deleteMany(),

    // Primero limpias permisos (enum-relations)
    prisma.admin.updateMany({ data: { permissions: { set: [] } } }),
    prisma.admin.deleteMany(),

    // Auth
    prisma.session.deleteMany(),
    prisma.account.deleteMany(),
    prisma.verification.deleteMany(),

    prisma.user.deleteMany(),

    // Categorías / Planes
    prisma.category.deleteMany(),
    prisma.plan.deleteMany(),
  ]);

  console.log("🌱 Iniciando seed realista...");

  const PASSWORD = "test2214";

  // --- 1) Crear planes (si no existen) ---
  console.log("📑 Upsert de planes (FREE / BASIC / PREMIUM)...");
  const plansData: {
    type: PlanType;
    name: string;
    description: string;
    price: number;
    features: string[];
    maxProducts: number;
    maxImages: number;
    isActive?: boolean;
  }[] = [
    {
      type: PlanType.FREE,
      name: "Gratis",
      description: "Plan gratuito con features limitadas",
      price: 0,
      features: ["Listado básico", "Soporte comunitario"],
      maxProducts: 20,
      maxImages: 10,
      isActive: true,
    },
    {
      type: PlanType.BASIC,
      name: "Básico",
      description: "Plan económico para comercios pequeños",
      price: 2999,
      features: ["Listado destacado", "Estadísticas básicas"],
      maxProducts: 100,
      maxImages: 50,
      isActive: true,
    },
    {
      type: PlanType.PREMIUM,
      name: "Premium",
      description: "Plan completo con features avanzadas",
      price: 9999,
      features: [
        "Productos destacados",
        "Reportes avanzados",
        "Priority Support",
      ],
      maxProducts: 9999,
      maxImages: 9999,
      isActive: true,
    },
  ];

  const createdPlans = [];
  for (const p of plansData) {
    const plan = await prisma.plan.upsert({
      where: { type: p.type },
      update: {
        name: p.name,
        description: p.description,
        price: p.price,
        features: p.features,
        maxProducts: p.maxProducts,
        maxImages: p.maxImages,
        isActive: p.isActive ?? true,
      },
      create: {
        type: p.type,
        name: p.name,
        description: p.description,
        price: p.price,
        features: p.features,
        maxProducts: p.maxProducts,
        maxImages: p.maxImages,
        isActive: p.isActive ?? true,
      },
    });
    createdPlans.push(plan);
  }

  // --- 2) Categorías ---
  console.log("📦 Creando categorías...");
  const categorias = [
    "Electrónica",
    "Ropa y Accesorios",
    "Hogar y Decoración",
    "Mascotas",
    "Deportes y Fitness",
    "Belleza y Cuidado Personal",
    "Juguetería",
    "Librería y Oficina",
  ];

  const createdCategories = [];
  for (const nombre of categorias) {
    const cat = await prisma.category.create({
      data: { label: nombre, value: nombre.toLowerCase() },
    });
    createdCategories.push(cat);
  }

  // --- 3) Usuarios normales ---
  console.log("👤 Creando usuarios normales...");
  for (let i = 0; i < 50; i++) {
    const name = faker.person.fullName();
    const email = faker.internet.email();
    const user = await crearUsuario(name, email, PASSWORD);

    await prisma.profile.create({
      data: {
        userId: user.id,
        name: user.name ?? name,
        address: faker.location.streetAddress(),
        avatar: {
          create: { url: faker.image.avatar(), key: faker.string.uuid() },
        },
        phone: faker.phone.number(),
      },
    });

    await prisma.user.update({
      where: { id: user.id },
      data: { userRole: "USER" },
    });
  }

  // --- 4) Admins ---
  console.log("👑 Creando admins...");

  const adminPermissions = [
    Permission.ALL,
    Permission.BAN_USERS,
    Permission.MANAGE_COUPONS,
    Permission.MANAGE_PAYMENTS,
    Permission.MODERATE_CONTENT,
    Permission.VIEW_ANALYTIICS,
  ];

  for (let i = 0; i < 5; i++) {
    const name = faker.person.fullName();
    const email = faker.internet.email();
    const { id } = await crearUsuario(name, email, PASSWORD);

    await prisma.user.update({
      where: { id },
      data: { userRole: "ADMIN" },
    });
    await prisma.admin.create({
      data: {
        userId: id,
        permissions: faker.helpers.arrayElements(adminPermissions),
      },
    });
  }

  // --- 5) Negocios (asignar planes) ---
  console.log("🏪 Creando negocios y asignando planes...");
  const negocios: BusinessSeed[] = [];
  const usuariosDisponibles = await prisma.user.findMany({
    where: {
      AND: [
        {
          NOT: [
            { userRole: "ADMIN" },
            { userRole: "USER" },
            { userRole: "SUPER_ADMIN" },
          ],
        },
      ],
    },
  });

  if (
    usuariosDisponibles.length > 0 &&
    createdCategories.length > 0 &&
    usuariosDisponibles.length > 10
  ) {
    for (let i = 0; i < 30 && usuariosDisponibles.length > 0; i++) {
      const index = Math.floor(Math.random() * usuariosDisponibles.length);
      const owner = usuariosDisponibles.splice(index, 1)[0];
      const category = faker.helpers.arrayElement(createdCategories);
      const { plan, planStatus, expiresAt } = await pickPlanForBusiness();

      const business = await prisma.business.create({
        data: {
          userId: owner.id,
          name: faker.company.name(),
          description: faker.lorem.sentences(2),
          categoryId: category.id,
          address: faker.location.streetAddress(),
          phone: faker.phone.number(),
          createdAt: faker.datatype.boolean()
            ? faker.date.past({ refDate: new Date(subMonths(new Date(), 1)) })
            : new Date(),
          facebook: faker.internet.url(),
          email: owner.email,
          tags: faker.lorem.words(3).split(" "),
          website: faker.internet.url(),
          whatsapp: faker.phone.number(),
          currentPlan: {
            create: {
              planType: plan.type,
              planStatus,
              expiresAt,
              activatedAt: new Date(),
              isActive: true,
              isTrial: false,
              imagesUsed: faker.number.int({ min: 0, max: plan.maxImages }),
              productsUsed: faker.number.int({ min: 0, max: plan.maxProducts }),
            },
          },
        },
        include: {
          currentPlan: {
            include: {
              plan: true,
            },
          },
        },
      });

      negocios.push(business as BusinessSeed);
    }
  } else {
    const userBusinessesToCreate = faker.number.int({ min: 10, max: 20 });
    for (let i = 0; i < userBusinessesToCreate; i++) {
      const category = faker.helpers.arrayElement(createdCategories);
      const owner = await crearUsuario(
        faker.person.fullName(),
        faker.internet.email(),
        PASSWORD,
      );

      const planPick = await pickPlanForBusiness();
      const business = await prisma.business.create({
        data: {
          userId: owner.id,
          name: faker.company.name(),
          description: faker.lorem.sentences(2),
          categoryId: category.id,
          address: faker.location.streetAddress(),
          phone: faker.phone.number(),
          createdAt: faker.datatype.boolean()
            ? faker.date.past({ refDate: new Date(subMonths(new Date(), 1)) })
            : new Date(),
          facebook: faker.internet.url(),
          email: owner.email,
          tags: faker.lorem.words(3).split(" "),
          website: faker.internet.url(),
          whatsapp: faker.phone.number(),
          currentPlan: {
            create: {
              activatedAt: new Date(),
              planType: planPick.plan.type,
              planStatus: planPick.planStatus,
              expiresAt: planPick.expiresAt,
              isActive: true,
              isTrial: false,
              imagesUsed: faker.number.int({
                min: 0,
                max: planPick.plan.maxImages,
              }),
              productsUsed: faker.number.int({
                min: 0,
                max: planPick.plan.maxProducts,
              }),
            },
          },
        },
        include: {
          currentPlan: {
            include: {
              plan: true,
            },
          },
        },
      });
      negocios.push(business as BusinessSeed);
    }
  }

  // Agregar imágenes a negocios
  console.log("🖼️ Agregando imágenes a negocios...");
  for (const negocio of negocios) {
    await prisma.business.update({
      where: { id: negocio.id },
      data: {
        coverImage: {
          create: { url: faker.image.url(), key: faker.string.uuid() },
        },
        logo: {
          create: { url: faker.image.avatar(), key: faker.string.uuid() },
        },
      },
    });
  }

  // --- 6) Productos e imágenes (y marcar featured si el negocio es PREMIUM) ---
  console.log(
    "🛒 Creando productos e imágenes (marcando featured en PREMIUM)...",
  );
  const productos: Product[] = [];
  for (const negocio of negocios) {
    const cantidad = faker.number.int({
      min: 1,
      max: Math.min(negocio.currentPlan?.plan.maxProducts, 20),
    });
    for (let i = 1; i <= cantidad; i++) {
      const category = faker.helpers.arrayElement(createdCategories);
      const product = await prisma.product.create({
        data: {
          businessId: negocio.id,
          categoryId: category.id,
          name: faker.commerce.productName(),
          description: faker.commerce.productDescription(),
          price: parseFloat(faker.commerce.price()),
          stock: faker.number.int({ min: 0, max: 150 }),
          createdAt: faker.datatype.boolean()
            ? faker.date.past({ refDate: new Date(subMonths(new Date(), 1)) })
            : new Date(),
          featured: negocio.currentPlan?.planType === PlanType.PREMIUM,
          brand: getRandomBrandName(),
          condition: faker.helpers.arrayElement([
            ProductCondition.NEW,
            ProductCondition.USED,
            ProductCondition.REFURBISHED,
          ]),
          tags: faker.lorem.words(3).split(" "),
          active: faker.datatype.boolean(),
          model: faker.vehicle.model(),

        },
      });

      productos.push(product);

      const imgCount = faker.number.int({
        min: 1,
        max: Math.min(negocio.currentPlan?.plan.maxImages, 5),
      });
      const imagenes: Prisma.ImageCreateManyProductInput[] = Array.from(
        { length: imgCount },
        (_, idx) => ({
          productId: product.id,
          url: faker.image.url(),
          name: faker.word.sample(),
          isMainImage: idx === 0,
          size: faker.number.int({ min: 20000, max: 2000000 }),
          key: faker.string.uuid(),
        }),
      );
      await prisma.image.createMany({ data: imagenes });

      // actualizamos el uso del comercio
      await prisma.business.update({
        where: { id: negocio.id },
        data: {
          currentPlan: {
            update: {
              imagesUsed: {
                set: negocio.currentPlan?.imagesUsed + imgCount,
              },
              productsUsed: {
                set: negocio.currentPlan?.productsUsed + 1,
              },
            },
          },
        },
      });
    }
  }

  // --- 7) Reviews de productos (ya tenías) y reviews de negocios (agregado) ---
  console.log("⭐ Generando reviews de productos y reviews para negocios...");
  const usersProfiles = await prisma.profile.findMany();
  const reviewsData: Prisma.ReviewCreateManyInput[] = Array.from(
    { length: 600 },
    () => ({
      authorId: randomFrom(usersProfiles).userId,
      productId: randomFrom(productos).id,
      rating: faker.number.int({ min: 1, max: 5 }),
      comment: faker.lorem.sentence(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }),
  );
  await prisma.review.createMany({ data: reviewsData });

  // Reviews para negocios
  const businessReviewsData: Prisma.ReviewCreateManyInput[] = Array.from(
    { length: Math.min(400, negocios.length * 8) },
    () => ({
      authorId: randomFrom(usersProfiles).userId,
      businessId: randomFrom(negocios).id,
      rating: faker.number.int({ min: 1, max: 5 }),
      comment: faker.lorem.sentences(faker.number.int({ min: 1, max: 3 })),
      createdAt: faker.date.recent({
        days: 90,
      }),
      updatedAt: faker.date.recent({ days: 30 }),
    }),
  );
  await prisma.review.createMany({ data: businessReviewsData });

  // Recalcular rating promedio para cada negocio (simple promedio)
  console.log("📈 Recalculando ratings promedio para negocios...");
  for (const negocio of negocios) {
    const aggregation = await prisma.review.aggregate({
      where: { businessId: negocio.id },
      _avg: { rating: true },
    });
    // avg redondeado para arriba a 1 decimal
    const rating = aggregation._avg.rating;
    console.log("Rating promedio:", rating);
    const avg = rating ? Math.round(rating * 10) / 10 : 0;
    console.log("Rating promedio redondeado:", avg);

    await prisma.business.update({
      where: { id: negocio.id },
      data: { rating: avg },
    });
  }

  // --- 8) Vistas de productos y negocios ---
  console.log("👁 Registrando vistas de productos y negocios...");
  const productViewsData = Array.from({ length: 1500 }, () => ({
    productId: randomFrom(productos).id,
    referrer: faker.internet.url(),
    createdAt: faker.date.recent({ days: 120 }),
  }));
  await prisma.productView.createMany({ data: productViewsData });

  const businessViewsData = Array.from({ length: 1000 }, () => ({
    businessId: randomFrom(negocios).id,
    referrer: faker.internet.url(),
    createdAt: faker.date.recent({ days: 120 }),
  }));
  await prisma.businessView.createMany({ data: businessViewsData });

  // --- 9) Cupones y canjes (coupon redemptions) ---
  console.log("🎟️ Creando cupones y redemptions...");
  const coupons = await Promise.all(
    Array.from({ length: 15 }, async () =>
      prisma.coupon.create({
        data: {
          code: faker.string.alphanumeric(8).toUpperCase(),
          discountPercent: faker.number.int({ min: 5, max: 40 }),
          expiresAt: faker.date.soon({ days: 180 }),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      }),
    ),
  );

  // Realizar algunos canjes
  const someBusinessesForCoupons = faker.helpers.arrayElements(
    negocios,
    Math.min(10, negocios.length),
  );
  for (const b of someBusinessesForCoupons) {
    const coupon = randomFrom(coupons);
    await prisma.couponRedemption.create({
      data: {
        couponId: coupon.id,
        businessId: b.id,
        redeemedAt: faker.date.recent({ days: 60 }),
      },
    });
    // aumentar contador usedCount en coupon
    await prisma.coupon.update({
      where: { id: coupon.id },
      data: { usedCount: { increment: 1 } },
    });
  }

 

  // --- 11) Pagos: crear pagos para muchas tiendas en distintos estados ---
  console.log(
    "💳 Creando pagos (pending / approved / rejected) y webhooks simulados...",
  );
  const paymentStatuses = ["pending", "approved", "rejected"] as const;
  const mpStatuses = {
    pending: "pending",
    approved: "approved",
    rejected: "rejected",
  };

  const paymentsCreated = [];
  for (const negocio of negocios) {
    // cada negocio tendrá entre 0 y 4 pagos
    const payCount = faker.number.int({ min: 0, max: 4 });
    for (let p = 0; p < payCount; p++) {
      const status = randomFrom([...paymentStatuses]);
      const plan = randomFrom([
        PlanType.BASIC,
        PlanType.PREMIUM,
        PlanType.FREE,
      ]);
      const amount =
        plan === PlanType.FREE ? 0 : plan === PlanType.BASIC ? 2999 : 9999;
      const createdAt = faker.date.recent({ days: 120 });
      const newPayment = await prisma.payment.create({
        data: {
          amount,
          currency: "ARS",
          status,
          paymentMethod: randomFrom(["mercadopago", "card", "cash"]),
          mpPaymentId: faker.string.uuid(),
          mpStatus: mpStatuses[status],
          plan,
          businessId: negocio.id,
          createdAt,
          updatedAt: createdAt,
        },
      });
      paymentsCreated.push(newPayment);

      // Crear WebhookEvent asociado a pagos aprobados/rechazados/pending (simulación)
      await prisma.webhookEvent.create({
        data: {
          requestId: faker.string.uuid(),
          eventType: `payment.${status}`,
          mpId: newPayment.mpPaymentId,
          payload: {
            id: newPayment.mpPaymentId,
            status: newPayment.mpStatus,
            amount: newPayment.amount,
            businessId: negocio.id,
          },
          createdAt,
          processed: faker.datatype.boolean(),
          processedAt: faker.datatype.boolean()
            ? faker.date.recent({ days: 30 })
            : null,
        },
      });

      // Crear notificación al dueño del negocio si pago aprobado o plan expiry
      const owner = await prisma.user.findUnique({
        where: { id: negocio.userId },
      });
      if (owner) {
        if (status === "approved") {
          await prisma.notification.create({
            data: {
              type: "PAYMENT_RECEIVED",
              title: "Pago recibido",
              message: `Se recibió un pago de ${newPayment.amount} ${newPayment.currency}.`,
              userId: owner.id,
              actionUrl: `/business/${negocio.id}/payments/${newPayment.id}`,
              metadata: { paymentId: newPayment.id, businessId: negocio.id },
            },
          });
        } else if (status === "pending") {
          await prisma.notification.create({
            data: {
              type: "PAYMENT_RECEIVED",
              title: "Pago pendiente",
              message: `Hay un pago pendiente de ${newPayment.amount} ${newPayment.currency}.`,
              userId: owner.id,
              actionUrl: `/business/${negocio.id}/payments/${newPayment.id}`,
              metadata: { paymentId: newPayment.id, businessId: negocio.id },
            },
          });
        } else {
          await prisma.notification.create({
            data: {
              type: "PAYMENT_RECEIVED",
              title: "Pago rechazado",
              message: `Un pago de ${newPayment.amount} ${newPayment.currency} fue rechazado.`,
              userId: owner.id,
              actionUrl: `/business/${negocio.id}/payments/${newPayment.id}`,
              metadata: { paymentId: newPayment.id, businessId: negocio.id },
            },
          });
        }
      }
    }
  }

  // --- 12) Generar algunas notificaciones globales y de usuarios ---
  console.log("🔔 Creando notificaciones varias...");
  const someProfiles = usersProfiles.slice(
    0,
    Math.min(30, usersProfiles.length),
  );
  for (const p of someProfiles) {
    await prisma.notification.create({
      data: {
        type: randomFrom([
          "NEW_REVIEW",
          "NEW_QUESTION",
          "PRODUCT_AVAILABLE",
          "PLAN_EXPIRING",
        ]),
        title: faker.lorem.words(3),
        message: faker.lorem.sentence(),
        userId: p.userId,
        actionUrl: "/",
        metadata: { sample: true },
      },
    });
  }

  // --- 13) Escenarios: cancelar algunos planes, expirar otros, promocionar features, ocultar negocios ---
  console.log(
    "⚙️ Aplicando escenarios (cancelar, expirar, banear, destacar productos)...",
  );
  // Cancelar aleatoriamente algunos planes
  for (const negocio of faker.helpers.arrayElements(
    negocios,
    Math.floor(negocios.length * 0.08),
  )) {
    await prisma.business.update({
      where: { id: negocio.id },
      data: {
        currentPlan: {
          update: {
            planStatus: PlanStatus.CANCELLED,
            expiresAt: addDays(new Date(), -1),
          },
        },
      },
    });
    // notificar dueño
    await prisma.notification.create({
      data: {
        type: "PLAN_EXPIRED",
        title: "Plan cancelado",
        message: "Tu plan fue cancelado. Revisa tus métodos de pago.",
        userId: negocio.userId,
        actionUrl: `/business/${negocio.id}/plans`,
        metadata: { businessId: negocio.id },
      },
    });
  }

  // Expirar algunos planes (make EXPIRED)
  for (const negocio of faker.helpers.arrayElements(
    negocios,
    Math.floor(negocios.length * 0.05),
  )) {
    await prisma.business.update({
      where: { id: negocio.id },
      data: {
        currentPlan: {
          update: {
            planStatus: PlanStatus.EXPIRED,
            expiresAt: addDays(new Date(), -10),
          },
        },
      },
    });
  }

  // Banear algunos negocios
  for (const negocio of faker.helpers.arrayElements(
    negocios,
    Math.floor(negocios.length * 0.03),
  )) {
    await prisma.business.update({
      where: { id: negocio.id },
      data: { isBanned: true },
    });
  }

  // Si negocio PREMIUM: garantizar algunos productos featured
  for (const negocio of negocios.filter(
    (b) => b.currentPlan.planType === PlanType.PREMIUM,
  )) {
    const itsProducts = await prisma.product.findMany({
      where: { businessId: negocio.id },
      take: 4,
    });
    for (const prod of itsProducts) {
      await prisma.product.update({
        where: { id: prod.id },
        data: { featured: true },
      });
    }
  }

  // --- 14) Webhooks adicionales (simular eventos no-payments) ---
  console.log("🌐 Creando webhooks de ejemplo (user.created, plan.updated)...");
  const webhookSamples = [
    { eventType: "user.created", payload: { example: true } },
    { eventType: "plan.updated", payload: { example: true } },
    { eventType: "coupon.redeemed", payload: { example: true } },
  ];
  for (const s of webhookSamples) {
    await prisma.webhookEvent.create({
      data: {
        requestId: faker.string.uuid(),
        eventType: s.eventType,
        payload: s.payload,
        mpId: null,
        createdAt: faker.date.recent({ days: 30 }),
        processed: faker.datatype.boolean(),
      },
    });
  }

  // --- 15) Analytics básico: agregar o actualizar entrada para hoy ---
  console.log("📊 Actualizando analytics (entrada diaria)...");
  const today = new Date();
  const dateOnly = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );
  await prisma.analytics.upsert({
    where: { date: dateOnly },
    update: {
      totalTrials: { increment: 2 },
      activeTrials: { increment: 1 },
      totalCoupons: { increment: 1 },
      totalRedemptions: { increment: 1 },
      totalPayments: { increment: paymentsCreated.length },
      totalRevenue: {
        increment: paymentsCreated.reduce((s, p) => s + p.amount, 0),
      },
    },
    create: {
      date: dateOnly,
      totalTrials: 2,
      activeTrials: 1,
      totalCoupons: 1,
      totalRedemptions: 1,
      totalPayments: paymentsCreated.length,
      totalRevenue: paymentsCreated.reduce((s, p) => s + p.amount, 0),
    },
  });

  // --- 16) Posts, answers (ya los tenías) ---
  console.log("📝 Creando posts públicos con imágenes y respuestas...");
  const posts = [];
  for (let i = 0; i < 80; i++) {
    const user = randomFrom(usersProfiles);
    const post = await prisma.post.create({
      data: {
        authorId: user.userId,
        content: faker.lorem.sentences(3),
        createdAt: faker.datatype.boolean()
          ? faker.date.past({ refDate: new Date(subMonths(new Date(), 1)) })
          : new Date(),
      },
    });
    posts.push(post);

    if (faker.datatype.boolean()) {
      const imgCount = faker.number.int({ min: 1, max: 3 });
      const imagenes = Array.from({ length: imgCount }, () => ({
        postId: post.id,
        url: faker.image.url(),
        name: faker.word.sample(),
        size: faker.number.int({ min: 20000, max: 2000000 }),
        key: faker.string.uuid(),
      }));
      await prisma.image.createMany({ data: imagenes });
    }
  }

  // Answers
  const postsConRespuestas = faker.helpers.arrayElements(
    posts,
    Math.floor(posts.length * 0.5),
  );
  for (const post of postsConRespuestas) {
    const cantidadRespuestas = faker.number.int({ min: 1, max: 5 });
    for (let j = 0; j < cantidadRespuestas; j++) {
      const user = randomFrom(usersProfiles);
      await prisma.answer.create({
        data: {
          postId: post.id,
          authorId: user.userId,
          content: faker.lorem.sentences(faker.number.int({ min: 1, max: 3 })),
          isAnon: Math.random() < 0.2,
        },
      });
    }
  }

  // --- 17) Random bans (negocios/productos) ya tenías: lo mantengo con leves ajustes ---
  console.log("🚨 Baneando algunos negocios y productos...");
  for (const negocio of negocios)
    if (Math.random() < 0.1)
      await prisma.business.update({
        where: { id: negocio.id },
        data: { isBanned: true },
      });
  for (const product of productos)
    if (Math.random() < 0.05)
      await prisma.product.update({
        where: { id: product.id },
        data: { isBanned: true },
      });

  console.log("✅ SEED COMPLETADO.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

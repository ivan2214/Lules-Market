/**
 * ===============================================================
 * DRIZZLE SEED - Lules Market
 * ===============================================================
 * Contraseña fija: test2214
 * Datos realistas en español
 * Planes, pagos, webhooks, views, analytics y escenarios
 */

import { faker } from "@faker-js/faker";
import { addDays, addMonths, subMonths } from "date-fns";
import { eq, sql } from "drizzle-orm";

import { db } from "@/db";
import { auth } from "@/lib/auth";
import * as schema from "./schema";

// ===============================================================
// CONSTANTS & TYPES
// ===============================================================

const PASSWORD = "test2214";

const PLAN_STATUS = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
  CANCELLED: "CANCELLED",
  EXPIRED: "EXPIRED",
} as const;

const PLAN_TYPE = {
  FREE: "FREE",
  BASIC: "BASIC",
  PREMIUM: "PREMIUM",
} as const;

const PERMISSIONS = ["ALL", "BAN_USERS", "MANAGE_PLANS"] as const;

type PlanType = (typeof PLAN_TYPE)[keyof typeof PLAN_TYPE];
type PlanStatus = (typeof PLAN_STATUS)[keyof typeof PLAN_STATUS];

interface CreatedPlan {
  type: PlanType;
  name: string;
  maxProducts: number;
  maxImages: number;
}

interface CreatedBusiness {
  id: string;
  userId: string;
  currentPlanId: string;
  planType: PlanType;
  productsUsed: number;
  imagesUsed: number;
  maxProducts: number;
  maxImages: number;
  name: string;
}

interface CreatedProduct {
  id: string;
  businessId: string;
}

interface CreatedPayment {
  id: string;
  amount: number;
}

// ===============================================================
// UTILITY FUNCTIONS
// ===============================================================

function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomBrandName(): string {
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

async function createUser(
  name: string,
  email: string,
  password: string,
): Promise<{ id: string; email: string; name: string }> {
  const { user } = await auth.api.signUpEmail({
    body: { name, email, password },
  });
  return user;
}

function pickPlanForBusiness(): {
  planType: PlanType;
  planStatus: PlanStatus;
  expiresAt: Date;
} {
  const roll = Math.random();
  if (roll < 0.55) {
    // Mayoría FREE
    return {
      planType: PLAN_TYPE.FREE,
      planStatus: PLAN_STATUS.ACTIVE,
      expiresAt: addMonths(new Date(), faker.number.int({ min: 1, max: 6 })),
    };
  }
  if (roll < 0.85) {
    // Básico
    return {
      planType: PLAN_TYPE.BASIC,
      planStatus: PLAN_STATUS.ACTIVE,
      expiresAt: addMonths(new Date(), faker.number.int({ min: 1, max: 6 })),
    };
  }
  // Premium
  return {
    planType: PLAN_TYPE.PREMIUM,
    planStatus: PLAN_STATUS.ACTIVE,
    expiresAt: addMonths(new Date(), faker.number.int({ min: 1, max: 12 })),
  };
}

// ===============================================================
// DELETE FUNCTIONS
// ===============================================================

async function deleteAllData(): Promise<void> {
  console.log("🧹 Eliminando datos anteriores...");

  // 1️⃣ Webhooks / Analytics / Views
  await db.delete(schema.webhookEvent);
  await db.delete(schema.analytics);
  await db.delete(schema.log);

  // 2️⃣ Trials
  await db.delete(schema.trial);

  // 3️⃣ Views
  await db.delete(schema.businessView);
  await db.delete(schema.productView);

  // 4️⃣ Payments
  await db.delete(schema.payment);

  // 5️⃣ Images + banned
  await db.delete(schema.bannedImages);
  await db.delete(schema.image);

  // 6️⃣ Products + banned
  await db.delete(schema.bannedProduct);
  await db.delete(schema.product);

  // 7️⃣ Business + banned + plans
  await db.delete(schema.bannedBusiness);
  await db.delete(schema.currentPlan);
  await db.delete(schema.business);

  // 8️⃣ Profile
  await db.delete(schema.profile);

  // 9️⃣ Admin
  await db.delete(schema.admin);

  // 🔟 Auth
  await db.delete(schema.session);
  await db.delete(schema.account);
  await db.delete(schema.verification);
  await db.delete(schema.emailVerificationToken);
  await db.delete(schema.passwordResetToken);
  await db.delete(schema.user);

  // 1️⃣1️⃣ Categories / Plans
  await db.delete(schema.category);
  await db.delete(schema.plan);

  console.log("✅ Datos eliminados correctamente");
}

// ===============================================================
// SEED PLANS
// ===============================================================

async function seedPlans(): Promise<CreatedPlan[]> {
  console.log("📑 Upsert de planes (FREE / BASIC / PREMIUM)...");

  const plansData = [
    {
      type: PLAN_TYPE.FREE as PlanType,
      name: "Gratis",
      description: "Plan gratuito con features limitadas",
      price: 0,
      features: ["Listado básico", "Soporte comunitario"],
      maxProducts: 20,
      maxImages: 10,
      isActive: true,
      hasStatistics: false,
      canFeatureProducts: false,
    },
    {
      type: PLAN_TYPE.BASIC as PlanType,
      name: "Básico",
      description: "Plan económico para comercios pequeños",
      price: 2999,
      features: ["Listado destacado", "Estadísticas básicas"],
      maxProducts: 100,
      maxImages: 50,
      isActive: true,
      hasStatistics: true,
      canFeatureProducts: false,
    },
    {
      type: PLAN_TYPE.PREMIUM as PlanType,
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
      hasStatistics: true,
      canFeatureProducts: true,
    },
  ];

  const createdPlans: CreatedPlan[] = [];

  for (const p of plansData) {
    // Check if exists
    const existing = await db.query.plan.findFirst({
      where: eq(schema.plan.type, p.type),
    });

    if (existing) {
      await db.update(schema.plan).set(p).where(eq(schema.plan.type, p.type));
    } else {
      await db.insert(schema.plan).values(p);
    }

    createdPlans.push({
      type: p.type,
      name: p.name,
      maxProducts: p.maxProducts,
      maxImages: p.maxImages,
    });
  }

  return createdPlans;
}

// ===============================================================
// SEED CATEGORIES
// ===============================================================

async function seedCategories(): Promise<{ id: string; label: string }[]> {
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

  const createdCategories: { id: string; label: string }[] = [];

  for (const nombre of categorias) {
    const inserted = await db
      .insert(schema.category)
      .values({
        label: nombre,
        value: nombre.toLowerCase(),
      })
      .returning({ id: schema.category.id, label: schema.category.label });

    createdCategories.push(inserted[0]);
  }

  return createdCategories;
}

// ===============================================================
// SEED NORMAL USERS
// ===============================================================

async function seedNormalUsers(count: number = 10): Promise<void> {
  console.log(`👤 Creando ${count} usuarios normales...`);

  for (let i = 0; i < count; i++) {
    console.log(`👤 Creando usuario ${i + 1} de ${count}`);
    const name = faker.person.fullName();
    const email = faker.internet.email();

    try {
      const user = await createUser(name, email, PASSWORD);

      // Create profile with avatar
      const avatarKey = crypto.randomUUID();
      await db.insert(schema.image).values({
        key: avatarKey,
        url: faker.image.avatar(),
        avatarId: user.id,
      });

      await db.insert(schema.profile).values({
        userId: user.id,
        name: user.name ?? name,
        address: faker.location.streetAddress(),
        phone: faker.phone.number(),
      });

      // Update user role
      await db
        .update(schema.user)
        .set({
          userRole: "USER",
          emailVerified: faker.datatype.boolean(),
        })
        .where(eq(schema.user.id, user.id));
    } catch (error) {
      // Skip if user already exists
      console.log(`⚠️ Skipping user ${email}: ${error}`);
    }
  }
}

// ===============================================================
// SEED ADMINS
// ===============================================================

async function seedAdmins(count: number = 3): Promise<void> {
  console.log(`👑 Creando ${count} admins...`);

  for (let i = 0; i < count; i++) {
    console.log(`👑 Creando admin ${i + 1} de ${count}`);
    const name = faker.person.fullName();
    const email = faker.internet.email();

    try {
      const user = await createUser(name, email, PASSWORD);

      await db
        .update(schema.user)
        .set({
          userRole: "ADMIN",
          emailVerified: true,
        })
        .where(eq(schema.user.id, user.id));

      await db.insert(schema.admin).values({
        userId: user.id,
        permissions: faker.helpers.arrayElements([...PERMISSIONS]),
      });
    } catch (error) {
      console.log(`⚠️ Skipping admin ${email}: ${error}`);
    }
  }
}

// ===============================================================
// SEED BUSINESSES
// ===============================================================

async function seedBusinesses(
  categories: { id: string; label: string }[],
  plans: CreatedPlan[],
  count: number = 20,
): Promise<CreatedBusiness[]> {
  console.log(`🏪 Creando ${count} negocios y asignando planes...`);

  const businesses: CreatedBusiness[] = [];

  for (let i = 0; i < count; i++) {
    console.log(`🏪 Creando negocio ${i + 1} de ${count}`);
    const category = faker.helpers.arrayElement(categories);
    const { planType, planStatus, expiresAt } = pickPlanForBusiness();
    const plan = plans.find((p) => p.type === planType);

    if (!plan) continue;

    const name = faker.person.fullName();
    const email = faker.internet.email();

    try {
      const owner = await createUser(name, email, PASSWORD);

      // Create business
      const businessInsert = await db
        .insert(schema.business)
        .values({
          userId: owner.id,
          name: faker.company.name(),
          description: faker.lorem.sentences(2),
          categoryId: category.id,
          address: faker.location.streetAddress(),
          phone: faker.phone.number(),
          createdAt: faker.datatype.boolean()
            ? faker.date.past({ refDate: subMonths(new Date(), 1) })
            : new Date(),
          facebook: faker.internet.url(),
          email: owner.email,
          tags: faker.lorem.words(3).split(" "),
          website: faker.internet.url(),
          whatsapp: faker.phone.number(),
          verified: faker.datatype.boolean(),
          status: "ACTIVE",
        })
        .returning({ id: schema.business.id, name: schema.business.name });

      const { id, name: businessName } = businessInsert[0];

      // Create current plan
      const productsUsed = faker.number.int({ min: 0, max: plan.maxProducts });
      const imagesUsed = faker.number.int({ min: 0, max: plan.maxImages });

      const currentPlanInsert = await db
        .insert(schema.currentPlan)
        .values({
          businessId: id,
          planType,
          planStatus,
          expiresAt,
          activatedAt: new Date(),
          isActive: true,
          isTrial: false,
          imagesUsed,
          productsUsed,
        })
        .returning({ id: schema.currentPlan.id });

      // Update user role to BUSINESS
      await db
        .update(schema.user)
        .set({
          emailVerified: faker.datatype.boolean(),
          userRole: "BUSINESS",
        })
        .where(eq(schema.user.id, owner.id));

      businesses.push({
        id,
        userId: owner.id,
        currentPlanId: currentPlanInsert[0].id,
        planType,
        productsUsed,
        imagesUsed,
        maxProducts: plan.maxProducts,
        maxImages: plan.maxImages,
        name: businessName,
      });
    } catch (error) {
      console.log(`⚠️ Skipping business: ${error}`);
    }
  }

  return businesses;
}

// ===============================================================
// ADD IMAGES TO BUSINESSES
// ===============================================================

async function addBusinessImages(businesses: CreatedBusiness[]): Promise<void> {
  console.log("🖼️ Agregando imágenes a negocios...");

  for (const negocio of businesses) {
    console.log(`🖼️ Agregando imágenes a negocio ${negocio.name}`);

    // Cover image
    await db.insert(schema.image).values({
      key: crypto.randomUUID(),
      url: faker.image.url(),
      coverBusinessId: negocio.id,
    });

    // Logo
    await db.insert(schema.image).values({
      key: crypto.randomUUID(),
      url: faker.image.avatar(),
      logoBusinessId: negocio.id,
    });
  }
}

// ===============================================================
// SEED PRODUCTS
// ===============================================================

async function seedProducts(
  businesses: CreatedBusiness[],
  categories: { id: string; label: string }[],
): Promise<CreatedProduct[]> {
  console.log("🛒 Creando productos e imágenes...");

  const products: CreatedProduct[] = [];

  for (const negocio of businesses) {
    console.log(`🛒 Creando productos para el negocio ${negocio.name}`);
    const productsCount = faker.number.int({
      min: 1,
      max: Math.min(negocio.maxProducts, 20),
    });

    for (let i = 1; i <= productsCount; i++) {
      console.log(`🛒 Creando producto ${i} de ${productsCount}`);
      const category = faker.helpers.arrayElement(categories);

      const productInsert = await db
        .insert(schema.product)
        .values({
          businessId: negocio.id,
          categoryId: category.id,
          name: faker.commerce.productName(),
          description: faker.commerce.productDescription(),
          price: Number.parseFloat(faker.commerce.price()),
          stock: faker.number.int({ min: 0, max: 150 }),
          createdAt: faker.datatype.boolean()
            ? faker.date.past({ refDate: subMonths(new Date(), 1) })
            : new Date(),
          featured: negocio.planType === PLAN_TYPE.PREMIUM,
          brand: getRandomBrandName(),
          tags: faker.lorem.words(3).split(" "),
          active: faker.datatype.boolean(),
        })
        .returning({ id: schema.product.id });

      const productId = productInsert[0].id;
      products.push({ id: productId, businessId: negocio.id });

      // Add product images
      const imgCount = faker.number.int({
        min: 1,
        max: Math.min(negocio.maxImages, 5),
      });

      for (let idx = 0; idx < imgCount; idx++) {
        await db.insert(schema.image).values({
          key: crypto.randomUUID(),
          productId,
          url: faker.image.url(),
          name: faker.word.sample(),
          isMainImage: idx === 0,
          size: faker.number.int({ min: 20000, max: 2000000 }),
        });
      }

      // Update plan usage
      await db
        .update(schema.currentPlan)
        .set({
          imagesUsed: sql`${schema.currentPlan.imagesUsed} + ${imgCount}`,
          productsUsed: sql`${schema.currentPlan.productsUsed} + 1`,
        })
        .where(eq(schema.currentPlan.id, negocio.currentPlanId));
    }
  }

  return products;
}

// ===============================================================
// SEED VIEWS
// ===============================================================

async function seedViews(
  products: CreatedProduct[],
  businesses: CreatedBusiness[],
): Promise<void> {
  console.log("👁 Registrando vistas de productos y negocios...");

  // Product views
  for (let i = 0; i < 200; i++) {
    console.log(`👁 Registrando vista de producto ${i + 1}`);
    const product = randomFrom(products);
    await db.insert(schema.productView).values({
      productId: product.id,
      referrer: faker.internet.url(),
      createdAt: faker.date.recent({ days: 120 }),
    });
  }

  // Business views
  for (let i = 0; i < 150; i++) {
    console.log(`👁 Registrando vista de negocio ${i + 1}`);
    const business = randomFrom(businesses);
    await db.insert(schema.businessView).values({
      businessId: business.id,
      referrer: faker.internet.url(),
      createdAt: faker.date.recent({ days: 120 }),
    });
  }
}

// ===============================================================
// SEED PAYMENTS & WEBHOOKS
// ===============================================================

async function seedPaymentsAndWebhooks(
  businesses: CreatedBusiness[],
): Promise<CreatedPayment[]> {
  console.log(
    "💳 Creando pagos (pending / approved / rejected) y webhooks simulados...",
  );

  const paymentStatuses = ["pending", "approved", "rejected"] as const;
  const mpStatuses = {
    pending: "pending",
    approved: "approved",
    rejected: "rejected",
  };

  const paymentsCreated: CreatedPayment[] = [];

  for (const negocio of businesses) {
    console.log(`💳 Creando pagos para el negocio ${negocio.name}`);
    const payCount = faker.number.int({ min: 0, max: 4 });

    for (let p = 0; p < payCount; p++) {
      console.log(`💳 Creando pago ${p + 1} de ${payCount}`);
      const status = randomFrom([...paymentStatuses]);
      const planType = randomFrom([
        PLAN_TYPE.BASIC,
        PLAN_TYPE.PREMIUM,
        PLAN_TYPE.FREE,
      ]);
      const amount =
        planType === PLAN_TYPE.FREE
          ? 0
          : planType === PLAN_TYPE.BASIC
            ? 2999
            : 9999;
      const createdAt = faker.date.recent({ days: 120 });
      const mpPaymentId = crypto.randomUUID();

      const paymentInsert = await db
        .insert(schema.payment)
        .values({
          amount,
          currency: "ARS",
          status,
          paymentMethod: randomFrom(["mercadopago", "card", "cash"]),
          mpPaymentId,
          mpStatus: mpStatuses[status],
          plan: planType,
          businessId: negocio.id,
          createdAt,
        })
        .returning({ id: schema.payment.id });

      paymentsCreated.push({ id: paymentInsert[0].id, amount });

      // Create webhook event
      await db.insert(schema.webhookEvent).values({
        requestId: crypto.randomUUID(),
        eventType: `payment.${status}`,
        mpId: mpPaymentId,
        payload: {
          id: mpPaymentId,
          status: mpStatuses[status],
          amount,
          businessId: negocio.id,
        },
        createdAt,
        processed: faker.datatype.boolean(),
        processedAt: faker.datatype.boolean()
          ? faker.date.recent({ days: 30 })
          : null,
      });
    }
  }

  return paymentsCreated;
}

// ===============================================================
// SEED SAMPLE WEBHOOKS
// ===============================================================

async function seedSampleWebhooks(): Promise<void> {
  console.log("🌐 Creando webhooks de ejemplo...");

  const webhookSamples = [
    { eventType: "user.created", payload: { example: true } },
    { eventType: "plan.updated", payload: { example: true } },
  ];

  for (const s of webhookSamples) {
    await db.insert(schema.webhookEvent).values({
      requestId: crypto.randomUUID(),
      eventType: s.eventType,
      payload: s.payload,
      mpId: null,
      createdAt: faker.date.recent({ days: 30 }),
      processed: faker.datatype.boolean(),
    });
  }
}

// ===============================================================
// SEED ANALYTICS
// ===============================================================

async function seedAnalytics(payments: CreatedPayment[]): Promise<void> {
  console.log("📊 Actualizando analytics...");

  const today = new Date();
  const dateOnly = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );

  const totalRevenue = payments.reduce((s, p) => s + p.amount, 0);

  // Check if analytics for today exists
  const existing = await db.query.analytics.findFirst({
    where: eq(schema.analytics.date, dateOnly),
  });

  if (existing) {
    await db
      .update(schema.analytics)
      .set({
        totalTrials: sql`${schema.analytics.totalTrials} + 2`,
        activeTrials: sql`${schema.analytics.activeTrials} + 1`,
        totalPayments: sql`${schema.analytics.totalPayments} + ${payments.length}`,
        totalRevenue: sql`${schema.analytics.totalRevenue} + ${totalRevenue}`,
      })
      .where(eq(schema.analytics.id, existing.id));
  } else {
    await db.insert(schema.analytics).values({
      date: dateOnly,
      totalTrials: 2,
      activeTrials: 1,
      totalPayments: payments.length,
      totalRevenue,
    });
  }
}

// ===============================================================
// APPLY SCENARIOS
// ===============================================================

async function applyScenarios(
  businesses: CreatedBusiness[],
  products: CreatedProduct[],
): Promise<void> {
  console.log(
    "⚙️ Aplicando escenarios (cancelar, expirar, banear, destacar productos)...",
  );

  // Cancelar algunos planes (8%)
  const toCancel = faker.helpers.arrayElements(
    businesses,
    Math.floor(businesses.length * 0.08),
  );
  for (const negocio of toCancel) {
    await db
      .update(schema.currentPlan)
      .set({
        planStatus: PLAN_STATUS.CANCELLED,
        expiresAt: addDays(new Date(), -1),
      })
      .where(eq(schema.currentPlan.id, negocio.currentPlanId));
  }

  // Expirar algunos planes (5%)
  const toExpire = faker.helpers.arrayElements(
    businesses,
    Math.floor(businesses.length * 0.05),
  );
  for (const negocio of toExpire) {
    await db
      .update(schema.currentPlan)
      .set({
        planStatus: PLAN_STATUS.EXPIRED,
        expiresAt: addDays(new Date(), -10),
      })
      .where(eq(schema.currentPlan.id, negocio.currentPlanId));
  }

  // Banear algunos negocios (3%)
  const toBan = faker.helpers.arrayElements(
    businesses,
    Math.floor(businesses.length * 0.03),
  );
  for (const negocio of toBan) {
    await db
      .update(schema.business)
      .set({ isBanned: true })
      .where(eq(schema.business.id, negocio.id));
  }

  // Destacar productos de negocios PREMIUM
  const premiumBusinesses = businesses.filter(
    (b) => b.planType === PLAN_TYPE.PREMIUM,
  );
  for (const negocio of premiumBusinesses) {
    const itsProducts = products
      .filter((p) => p.businessId === negocio.id)
      .slice(0, 4);
    for (const prod of itsProducts) {
      await db
        .update(schema.product)
        .set({ featured: true })
        .where(eq(schema.product.id, prod.id));
    }
  }

  // Banear algunos negocios random (10%)
  for (const negocio of businesses) {
    if (Math.random() < 0.1) {
      await db
        .update(schema.business)
        .set({ isBanned: true })
        .where(eq(schema.business.id, negocio.id));
    }
  }

  // Banear algunos productos random (5%)
  for (const product of products) {
    if (Math.random() < 0.05) {
      await db
        .update(schema.product)
        .set({ isBanned: true })
        .where(eq(schema.product.id, product.id));
    }
  }
}

// ===============================================================
// MAIN SEED FUNCTION
// ===============================================================

async function main(): Promise<void> {
  console.log("🌱 Iniciando seed con Drizzle...\n");

  try {
    // 1. Delete all existing data
    await deleteAllData();

    // 2. Create plans
    const plans = await seedPlans();

    // 3. Create categories
    const categories = await seedCategories();

    // 4. Create normal users
    await seedNormalUsers();

    // 5. Create admins
    await seedAdmins();

    // 6. Create businesses with plans
    const businesses = await seedBusinesses(categories, plans);

    // 7. Add images to businesses
    await addBusinessImages(businesses);

    // 8. Create products
    const products = await seedProducts(businesses, categories);

    // 9. Create views
    await seedViews(products, businesses);

    // 10. Create payments and webhooks
    const payments = await seedPaymentsAndWebhooks(businesses);

    // 11. Create sample webhooks
    await seedSampleWebhooks();

    // 12. Update analytics
    await seedAnalytics(payments);

    // 13. Apply scenarios
    await applyScenarios(businesses, products);

    console.log("\n✅ SEED COMPLETADO EXITOSAMENTE.");
  } catch (error) {
    console.error("❌ Error durante el seed:", error);
    throw error;
  }
}

// Run the seed
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    console.log("🔌 Conexión cerrada.");
    process.exit(0);
  });

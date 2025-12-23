/**
 * ===============================================================
 * DRIZZLE SEED - Lules Market (OPTIMIZADO)
 * ===============================================================
 * Contraseña fija: test2214
 * Mejoras: Batch inserts, menos queries, transacciones
 */

import { faker } from "@faker-js/faker";
import { addDays, subMonths } from "date-fns";
import { eq, sql } from "drizzle-orm";
import { db } from "@/db";
import type {
  ImageInsert,
  PaymentInsert,
  Plan,
  PlanInsert,
  ProductInsert,
  WebhookEventInsert,
} from "@/db/types";
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

interface CreatedBusiness {
  id: string;
  userId: string;
  currentPlanId: string;
  planType: PlanType;
  productsUsed: number;
  imagesUsed: number;
  maxProducts: number;
  maxImagesPerProduct: number;
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

async function pickPlanForBusiness(): Promise<{ plan: Plan }> {
  const allPlans = await db.query.plan.findMany();
  return {
    plan: randomFrom(allPlans),
  };
}

// ===============================================================
// DELETE FUNCTIONS
// ===============================================================

async function deleteAllData(): Promise<void> {
  console.log("🧹 Eliminando datos anteriores...");

  await db.delete(schema.webhookEvent);
  await db.delete(schema.analytics);
  await db.delete(schema.log);
  await db.delete(schema.trial);
  await db.delete(schema.businessView);
  await db.delete(schema.productView);
  await db.delete(schema.payment);
  await db.delete(schema.bannedImages);
  await db.delete(schema.image);
  await db.delete(schema.bannedProduct);
  await db.delete(schema.product);
  await db.delete(schema.bannedBusiness);
  await db.delete(schema.currentPlan);
  await db.delete(schema.business);
  await db.delete(schema.profile);
  await db.delete(schema.admin);
  await db.delete(schema.session);
  await db.delete(schema.account);
  await db.delete(schema.verification);
  await db.delete(schema.emailVerificationToken);
  await db.delete(schema.passwordResetToken);
  await db.delete(schema.user);
  await db.delete(schema.category);
  await db.delete(schema.plan);

  console.log("✅ Datos eliminados");
}

// ===============================================================
// SEED PLANS
// ===============================================================

async function seedPlans(): Promise<PlanInsert[]> {
  console.log("🔐 Upsert de planes...");

  const plansData: PlanInsert[] = [
    {
      type: PLAN_TYPE.FREE as PlanType,
      name: "Gratuito",
      description: "Perfecto para probar la plataforma",
      price: 0,
      features: [
        "Hasta 10 productos publicados",
        "1 imagen por producto",
        "Prioridad estándar en listados",
        "Perfil de negocio básico",
      ],
      details: {
        products: "10",
        images: "1 por producto",
        priority: "Estándar",
      },
      maxProducts: 20,
      maxImagesPerProduct: 1,
      popular: false,
      isActive: true,
      hasStatistics: false,

      listPriority: "Estandar",
    },
    {
      type: PLAN_TYPE.BASIC as PlanType,
      name: "Básico",
      description: "Para negocios que quieren destacar",
      price: 5000,
      discount: 0,
      features: [
        "Hasta 50 productos",
        "3 imágenes por producto",
        "Prioridad media en búsquedas",
        "Soporte por email",
      ],
      details: {
        products: "50",
        images: "3 por producto",
        priority: "Media",
      },
      maxProducts: 50,
      maxImagesPerProduct: 3,
      popular: true,
      isActive: true,
      hasStatistics: true,

      listPriority: "Media",
    },
    {
      type: PLAN_TYPE.PREMIUM as PlanType,
      name: "Premium",
      description: "La mejor experiencia para tu marca",
      price: 15000,
      discount: 0,
      features: [
        "Productos ilimitados",
        "5 imágenes por producto",
        "Máxima prioridad (Top listados)",
        "Productos destacados en Home",
        "Soporte prioritario",
      ],
      details: {
        products: "Ilimitados",
        images: "5 por producto",
        priority: "Alta (Top)",
      },
      maxProducts: 9999,
      maxImagesPerProduct: 5,
      popular: false,
      isActive: true,
      hasStatistics: true,

      listPriority: "Alta",
    },
  ];

  const createdPlans: PlanInsert[] = [];

  for (const p of plansData) {
    const existing = await db.query.plan.findFirst({
      where: eq(schema.plan.type, p.type),
    });

    if (existing) {
      await db.update(schema.plan).set(p).where(eq(schema.plan.type, p.type));
    } else {
      await db.insert(schema.plan).values(p);
    }

    createdPlans.push(p);
  }

  return createdPlans;
}

// ===============================================================
// SEED CATEGORIES (BATCH INSERT)
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
    "Servicios",
    "Tiendas",
    "Vestimenta",
    "Tecnología",
    "Vehículos",
  ];

  const categoriasData = categorias.map((nombre) => ({
    label: nombre,
    value: nombre.toLowerCase(),
  }));

  const inserted = await db
    .insert(schema.category)
    .values(categoriasData)
    .returning({ id: schema.category.id, label: schema.category.label });

  return inserted;
}

// ===============================================================
// SEED NORMAL USERS (BATCH)
// ===============================================================

async function seedNormalUsers(count: number = 10): Promise<void> {
  console.log(`👤 Creando ${count} usuarios normales...`);

  const users: Array<{ id: string; name: string; email: string }> = [];

  for (let i = 0; i < count; i++) {
    const name = faker.person.fullName();
    const email = faker.internet.email();

    try {
      const user = await createUser(name, email, PASSWORD);
      users.push(user);
    } catch {
      console.log(`⚠️ Skipping user ${email}`);
    }
  }

  // BATCH: Avatares
  const avatarsData = users.map((user) => ({
    key: crypto.randomUUID(),
    url: faker.image.avatar(),
    avatarId: user.id,
  }));
  if (avatarsData.length > 0) {
    await db.insert(schema.image).values(avatarsData);
  }

  // BATCH: Profiles
  const profilesData = users.map((user) => ({
    userId: user.id,
    name: user.name,
    address: faker.location.streetAddress(),
    phone: faker.phone.number(),
  }));
  if (profilesData.length > 0) {
    await db.insert(schema.profile).values(profilesData);
  }

  // BATCH: Update users
  for (const user of users) {
    await db
      .update(schema.user)
      .set({
        userRole: "USER",
        emailVerified: faker.datatype.boolean(),
      })
      .where(eq(schema.user.id, user.id));
  }
}

// ===============================================================
// SEED ADMINS (BATCH)
// ===============================================================

async function seedAdmins(count: number = 3): Promise<void> {
  console.log(`👑 Creando ${count} admins...`);

  const admins: Array<{ id: string }> = [];

  for (let i = 0; i < count; i++) {
    const name = faker.person.fullName();
    const email = faker.internet.email();

    try {
      const user = await createUser(name, email, PASSWORD);
      admins.push({ id: user.id });

      await db
        .update(schema.user)
        .set({
          userRole: "ADMIN",
          emailVerified: true,
        })
        .where(eq(schema.user.id, user.id));
    } catch {
      console.log(`⚠️ Skipping admin ${email}`);
    }
  }

  // BATCH: Admin records
  const adminsData = admins.map((admin) => ({
    userId: admin.id,
    permissions: faker.helpers.arrayElements([...PERMISSIONS]),
  }));
  if (adminsData.length > 0) {
    await db.insert(schema.admin).values(adminsData);
  }
}

// ===============================================================
// SEED BUSINESSES (OPTIMIZADO)
// ===============================================================

async function seedBusinesses(
  categories: { id: string; label: string }[],
  plans: PlanInsert[],
  count: number = 20,
): Promise<CreatedBusiness[]> {
  console.log(`🏪 Creando ${count} negocios...`);

  const businesses: CreatedBusiness[] = [];

  for (let i = 0; i < count; i++) {
    const category = faker.helpers.arrayElement(categories);
    const {
      plan: { type: planType, listPriority, hasStatistics },
    } = await pickPlanForBusiness();
    const plan = plans.find((p) => p.type === planType);

    if (!plan) continue;

    const name = faker.person.fullName();
    const email = faker.internet.email();

    try {
      const owner = await createUser(name, email, PASSWORD);

      const businessInsert = await db
        .insert(schema.business)
        .values({
          userId: owner.id,
          name: faker.company.name(),
          description: faker.lorem.sentences(2),
          categoryId: category.id,
          address: faker.location.streetAddress(),
          phone: faker.phone.number(),
          createdAt: faker.datatype.boolean({
            probability: 0.7,
          })
            ? faker.date.past({
                refDate: subMonths(
                  new Date(),
                  faker.number.int({ min: 1, max: 12 }),
                ),
              })
            : new Date(),
          facebook: faker.internet.url(),
          email: owner.email,
          tags: faker.lorem.words(3).split(" "),
          website: faker.internet.url(),
          whatsapp: faker.phone.number(),
          verified: faker.datatype.boolean(),
          status: "ACTIVE",
          isActive: true,
          instagram: faker.internet.url(),
        })
        .returning({ id: schema.business.id, name: schema.business.name });

      const { id, name: businessName } = businessInsert[0];

      const productsUsed = faker.number.int({ min: 0, max: plan.maxProducts });
      // Total images used is tricky with per-product limit, but we'll approximate for now or just set 0
      const imagesUsed = 0;

      // Fix: Trial logic. Free is not a trial. Trial is a temporary Premium/Basic access.
      // Randomly assign trial to some non-free plans
      const isTrial =
        planType !== "FREE" && faker.datatype.boolean({ probability: 0.1 });

      const currentPlanInsert = await db
        .insert(schema.currentPlan)
        .values({
          businessId: id,
          planType,
          planStatus: "ACTIVE",
          expiresAt: isTrial
            ? addDays(new Date(), 14) // Trial usage
            : faker.date.future(),
          activatedAt: new Date(),
          isActive: true,
          isTrial,
          imagesUsed,
          productsUsed,
          hasStatistics,
          listPriority,
        })
        .returning({ id: schema.currentPlan.id });

      // If trial, also insert into trial table if it exists (it was deleted in deleteAllData)
      if (isTrial) {
        await db.insert(schema.trial).values({
          businessId: id,
          plan: planType,
          expiresAt: faker.date.future({ years: 0.1 }),
          activatedAt: new Date(),
          isActive: true,
        });
      }

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
        maxImagesPerProduct: plan.maxImagesPerProduct,
        name: businessName,
      });
    } catch {
      console.log(`⚠️ Skipping business`);
    }
  }

  return businesses;
}

// ===============================================================
// ADD IMAGES TO BUSINESSES (BATCH)
// ===============================================================

async function addBusinessImages(businesses: CreatedBusiness[]): Promise<void> {
  console.log("🖼️ Agregando imágenes a negocios...");

  const imagesData: ImageInsert[] = [];

  for (const negocio of businesses) {
    // Cover
    imagesData.push({
      key: crypto.randomUUID(),
      url: faker.image.url(),
      coverBusinessId: negocio.id,
      isMainImage: true,
    });

    // Logo
    imagesData.push({
      key: crypto.randomUUID(),
      url: faker.image.avatar(),
      logoBusinessId: negocio.id,
      isMainImage: true,
    });
  }

  if (imagesData.length > 0) {
    await db.insert(schema.image).values(imagesData);
  }
}

// ===============================================================
// SEED PRODUCTS (BATCH OPTIMIZADO)
// ===============================================================

async function seedProducts(
  businesses: CreatedBusiness[],
  categories: { id: string; label: string }[],
): Promise<CreatedProduct[]> {
  console.log("🛒 Creando productos...");

  const allProducts: CreatedProduct[] = [];
  const productsData: ProductInsert[] = [];
  const imagesData: ImageInsert[] = [];
  const planUpdates: Record<string, { images: number; products: number }> = {};

  for (const negocio of businesses) {
    // Determine product count based on plan limits
    // We increase the hardcap from 20 to allow Basic plans to fill up (50) and Premium to show more.
    // However, we avoid generating 9999 for Premium to keep seed fast.
    const maxSeed = negocio.maxProducts > 100 ? 60 : negocio.maxProducts;

    // Scenario: Some businesses are purely empty, others full, others random
    const rand = Math.random();
    let productsCount = 0;

    if (rand < 0.1) {
      // 10% empty
      productsCount = 0;
    } else if (rand < 0.2) {
      // 10% exactly max (or max seed cap)
      productsCount = maxSeed;
    } else {
      // 80% random
      productsCount = faker.number.int({
        min: 1,
        max: maxSeed,
      });
    }

    // Ensure we don't exceed the actual plan limit (redundant if maxSeed is correct but safe)
    productsCount = Math.min(productsCount, negocio.maxProducts);

    for (let i = 1; i <= productsCount; i++) {
      const category = faker.helpers.arrayElement(categories);
      const productId = crypto.randomUUID();
      const createdAt = faker.datatype.boolean({
        probability: 0.7,
      })
        ? faker.date.past({
            refDate: subMonths(
              new Date(),
              faker.number.int({ min: 1, max: 12 }),
            ),
          })
        : new Date();

      const discount = faker.number.int({ min: 0, max: 70 });
      const hasDiscount = faker.datatype.boolean({ probability: 0.2 });

      productsData.push({
        id: productId,
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: Number.parseFloat(faker.commerce.price()),
        discount: hasDiscount ? discount : 0,
        active: true,
        stock: faker.number.int({ min: 0, max: 150 }),
        brand: getRandomBrandName(),
        businessId: negocio.id,
        isBanned: false,
        categoryId: category.id,
        tags: faker.lorem.words(3).split(" "),
        createdAt,
        // updatedAt se maneja automáticamente
      });

      allProducts.push({ id: productId, businessId: negocio.id });

      const imgCount = faker.number.int({
        min: 1,
        max: negocio.maxImagesPerProduct,
      });

      // Scenario: Some products have NO images if the system allows (though currently we force min 1 per original seed logic, let's keep min 1 unless schema forbids)
      // Actually schema allows null productId in images but product relation might expect images.
      // We will stick to min 1 as requested "respect the amount... per plan" which usually implies max.

      for (let idx = 0; idx < imgCount; idx++) {
        imagesData.push({
          key: crypto.randomUUID(),
          productId,
          url: faker.image.url(),
          isMainImage: idx === 0,
        });
      }

      // Acumular updates
      if (!planUpdates[negocio.currentPlanId]) {
        planUpdates[negocio.currentPlanId] = { images: 0, products: 0 };
      }
      planUpdates[negocio.currentPlanId].images += imgCount;
      planUpdates[negocio.currentPlanId].products += 1;
    }
  }

  // BATCH INSERT: Products
  if (productsData.length > 0) {
    // Split into chunks of 500 to avoid query size limits
    const chunkSize = 500;
    for (let i = 0; i < productsData.length; i += chunkSize) {
      const chunk = productsData.slice(i, i + chunkSize);
      await db.insert(schema.product).values(chunk);
    }
  }

  // BATCH INSERT: Images
  if (imagesData.length > 0) {
    const chunkSize = 500;
    for (let i = 0; i < imagesData.length; i += chunkSize) {
      const chunk = imagesData.slice(i, i + chunkSize);
      await db.insert(schema.image).values(chunk);
    }
  }

  // BATCH UPDATE: Plans
  for (const [planId, counts] of Object.entries(planUpdates)) {
    await db
      .update(schema.currentPlan)
      .set({
        imagesUsed: sql`${schema.currentPlan.imagesUsed} + ${counts.images}`,
        productsUsed: sql`${schema.currentPlan.productsUsed} + ${counts.products}`,
      })
      .where(eq(schema.currentPlan.id, planId));
  }

  return allProducts;
}

// ===============================================================
// SEED VIEWS (BATCH)
// ===============================================================

async function seedViews(
  products: CreatedProduct[],
  businesses: CreatedBusiness[],
): Promise<void> {
  console.log("👁 Registrando vistas...");

  // Product views
  const productViewsData = Array.from({ length: 200 }, () => {
    const product = randomFrom(products);
    return {
      productId: product.id,
      referrer: faker.internet.url(),
      createdAt: faker.date.recent({ days: 120 }),
    };
  });

  if (productViewsData.length > 0) {
    await db.insert(schema.productView).values(productViewsData);
  }

  // Business views
  const businessViewsData = Array.from({ length: 150 }, () => {
    const business = randomFrom(businesses);
    return {
      businessId: business.id,
      referrer: faker.internet.url(),
      createdAt: faker.date.recent({ days: 120 }),
    };
  });

  if (businessViewsData.length > 0) {
    await db.insert(schema.businessView).values(businessViewsData);
  }
}

// ===============================================================
// SEED PAYMENTS & WEBHOOKS (BATCH)
// ===============================================================

async function seedPaymentsAndWebhooks(
  businesses: CreatedBusiness[],
): Promise<CreatedPayment[]> {
  console.log("💳 Creando pagos y webhooks...");

  const paymentStatuses = ["pending", "approved", "rejected"] as const;
  const mpStatuses = {
    pending: "pending",
    approved: "approved",
    rejected: "rejected",
  };

  const paymentsData: PaymentInsert[] = [];
  const webhooksData: WebhookEventInsert[] = [];
  const paymentsCreated: CreatedPayment[] = [];
  const plans = await db.select().from(schema.plan);

  for (const negocio of businesses) {
    const payCount = faker.number.int({ min: 0, max: 4 });

    for (let p = 0; p < payCount; p++) {
      const status = randomFrom([...paymentStatuses]);
      const plan = randomFrom(plans);
      const amount = plan.price;
      const createdAt = faker.datatype.boolean({
        probability: 0.7,
      })
        ? faker.date.past({
            refDate: subMonths(
              new Date(),
              faker.number.int({ min: 1, max: 12 }),
            ),
          })
        : new Date();
      const mpPaymentId = crypto.randomUUID();
      const paymentId = crypto.randomUUID();

      paymentsData.push({
        id: paymentId,
        amount,
        currency: "ARS",
        status,
        paymentMethod: randomFrom(["mercadopago", "card", "cash"]),
        mpPaymentId,
        mpStatus: mpStatuses[status],
        plan: plan.type,
        businessId: negocio.id,
        createdAt,
      });

      paymentsCreated.push({ id: paymentId, amount });

      webhooksData.push({
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

  // BATCH INSERT: Payments
  if (paymentsData.length > 0) {
    await db.insert(schema.payment).values(paymentsData);
  }

  // BATCH INSERT: Webhooks
  if (webhooksData.length > 0) {
    await db.insert(schema.webhookEvent).values(webhooksData);
  }

  return paymentsCreated;
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
// APPLY SCENARIOS (BATCH UPDATES)
// ===============================================================

async function applyScenarios(
  businesses: CreatedBusiness[],
  products: CreatedProduct[],
): Promise<void> {
  console.log("⚙️ Aplicando escenarios...");

  // Cancelar planes (8%)
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
        isActive: false,
      })
      .where(eq(schema.currentPlan.id, negocio.currentPlanId));
  }

  // Expirar planes (5%)
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
        isActive: false,
      })
      .where(eq(schema.currentPlan.id, negocio.currentPlanId));

    // Also expire trial if applicable
    await db
      .update(schema.trial)
      .set({ isActive: false })
      .where(eq(schema.trial.businessId, negocio.id));
  }

  // Inactive plans (5%) - Scenario added
  const toInactive = faker.helpers.arrayElements(
    businesses.filter((b) => !toCancel.includes(b) && !toExpire.includes(b)), // Avoid overlapping too much
    Math.floor(businesses.length * 0.05),
  );
  for (const negocio of toInactive) {
    await db
      .update(schema.currentPlan)
      .set({
        planStatus: PLAN_STATUS.INACTIVE,
        isActive: false,
      })
      .where(eq(schema.currentPlan.id, negocio.currentPlanId));
  }

  // Banear negocios (3%)
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

  // Banear negocios random (10%)
  const toBanRandom = businesses.filter(() => Math.random() < 0.1);
  for (const negocio of toBanRandom) {
    await db
      .update(schema.business)
      .set({ isBanned: true })
      .where(eq(schema.business.id, negocio.id));
  }

  // Banear productos random (5%)
  const productsToBan = products.filter(() => Math.random() < 0.05);
  for (const product of productsToBan) {
    await db
      .update(schema.product)
      .set({ isBanned: true })
      .where(eq(schema.product.id, product.id));
  }
}

// ===============================================================
// MAIN SEED FUNCTION
// ===============================================================

async function main(): Promise<void> {
  console.log("🌱 Iniciando seed optimizado...\n");
  const startTime = Date.now();

  try {
    await deleteAllData();
    const plans = await seedPlans();
    const categories = await seedCategories();
    await seedNormalUsers();
    await seedAdmins();
    const businesses = await seedBusinesses(categories, plans);
    await addBusinessImages(businesses);
    const products = await seedProducts(businesses, categories);
    await seedViews(products, businesses);
    const payments = await seedPaymentsAndWebhooks(businesses);
    await seedAnalytics(payments);
    await applyScenarios(businesses, products);

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`\n✅ SEED COMPLETADO en ${duration}s`);
  } catch (error) {
    console.error("❌ Error durante el seed:", error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    console.log("🔌 Conexión cerrada.");
    process.exit(0);
  });

// prisma/seed.ts
import { faker } from "@faker-js/faker";
import { auth } from "@/lib/auth";
import { PrismaClient } from "../app/generated/prisma";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed...");

  for (let i = 0; i < 10; i++) {
    // ---- USER ----
    const { user } = await auth.api.signUpEmail({
      body: {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: "ivan2214",
        image: faker.image.avatar(),
      },
    });

    // ---- BUSINESS ----
    const plan = faker.helpers.arrayElement(["FREE", "BASIC", "PREMIUM"]);
    const business = await prisma.business.create({
      data: {
        name: faker.company.name(),
        description: faker.company.catchPhrase(),
        phone: faker.phone.number(),
        whatsapp: faker.phone.number(),
        email: faker.internet.email(),
        website: faker.internet.url(),
        address: faker.location.streetAddress(),
        plan,
        planStatus: "ACTIVE",
        userId: user.id,
      },
    });

    // ---- BUSINESS IMAGES ----
    await prisma.image.create({
      data: {
        key: faker.string.uuid(),
        url: faker.image.urlPicsumPhotos({ width: 200, height: 200 }),
        isMainImage: true,
        logoBusinessId: business.id,
        name: "Logo",
        size: faker.number.float({ min: 50, max: 200 }),
      },
    });

    await prisma.image.create({
      data: {
        key: faker.string.uuid(),
        url: faker.image.urlPicsumPhotos({ width: 1200, height: 400 }),
        isMainImage: false,
        coverBusinessId: business.id,
        name: "Cover",
        size: faker.number.float({ min: 500, max: 2000 }),
      },
    });

    // ---- PRODUCTS ----
    const productCount = faker.number.int({ min: 5, max: 15 });
    for (let j = 0; j < productCount; j++) {
      const product = await prisma.product.create({
        data: {
          name: faker.commerce.productName(),
          description: faker.commerce.productDescription(),
          price: parseFloat(faker.commerce.price({ min: 10, max: 5000 })),
          category: faker.commerce.department(),
          businessId: business.id,
          featured: faker.datatype.boolean(),
        },
      });

      // ---- PRODUCT VIEWS ----
      const viewsCount = faker.number.int({ min: 0, max: 20 });
      for (let v = 0; v < viewsCount; v++) {
        await prisma.productView.create({
          data: {
            productId: product.id,
            referrer: faker.internet.url(),
            createdAt: faker.date.recent({ days: 90 }),
          },
        });
      }

      // ---- PRODUCT IMAGES ----
      const imagesPerProduct = faker.number.int({ min: 1, max: 5 });
      let isFirstImage = true;
      for (let k = 0; k < imagesPerProduct; k++) {
        await prisma.image.create({
          data: {
            key: faker.string.uuid(),
            url: faker.image.urlPicsumPhotos({ width: 600, height: 600 }),
            isMainImage: isFirstImage,
            productId: product.id,
            name: faker.commerce.productAdjective(),
            size: faker.number.float({ min: 100, max: 1500 }),
          },
        });
        isFirstImage = false;
      }
    }

    // ---- PAYMENTS ----
    const paymentCount = faker.number.int({ min: 1, max: 3 });
    for (let p = 0; p < paymentCount; p++) {
      const paymentPlan = faker.helpers.arrayElement([
        "FREE",
        "BASIC",
        "PREMIUM",
      ]);
      const status = faker.helpers.arrayElement([
        "pending",
        "approved",
        "rejected",
      ]);
      await prisma.payment.create({
        data: {
          amount: faker.number.float({ min: 1000, max: 10000 }),
          currency: "ARS",
          status,
          paymentMethod: faker.helpers.arrayElement([
            "card",
            "pix",
            "transfer",
          ]),
          plan: paymentPlan,
          businessId: business.id,
          mpPaymentId: faker.string.uuid(),
          mpStatus: status === "approved" ? "approved" : "rejected",
        },
      });
    }

    // ---- TRIALS ----
    if (faker.datatype.boolean()) {
      const isActive = faker.datatype.boolean();
      const expiresAt = isActive
        ? faker.date.soon({ days: 7 })
        : faker.date.past({ years: 0.1 });
      await prisma.trial.create({
        data: {
          businessId: business.id,
          plan: "PREMIUM",
          expiresAt,
          isActive,
        },
      });
    }

    // ---- COUPONS ----
    const couponCount = faker.number.int({ min: 1, max: 3 });
    for (let c = 0; c < couponCount; c++) {
      const maxUses = faker.number.int({ min: 1, max: 10 });
      const usedCount = faker.number.int({ min: 0, max: maxUses });
      const expiresAt = faker.datatype.boolean()
        ? faker.date.soon({ days: 60 })
        : undefined;

      const coupon = await prisma.coupon.create({
        data: {
          code: faker.string.alpha({ length: 8 }).toUpperCase(),
          plan: "PREMIUM",
          durationDays: 30,
          maxUses,
          usedCount,
          expiresAt,
        },
      });

      // ---- COUPON REDEMPTIONS ----
      const redemptionCount = faker.number.int({ min: 0, max: usedCount });
      for (let r = 0; r < redemptionCount; r++) {
        await prisma.couponRedemption.create({
          data: {
            couponId: coupon.id,
            businessId: business.id,
          },
        });
      }
    }

    // ---- BUSINESS VIEWS ----
    const viewsCount = faker.number.int({ min: 1, max: 10 });
    for (let v = 0; v < viewsCount; v++) {
      await prisma.businessView.create({
        data: {
          businessId: business.id,
          referrer: faker.internet.url(),
          createdAt: faker.date.recent({ days: 90 }),
        },
      });
    }

    // ---- ANALYTICS ----
    const today = new Date();
    await prisma.analytics.upsert({
      where: { date: today },
      update: {
        totalPayments: { increment: paymentCount },
        totalTrials: { increment: 1 },
        activeTrials: { increment: 1 },
        totalRedemptions: { increment: couponCount },
      },
      create: {
        date: today,
        totalPayments: paymentCount,
        totalTrials: 1,
        activeTrials: 1,
        totalRedemptions: couponCount,
      },
    });
  }

  console.log("✅ Seed completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

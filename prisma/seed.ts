// prisma/seed.ts
import { faker } from "@faker-js/faker";
import { auth } from "@/lib/auth";
import { Permission, PrismaClient } from "../app/generated/prisma";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting enhanced seed...");

  /*  SUPER ADMIN */
  const { user: superAdmin } = await auth.api.signUpEmail({
    body: {
      name: "Super Admin",
      email: "superadmin@gmail.com",
      password: "test2214",
      image: faker.image.avatar(),
    },
  });
  await prisma.admin.create({
    data: {
      userId: superAdmin.id,
      permissions: ["ALL"],
    },
  });

  await prisma.user.update({
    where: {
      id: superAdmin.id,
    },
    data: {
      userRole: "ADMIN",
    },
  });

  // --- 1️⃣ ADMINS USER ---
  const permissions = [
    Permission.ALL,
    Permission.BAN_USERS,
    Permission.MANAGE_COUPONS,
    Permission.MANAGE_PAYMENTS,
    Permission.MODERATE_CONTENT,
    Permission.VIEW_ANALYTIICS,
  ];
  const adminsToCreate = faker.number.int({ min: 1, max: 5 });

  for (let i = 0; i < adminsToCreate; i++) {
    const { user: userAdmin } = await auth.api.signUpEmail({
      body: {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: "test2214",
        image: faker.image.avatar(),
      },
    });
    const permissionsAdmin = faker.helpers.arrayElements(permissions);
    await prisma.admin.create({
      data: {
        userId: userAdmin.id,
        permissions: permissionsAdmin.includes("ALL")
          ? ["ALL"]
          : permissionsAdmin,
      },
    });
    await prisma.user.update({
      where: {
        id: userAdmin.id,
      },
      data: {
        userRole: "ADMIN",
      },
    });
  }

  const admins = await prisma.admin.findMany();

  // --- 2️⃣ NORMAL USERS WITH BUSINESSES ---
  for (let i = 0; i < 15; i++) {
    const { user } = await auth.api.signUpEmail({
      body: {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: "seedpassword123",
        image: faker.image.avatar(),
      },
    });
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        userRole: "BUSINESS",
      },
    });

    // Simulate inactive or banned users
    const maybeBanned =
      faker.datatype.boolean() && faker.number.int({ min: 1, max: 10 }) > 8;

    if (maybeBanned) {
      const adminUser = faker.helpers.arrayElement(admins);
      await prisma.$transaction([
        prisma.bannedUser.create({
          data: {
            bannedById: adminUser.userId,
            userId: user.id,
          },
        }),
        prisma.user.update({
          where: { id: user.id },
          data: {
            isBanned: true,
          },
        }),
      ]);
    }

    // --- BUSINESS ---
    const plan = faker.helpers.arrayElement(["FREE", "BASIC", "PREMIUM"]);
    const status = faker.helpers.arrayElement([
      "ACTIVE",
      "EXPIRED",
      "INACTIVE",
      "CANCELLED",
    ]);
    const isActive = status === "ACTIVE" && !maybeBanned;

    const business = await prisma.business.create({
      data: {
        name: faker.company.name(),
        description: faker.company.catchPhrase(),
        phone: faker.phone.number(),
        whatsapp: faker.phone.number(),
        email: faker.internet.email(),
        website: faker.internet.url(),
        facebook: faker.internet.url(),
        instagram: faker.internet.url(),
        twitter: faker.internet.url(),
        address: faker.location.streetAddress(),
        category: faker.commerce.department(),
        hours: "Lunes a Viernes: 9:00 - 18:00",
        plan,
        planStatus: status,
        isActive,
        planExpiresAt:
          status === "EXPIRED"
            ? faker.date.past({ years: 0.3 })
            : faker.date.soon({ days: 60 }),
        userId: user.id,
      },
    });

    // Possibly ban business
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
          where: {
            id: business.id,
          },
          data: {
            isBanned: true,
          },
        }),
      ]);
    }

    // --- LOGO & COVER IMAGES ---
    const isReportedLogo = faker.datatype.boolean();
    const isBannedLogo = isReportedLogo && faker.datatype.boolean();
    await prisma.image.create({
      data: {
        key: faker.string.uuid(),
        url: faker.image.urlPicsumPhotos({ width: 300, height: 300 }),
        isMainImage: true,
        logoBusinessId: business.id,
        name: "Logo",
        size: faker.number.float({ min: 50, max: 250 }),
        isReported: isReportedLogo,
        isBanned: isBannedLogo,
      },
    });
    const isReportedCover = faker.datatype.boolean();
    const isBannedCover = isReportedCover && faker.datatype.boolean();

    await prisma.image.create({
      data: {
        key: faker.string.uuid(),
        url: faker.image.urlPicsumPhotos({ width: 1200, height: 400 }),
        isMainImage: false,
        coverBusinessId: business.id,
        name: "Cover",
        size: faker.number.float({ min: 400, max: 2000 }),
        isReported: isReportedCover,
        isBanned: isBannedCover,
      },
    });

    // --- PRODUCTS ---
    const productCount = faker.number.int({ min: 3, max: 10 });
    for (let j = 0; j < productCount; j++) {
      const active = faker.datatype.boolean({ probability: 0.85 });
      const product = await prisma.product.create({
        data: {
          name: faker.commerce.productName(),
          description: faker.commerce.productDescription(),
          price: parseFloat(faker.commerce.price({ min: 100, max: 20000 })),
          category: faker.commerce.department(),
          featured: plan === "PREMIUM" && faker.datatype.boolean(),
          businessId: business.id,
          active,
        },
      });

      // Sometimes a product is banned
      if (
        faker.datatype.boolean() &&
        faker.number.int({ min: 1, max: 10 }) > 9
      ) {
        const adminUser = faker.helpers.arrayElement(admins);
        await prisma.bannedProduct.create({
          data: {
            bannedById: adminUser.userId,
            productId: product.id,
          },
        });
        await prisma.product.update({
          where: {
            id: product.id,
          },
          data: {
            isBanned: true,
          },
        });
      }

      // Product images
      const imageCount = faker.number.int({ min: 1, max: 4 });
      let first = true;
      for (let k = 0; k < imageCount; k++) {
        const isReported = faker.datatype.boolean();
        const isBanned = isReported && faker.datatype.boolean();
        await prisma.image.create({
          data: {
            key: faker.string.uuid(),
            url: faker.image.urlPicsumPhotos({ width: 800, height: 600 }),
            isMainImage: first,
            productId: product.id,
            size: faker.number.float({ min: 100, max: 1800 }),
            name: faker.commerce.productAdjective(),
            isReported,
            isBanned,
          },
        });
        first = false;
      }

      // Product views (spread across 6 months)
      const views = faker.number.int({ min: 5, max: 30 });
      for (let v = 0; v < views; v++) {
        await prisma.productView.create({
          data: {
            productId: product.id,
            referrer: faker.internet.url(),
            createdAt: faker.date.between({
              from: faker.date.past({ years: 0.5 }),
              to: new Date(),
            }),
          },
        });
      }
    }

    // --- PAYMENTS (past and present) ---
    const payments = faker.number.int({ min: 1, max: 20 });
    let hasApprovedPayment = false;

    for (let p = 0; p < payments; p++) {
      const status = faker.helpers.arrayElement([
        "pending",
        "approved",
        "rejected",
      ]);
      const paymentPlan = faker.helpers.arrayElement([
        "FREE",
        "BASIC",
        "PREMIUM",
      ]);

      if (status === "approved") hasApprovedPayment = true;

      await prisma.payment.create({
        data: {
          amount: faker.number.float({ min: 1000, max: 15000 }),
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
          createdAt: faker.date.recent({
            days: faker.number.int({ min: 14, max: 365 }),
          }),
        },
      });
    }

    // --- TRIALS ---
    // Solo crear prueba si NO hay pagos aprobados
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

    // --- COUPONS & REDEMPTIONS ---
    const coupons = faker.number.int({ min: 1, max: 3 });
    for (let c = 0; c < coupons; c++) {
      const maxUses = faker.number.int({ min: 1, max: 10 });
      const usedCount = faker.number.int({ min: 0, max: maxUses });
      const expiresAt = faker.helpers.maybe(
        () => faker.date.soon({ days: 90 }),
        { probability: 0.7 },
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
        await prisma.couponRedemption.create({
          data: {
            couponId: coupon.id,
            businessId: business.id,
            redeemedAt: faker.date.recent({ days: 120 }),
          },
        });
      }
    }

    // --- BUSINESS VIEWS ---
    const businessViews = faker.number.int({ min: 3, max: 25 });
    for (let v = 0; v < businessViews; v++) {
      await prisma.businessView.create({
        data: {
          businessId: business.id,
          referrer: faker.internet.url(),
          createdAt: faker.date.between({
            from: faker.date.past({ years: 0.5 }),
            to: new Date(),
          }),
        },
      });
    }

    // --- ANALYTICS (aggregate by date) ---
    const date = faker.date.recent({ days: 90 });
    await prisma.analytics.upsert({
      where: { date },
      update: {
        totalPayments: { increment: payments },
        totalTrials: { increment: 1 },
        activeTrials: { increment: 1 },
        totalRedemptions: { increment: 1 },
        totalRevenue: {
          increment: faker.number.float({ min: 1000, max: 10000 }),
        },
      },
      create: {
        date,
        totalPayments: payments,
        totalTrials: 1,
        activeTrials: 1,
        totalRedemptions: 1,
        totalRevenue: faker.number.float({ min: 1000, max: 10000 }),
      },
    });
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

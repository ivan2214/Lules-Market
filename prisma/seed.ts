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
    const business = await prisma.business.create({
      data: {
        name: faker.company.name(),
        description: faker.company.catchPhrase(),
        phone: faker.phone.number(),
        whatsapp: faker.phone.number(),
        email: faker.internet.email(),
        website: faker.internet.url(),
        address: faker.location.streetAddress(),
        plan: "BASIC",
        planStatus: "ACTIVE",
        userId: user.id,
      },
    });

    const randomPastDateLast90Days = faker.date.recent({
      refDate: new Date(),
      days: 90,
    });

    await prisma.businessView.create({
      data: {
        businessId: business.id,
        referrer: faker.internet.url(),
        createdAt: randomPastDateLast90Days,
      },
    });

    // ---- BUSINESS IMAGES (logo + cover) ----
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
    for (let j = 0; j < 5; j++) {
      const product = await prisma.product.create({
        data: {
          name: faker.commerce.productName(),
          description: faker.commerce.productDescription(),
          price: parseFloat(faker.commerce.price({ min: 10, max: 5000 })),
          category: faker.commerce.department(),
          businessId: business.id,
        },
      });
      const randomPastDateLast90Days = faker.date.recent({
        refDate: new Date(),
        days: 90,
      });
      await prisma.productView.create({
        data: {
          productId: product.id,
          referrer: faker.internet.url(),
          createdAt: randomPastDateLast90Days,
        },
      });

      // ---- PRODUCT IMAGES ----
      const images = Array.from({
        length: faker.number.int({ min: 1, max: 3 }),
      }).map(() => ({
        key: faker.string.uuid(),
        url: faker.image.urlPicsumPhotos({ width: 600, height: 600 }),
        isMainImage: false,
        productId: product.id,
        name: faker.commerce.productAdjective(),
        size: faker.number.float({ min: 100, max: 1500 }),
      }));
      await prisma.image.createMany({ data: images });
    }

    // ---- PAYMENTS ----
    await prisma.payment.create({
      data: {
        amount: faker.number.float({ min: 1000, max: 10000 }),
        currency: "ARS",
        status: faker.helpers.arrayElement(["pending", "approved", "rejected"]),
        paymentMethod: faker.helpers.arrayElement(["card", "pix", "transfer"]),
        plan: faker.helpers.arrayElement(["FREE", "BASIC", "PREMIUM"]),
        businessId: business.id,
        mpPaymentId: faker.string.uuid(),
        mpStatus: faker.helpers.arrayElement(["approved", "rejected"]),
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

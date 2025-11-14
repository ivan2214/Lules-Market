// Seed.ts completo con signUpEmail integrado
// Contraseña fija: test2214
// Datos realistas en español
// Categorías fijas, usuarios, admins, negocios, productos, imágenes, reviews, vistas, cupones, trials y mucho más.

import { faker } from "@faker-js/faker";
import { subMonths } from "date-fns";
import { auth } from "@/lib/auth";
import {
  type Business,
  Permission,
  PrismaClient,
  type Product,
} from "../app/generated/prisma";

const prisma = new PrismaClient();

async function crearUsuario(name: string, email: string, password: string) {
  const { user } = await auth.api.signUpEmail({
    body: { name, email, password },
  });
  return user;
}

async function main() {
  console.log("🌱 Iniciando seed realista...");

  const PASSWORD = "test2214";

  // Categorías fijas
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

  console.log("📦 Creando categorías...");
  const createdCategories = [];
  for (const nombre of categorias) {
    const cat = await prisma.category.create({
      data: { label: nombre, value: nombre.toLowerCase() },
    });
    createdCategories.push(cat);
  }

  console.log("👤 Creando usuarios y perfiles...");
  for (let i = 0; i < 50; i++) {
    const name = faker.person.fullName();
    const email = faker.internet.email();
    const user = await crearUsuario(name, email, PASSWORD);

    await prisma.profile.create({
      data: {
        userId: user.id,
        name: user.name,
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

  const usuarios = await prisma.user.findMany({
    where: { email: { not: undefined } },
  });

  // Admins
  console.log("👑 Creando admins...");
  const admins = [];
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
    const user = await crearUsuario(name, email, PASSWORD);

    await prisma.user.update({
      where: { id: user.id },
      data: { userRole: "ADMIN" },
    });
    await prisma.admin.create({
      data: {
        userId: user.id,
        permissions: faker.helpers.arrayElements(adminPermissions),
      },
    });

    admins.push(user);
  }

  // Negocios
  console.log("🏪 Creando negocios...");
  const negocios: Business[] = [];
  const usuariosDisponibles = [...usuarios];
  for (let i = 0; i < 30 && usuariosDisponibles.length > 0; i++) {
    const index = Math.floor(Math.random() * usuariosDisponibles.length);
    const owner = usuariosDisponibles.splice(index, 1)[0];
    const category = faker.helpers.arrayElement(createdCategories);

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
      },
    });

    negocios.push(business);
  }

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

  // Productos
  console.log("🛒 Creando productos e imágenes...");
  const productos: Product[] = [];
  for (const negocio of negocios) {
    const cantidad = faker.number.int({ min: 5, max: 15 });
    for (let i = 0; i < cantidad; i++) {
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
        },
      });
      productos.push(product);

      const imgCount = faker.number.int({ min: 2, max: 5 });
      const imagenes = Array.from({ length: imgCount }, (_, idx) => ({
        productId: product.id,
        url: faker.image.url(),
        name: faker.word.sample(),
        isMainImage: idx === 0,
        size: faker.number.int({ min: 20000, max: 2000000 }),
        key: faker.string.uuid(),
      }));
      await prisma.image.createMany({ data: imagenes });
    }
  }

  // Reviews
  console.log("⭐ Generando reviews...");
  const reviewsData = Array.from({ length: 600 }, () => ({
    userId: faker.helpers.arrayElement(usuarios).id,
    productId: faker.helpers.arrayElement(productos).id,
    rating: faker.number.int({ min: 1, max: 5 }),
    comment: faker.lorem.sentence(),
    createdAt: new Date(),
    updatedAt: new Date(),
  }));
  await prisma.review.createMany({ data: reviewsData });

  // Vistas
  console.log("👁 Registrando vistas de productos...");
  const productViewsData = Array.from({ length: 1500 }, () => ({
    productId: faker.helpers.arrayElement(productos).id,
    referrer: faker.internet.url(),
    createdAt: new Date(),
  }));
  await prisma.productView.createMany({ data: productViewsData });

  console.log("👁 Registrando vistas de negocios...");
  const businessViewsData = Array.from({ length: 1000 }, () => ({
    businessId: faker.helpers.arrayElement(negocios).id,
    referrer: faker.internet.url(),
    createdAt: new Date(),
  }));
  await prisma.businessView.createMany({ data: businessViewsData });

  // Cupones
  console.log("🎟️ Creando cupones...");
  const couponsData = Array.from({ length: 15 }, () => ({
    code: faker.string.alphanumeric(8).toUpperCase(),
    discountPercent: faker.number.int({ min: 5, max: 40 }),
    expiresAt: faker.date.soon(),
    createdAt: new Date(),
    updatedAt: new Date(),
  }));
  await prisma.coupon.createMany({ data: couponsData });

  // Trials
  console.log("⏳ Creando trials...");
  const negociosDisponibles = [...negocios];
  for (let i = 0; i < 10 && negociosDisponibles.length > 0; i++) {
    const index = Math.floor(Math.random() * negociosDisponibles.length);
    const negocio = negociosDisponibles.splice(index, 1)[0];
    await prisma.trial.create({
      data: {
        businessId: negocio.id,
        activatedAt: faker.date.past(),
        expiresAt: faker.date.future(),
      },
    });
  }

  // Posts e imágenes
  console.log("📝 Creando posts públicos con imágenes...");
  const posts = [];
  for (let i = 0; i < 80; i++) {
    const user = faker.helpers.arrayElement(usuarios);
    const post = await prisma.post.create({
      data: {
        authorId: user.id,
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
  console.log("💬 Creando respuestas para algunos posts...");
  const postsConRespuestas = faker.helpers.arrayElements(
    posts,
    Math.floor(posts.length * 0.5)
  );
  for (const post of postsConRespuestas) {
    const cantidadRespuestas = faker.number.int({ min: 1, max: 5 });
    for (let j = 0; j < cantidadRespuestas; j++) {
      const user = faker.helpers.arrayElement(usuarios);
      await prisma.answer.create({
        data: {
          postId: post.id,
          authorId: user.id,
          content: faker.lorem.sentences(faker.number.int({ min: 1, max: 3 })),
          isAnon: Math.random() < 0.2,
        },
      });
    }
  }

  // Baneo aleatorio
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

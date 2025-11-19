import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { createAuthMiddleware } from "better-auth/api";
import { nextCookies } from "better-auth/next-js";
// If your Prisma file is located elsewhere, you can change the path
import { PrismaClient } from "@/app/generated/prisma";
import { sendEmail } from "./email";

const prisma = new PrismaClient();
export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql", // or "mysql", "postgresql", ...etc
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    autoSignIn: true,

    resetPasswordTokenExpiresIn: 60 * 60 * 1000,
    async sendResetPassword({ url, user }) {
      await sendEmail({
        to: user.email,
        subject: "Restablecer contraseña - LulesMarket",
        title: "Restablecer Contraseña",
        description:
          "Recibimos una solicitud para restablecer la contraseña de tu cuenta. Hacé click en el botón para crear una nueva contraseña. Este enlace expirará en 1 hora.",
        buttonText: "Restablecer Contraseña",
        buttonUrl: url,
        userFirstname: user.name.split(" ")[0],
      });
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 minutes
    },
  },
  trustedOrigins: [
    process.env.APP_URL as string,
    process.env.BETTER_AUTH_URL as string,
    "http://localhost:3000",
    "http://192.168.1.103:3000",
  ],
  emailVerification: {
    autoSignInAfterVerification: true,
  },
  plugins: [nextCookies()], // make sure this is the last plugin in the array

  hooks: {
    after: createAuthMiddleware(async (ctx) => {
      const { context } = ctx;
      const { newSession } = context;

      const { user } = newSession || {};

      if (user && user?.email === process.env.ADMIN_EMAIL) {
        await prisma.user?.update({
          where: { id: user?.id },
          data: { userRole: "ADMIN" },
        });
        const existingAdmin = await prisma.admin.findUnique({
          where: { userId: user?.id },
        });

        if (!existingAdmin) {
          await prisma.admin.create({
            data: {
              userId: user?.id,
            },
          });
        }
      }
      if (user && user?.email === process.env.SUPER_ADMIN_EMAIL) {
        await prisma.user?.update({
          where: { id: user?.id },
          data: { userRole: "SUPER_ADMIN" },
        });

        const existingSuperAdmin = await prisma.admin.findUnique({
          where: { userId: user?.id },
        });

        if (!existingSuperAdmin) {
          await prisma.admin.create({
            data: {
              userId: user?.id,
            },
          });
        }
      }
    }),
  },
});

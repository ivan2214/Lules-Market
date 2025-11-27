import { prismaAdapter } from "better-auth/adapters/prisma";
import { createAuthMiddleware } from "better-auth/api";
import { betterAuth } from "better-auth/minimal";
import { nextCookies } from "better-auth/next-js";

// If your Prisma file is located elsewhere, you can change the path

import { BusinessStatus } from "@/app/generated/prisma/enums";
import { env } from "@/env";
import { sendEmail } from "./email";
import prisma from "./prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql", // or "mysql", "postgresql", ...etc
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    autoSignIn: false,
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
    env.APP_URL as string,
    env.BETTER_AUTH_URL as string,
    "http://localhost:3000",
    "http://192.168.1.103:3000",
  ],
  emailVerification: {
    autoSignInAfterVerification: true,
    expiresIn: 60 * 60 * 1000,
    // esto es el momento en que se esta verificando el email
    async onEmailVerification(user) {
      // Find the verification token
      const verificationToken = await prisma.emailVerificationToken.findUnique({
        where: { userId: user.id },
        include: { user: true },
      });

      if (!verificationToken) {
        throw new Error("Token de verificación inválido o expirado");
      }

      // Check if token is expired
      if (verificationToken.expiresAt < new Date()) {
        // Delete expired token
        await prisma.emailVerificationToken.delete({
          where: { id: verificationToken.id },
        });

        throw new Error(
          "El enlace de verificación ha expirado. Solicitá un nuevo enlace.",
        );
      }

      // Verify the user and update business status
      await prisma.$transaction(async (tx) => {
        // Update user as verified
        await tx.user.update({
          where: { id: verificationToken.userId },
          data: { emailVerified: true },
        });

        // Update business status to active
        await tx.business.updateMany({
          where: { userId: verificationToken.userId },
          data: { status: BusinessStatus.ACTIVE },
        });

        // Delete the verification token
        await tx.emailVerificationToken.delete({
          where: { id: verificationToken.id },
        });
      });
    },
    async sendVerificationEmail({ token, user }) {
      // create email verification token
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

      const existingToken = await prisma.emailVerificationToken.findUnique({
        where: { token },
      });

      if (existingToken) {
        await prisma.emailVerificationToken.delete({
          where: { id: existingToken.id },
        });
      }

      await prisma.emailVerificationToken.create({
        data: {
          userId: user.id,
          token,
          expiresAt,
        },
      });

      // Send verification email
      await sendEmail({
        to: user.email,
        subject: "Verificá tu cuenta en LulesMarket",
        title: "Verificación de cuenta",
        description: `Gracias por registrarte en LulesMarket. Para completar tu registro, necesitamos que verifiques tu dirección de email haciendo click en el botón de abajo. Si no funciona el boton, podés verificar tu cuenta manualmente ingresando el token de verificación en la pantalla de verificación`,
        token,
        buttonText: "Verificar Email",
        buttonUrl: `${env.APP_URL}/auth/verify?token=${token}`,
        userFirstname: user.name,
      });
    },
    async afterEmailVerification({ id }) {
      const user = await prisma.user.findUnique({ where: { id } });

      if (!user) {
        return;
      }

      if (!user.emailVerified) {
        return;
      }

      await sendEmail({
        to: user.email,
        subject: "¡Bienvenido a LulesMarket!",
        title: "Cuenta Verificada",
        description:
          "¡Felicitaciones! Tu cuenta ha sido verificada exitosamente. Ya podés comenzar a crear ofertas y hacer crecer tu negocio con LulesMarket.",
        buttonText: "Ir al Dashboard",
        buttonUrl: `${env.APP_URL}/dashboard`,
        userFirstname: user.name,
      });
    },
    sendOnSignIn: false,
    sendOnSignUp: false,
  },
  plugins: [nextCookies()], // make sure this is the last plugin in the array
  hooks: {
    after: createAuthMiddleware(async (ctx) => {
      const { context } = ctx;
      const { newSession } = context;

      const { user } = newSession || {};

      if (user && user?.email === env.ADMIN_EMAIL) {
        await prisma.user?.update({
          where: { id: user?.id },
          data: { userRole: "ADMIN", emailVerified: true },
        });
        const existingAdmin = await prisma.admin.findUnique({
          where: { userId: user?.id },
        });

        if (!existingAdmin) {
          await prisma.admin.create({
            data: {
              userId: user?.id,
              permissions: {
                set: ["ALL"],
              },
            },
          });
        }
      }
      if (user && user?.email === env.SUPER_ADMIN_EMAIL) {
        await prisma.user?.update({
          where: { id: user?.id },
          data: { userRole: "SUPER_ADMIN", emailVerified: true },
        });

        const existingSuperAdmin = await prisma.admin.findUnique({
          where: { userId: user?.id },
        });

        if (!existingSuperAdmin) {
          await prisma.admin.create({
            data: {
              userId: user?.id,
              permissions: {
                set: ["ALL"],
              },
            },
          });
        }
      }
    }),
  },
});

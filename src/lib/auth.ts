import { ORPCError } from "@orpc/client";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { createAuthMiddleware } from "better-auth/api";
import { betterAuth } from "better-auth/minimal";
import { nextCookies } from "better-auth/next-js";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import {
  business,
  emailVerificationToken,
  user as userDrizzle,
} from "@/db/schema";
import { env } from "@/env";
import { syncUserRole } from "@/shared/actions/user/sync-user-role";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    autoSignIn: false,
    resetPasswordTokenExpiresIn: 60 * 60 * 1000,
    async sendResetPassword({ url, user }) {
      const { sendEmail } = await import("./email"); // Importación dinámica
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
    "http://192.168.1.102:3000",
    "http://192.168.1.101:3000",
    "http://172.21.16.1:3000",
  ],
  emailVerification: {
    autoSignInAfterVerification: true,
    expiresIn: 60 * 60 * 1000,
    // esto es el momento en que se esta verificando el email
    async onEmailVerification(user) {
      const verificationToken = await db.query.emailVerificationToken.findFirst(
        {
          where: eq(emailVerificationToken.userId, user.id),
          with: {
            user: true,
          },
        },
      );

      if (!verificationToken) {
        throw new ORPCError("Token de verificación inválido o expirado");
      }

      // Check if token is expired
      if (verificationToken.expiresAt < new Date()) {
        // Delete expired token
        await db
          .delete(emailVerificationToken)
          .where(eq(emailVerificationToken.id, verificationToken.id));

        throw new ORPCError(
          "El enlace de verificación ha expirado. Solicitá un nuevo enlace.",
        );
      }

      // Verify the user and update business status

      // 1) Marcar usuario como verificado
      await db
        .update(userDrizzle)
        .set({ emailVerified: true })
        .where(eq(userDrizzle.id, verificationToken.userId));

      // 2) Activar negocios del usuario
      await db
        .update(business)
        .set({ status: "ACTIVE" })
        .where(eq(business.userId, verificationToken.userId));

      // 3) Borrar el token
      await db
        .delete(emailVerificationToken)
        .where(eq(emailVerificationToken.id, verificationToken.id));
    },
    async sendVerificationEmail({ token, user }) {
      // create email verification token
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

      const existingToken = await db.query.emailVerificationToken.findFirst({
        where: eq(emailVerificationToken.token, token),
      });

      if (existingToken) {
        await db
          .delete(emailVerificationToken)
          .where(eq(emailVerificationToken.id, existingToken.id));
      }

      await db.insert(emailVerificationToken).values({
        userId: user.id,
        token,
        expiresAt,
      });
      const { sendEmail } = await import("./email"); // Importación dinámica
      // Send verification email
      await sendEmail({
        to: user.email,
        subject: "Verificá tu cuenta en LulesMarket",
        title: "Verificación de cuenta",
        description: `Gracias por registrarte en LulesMarket. Para completar tu registro, necesitamos que verifiques tu dirección de email haciendo click en el botón de abajo. Si no funciona el boton, podés verificar tu cuenta manualmente ingresando el token de verificación en la pantalla de verificación`,
        token,
        buttonText: "Verificar Email",
        buttonUrl: `${env.APP_URL}/verify?token=${token}`,
        userFirstname: user.name,
      });
    },
    async afterEmailVerification({ id }) {
      const user = await db.query.user.findFirst({
        where: eq(userDrizzle.id, id),
      });

      if (!user) {
        return;
      }

      if (!user.emailVerified) {
        return;
      }
      const { sendEmail } = await import("./email"); // Importación dinámica
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

      const { user: sessionUser } = newSession || {};

      if (!sessionUser) return;

      await syncUserRole(sessionUser);
    }),
  },
});

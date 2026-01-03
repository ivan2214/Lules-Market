import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { admin, openAPI, twoFactor } from "better-auth/plugins";

import authConfig from "@/config/auth.config";
import { db } from "@/db";
import * as schema from "@/db/schema";
import { env } from "@/env/server";
import { ac, allRoles } from "@/lib/auth/roles";

export const auth = betterAuth({
  ...authConfig,
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    async sendResetPassword({ url, user }) {
      const { sendEmail } = await import("../email");
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
  user: {
    changeEmail: {
      enabled: true,
      requireVerification: true,
      sendChangeEmailVerification: async ({ user, newEmail, url }) => {
        const { sendEmail } = await import("../email");
        await sendEmail({
          to: user.email,
          subject: "Change Email",
          description: `Usted ha solicitado cambiar su correo electrónico a ${newEmail}. Hacé click en el botón para confirmar el cambio. Este enlace expirará en 1 hora.`,
          buttonText: "Confirmar Cambio de Correo",
          buttonUrl: url,
          userFirstname: user.name.split(" ")[0],
          title: "Confirmar Cambio de Correo",
        });
      },
    },
    deleteUser: {
      enabled: true,
      deleteSessions: true,
      sendDeleteAccountVerification: async ({ user, url }) => {
        const { sendEmail } = await import("../email");
        await sendEmail({
          to: user.email,
          subject: "Delete Account",
          description: `Usted ha solicitado eliminar su cuenta. Hacé click en el botón para confirmar el borrado. Este enlace expirará en 1 hora.`,
          buttonText: "Confirmar Borrado de Cuenta",
          buttonUrl: url,
          userFirstname: user.name.split(" ")[0],
          title: "Confirmar Borrado de Cuenta",
        });
      },
    },
  },
  emailVerification: {
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, token }) => {
      const { sendEmail } = await import("../email");
      await sendEmail({
        to: user.email,
        subject: "Verificá tu cuenta en LulesMarket",
        title: "Verificación de cuenta",
        description: `Gracias por registrarte en LulesMarket. Para completar tu registro, necesitamos que verifiques tu dirección de email haciendo click en el botón de abajo. Si no funciona el boton, podés verificar tu cuenta manualmente ingresando el token de verificación en la pantalla de verificación, ${token}`,
        buttonText: "Verificar Email",
        buttonUrl: `${env.APP_URL}/verify?token=${token}`,
        userFirstname: user.name,
      });
    },
    afterEmailVerification: async (user) => {
      const { sendEmail } = await import("../email");
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
  },
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  plugins: [
    admin({
      ac,
      roles: allRoles,
      defaultRole: "user", // Por defecto todos son usuarios normales
    }),
    twoFactor({
      otpOptions: {
        sendOTP: async ({ user, otp }) => {
          const { sendEmail } = await import("../email");
          await sendEmail({
            to: user.email,
            subject: "OTP",
            description: `Tu OTP es ${otp}`,
            buttonText: "Verificar OTP",
            buttonUrl: `${env.APP_URL}/verify-otp?otp=${otp}`,
            userFirstname: user.name,
            title: "Verificación de OTP",
          });
        },
      },
    }),
    openAPI({}),
    nextCookies(),
  ],
});

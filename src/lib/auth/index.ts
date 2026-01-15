import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { customSession, openAPI, twoFactor } from "better-auth/plugins";
import { eq } from "drizzle-orm";

import authConfig from "@/config/auth.config";
import { db } from "@/db";
import * as schema from "@/db/schema";
import { env } from "@/env/server";

import { UserService } from "@/server/modules/user/service";

export const auth = betterAuth({
  ...authConfig,
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    requireEmailVerification: true,
    async sendResetPassword({ url, user }) {
      const { sendEmail } = await import("../send-email");
      await sendEmail({
        type: "password-reset",
        to: user.email,
        userFirstname: user.name?.split(" ")[0] || "Usuario",
        resetUrl: url,
        expiresIn: "1 hora",
      });
    },
  },
  user: {
    changeEmail: {
      enabled: true,
      requireVerification: true,
      sendChangeEmailVerification: async ({ user, newEmail, url }) => {
        const { sendEmail } = await import("../send-email");
        await sendEmail({
          type: "change-email",
          to: user.email,
          userFirstname: user.name?.split(" ")[0] || "Usuario",
          newEmail,
          confirmUrl: url,
          expiresIn: "1 hora",
        });
      },
    },
    deleteUser: {
      enabled: true,
      deleteSessions: true,
      sendDeleteAccountVerification: async ({ user, url }) => {
        const { sendEmail } = await import("../send-email");
        await sendEmail({
          type: "delete-account-confirmation",
          to: user.email,
          userFirstname: user.name?.split(" ")[0] || "Usuario",
          confirmUrl: url,
          expiresIn: "1 hora",
        });
      },
    },
  },
  emailVerification: {
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, token }) => {
      const { sendEmail } = await import("../send-email");
      const verificationUrl = `${env.APP_URL}/verify-email?token=${token}`;
      await sendEmail({
        type: "verification",
        to: user.email,
        userFirstname: user.name?.split(" ")[0] || "Usuario",
        verificationUrl,
        token,
      });
    },
    afterEmailVerification: async (user) => {
      const { sendEmail } = await import("../send-email");
      await sendEmail({
        type: "welcome",
        to: user.email,
        userFirstname: user.name?.split(" ")[0] || "Usuario",
        dashboardUrl: `${env.APP_URL}/dashboard`,
      });
    },
  },
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  plugins: [
    twoFactor({
      otpOptions: {
        sendOTP: async ({ user, otp }) => {
          const { sendEmail } = await import("../send-email");
          await sendEmail({
            type: "otp",
            to: user.email,
            userFirstname: user.name?.split(" ")[0] || "Usuario",
            otp,
            expiresIn: "10 minutos",
          });
        },
      },
    }),
    openAPI(),
    nextCookies(),
    customSession(async ({ user, session }) => {
      const business = await db.query.business.findFirst({
        where: eq(schema.business.userId, user.id),
        with: {
          user: true,
          logo: true,
          coverImage: true,
          currentPlan: {
            with: {
              plan: true,
            },
          },
          category: true,
        },
      });

      const admin = await db.query.admin.findFirst({
        where: eq(schema.admin.userId, user.id),
        with: {
          user: true,
        },
      });

      const userDB = await db.query.user.findFirst({
        where: eq(schema.user.id, user.id),
        with: {
          notifications: true,
        },
      });

      return {
        user: userDB,
        session,
        business: business || null,
        admin: admin || null,
      };
    }),
  ],
  databaseHooks: {
    user: {
      create: {
        async before(_user) {},
        async after(user) {
          const { id, email } = user;
          await UserService.syncRole({
            email,
            id,
          });
        },
      },
    },
  },
});

export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;

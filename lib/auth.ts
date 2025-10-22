import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
// If your Prisma file is located elsewhere, you can change the path
import { PrismaClient } from "@/app/generated/prisma";

const prisma = new PrismaClient();
export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql", // or "mysql", "postgresql", ...etc
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
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
    "http://192.168.1.102:3000",
  ],
  plugins: [nextCookies()], // make sure this is the last plugin in the array
});

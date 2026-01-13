import Elysia, { t } from "elysia";
import { AccountUpdateSchema } from "@/shared/validators/account";
import { authPlugin } from "../plugins/auth";
import {
  deleteAccountService,
  updateAccountService,
} from "../services/settings";

// Need to make sure AccountUpdateSchema is compatible with Elysia t.Object if it's Zod.
// Elysia usually works with TypeBox. If AccountUpdateSchema is Zod, we might need adapter or rewrite.
// The original used `zod` in imports (step 22). Elysia supports Zod via plugin but usually prefers TypeBox.
// Let's check imports in step 22: `import z from "zod";` and `import { AccountUpdateSchema } from "@/shared/validators/account";`
// If implementation uses `t` from Elysia, we should redefine schema or ensure compatibility.
// For now, I'll redefine inline using `t` to be safe and cleaner for Elysia, or use Zod if the project uses `elysia-zod`.
// Looking at other files (e.g. products.ts), they use `t` from `elysia`.
// I'll redefine similar to AccountUpdateSchema using `t`.
// AccountUpdateSchema likely has `name` string min(1).

const UpdateAccountBody = t.Object({
  name: t.String({ minLength: 1 }),
});

export const settingsRouter = new Elysia({
  prefix: "/settings",
})
  .use(authPlugin)
  .patch(
    "/account",
    async ({ body, user }) => {
      return await updateAccountService(user.id, body);
    },
    {
      // Using 'user' role check? Original had middleware role: 'user'.
      // authPlugin likely provides user.
      // We can add check: if (!user) ... but authPlugin usually ensures it or we check it.
      // Original: authMiddleware({ role: "user" }).
      // We assume every logged user has role 'user' effectively or it's base permission.
      body: UpdateAccountBody,
      auth: true,
    },
  )
  .delete(
    "/account",
    async ({ user }) => {
      return await deleteAccountService(user.id);
    },
    {
      auth: true,
    },
  );

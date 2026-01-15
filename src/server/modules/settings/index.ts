import { Elysia } from "elysia";
import { AppError } from "@/server/errors";
import { authPlugin } from "@/server/plugins/auth";
import { SettingsModel } from "./model";
import { SettingsService } from "./service";

export const settingsRouter = new Elysia({
  prefix: "/settings",
})
  .use(authPlugin)
  .patch(
    "/account",
    async ({ body, isUser, user }) => {
      if (!isUser || !user) throw new AppError("Unauthorized", "UNAUTHORIZED");
      return await SettingsService.updateAccount(user.id, body);
    },
    {
      body: SettingsModel.updateAccountBody,
      isUser: true,
    },
  )
  .delete(
    "/account",
    async ({ isUser, user }) => {
      if (!isUser || !user) throw new AppError("Unauthorized", "UNAUTHORIZED");
      return await SettingsService.deleteAccount(user.id);
    },
    {
      isUser: true,
    },
  );

import { Elysia } from "elysia";
import { authPlugin } from "@/server/plugins/auth";
import { SettingsModel } from "./model";
import { SettingsService } from "./service";

export const settingsRouter = new Elysia({
  prefix: "/settings",
})
  .use(authPlugin)
  .patch(
    "/account",
    async ({ body, user }) => {
      return await SettingsService.updateAccount(user.id, body);
    },
    {
      body: SettingsModel.updateAccountBody,
      auth: true, // Assuming this is how permissions are checked or just documentation
    },
  )
  .delete(
    "/account",
    async ({ user }) => {
      return await SettingsService.deleteAccount(user.id);
    },
    {
      auth: true,
    },
  );

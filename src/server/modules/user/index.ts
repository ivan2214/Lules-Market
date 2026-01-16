import { Elysia } from "elysia";
import { authPlugin } from "@/server/plugins/auth";
import { UserModel } from "./model";
import { UserService } from "./service";

export const userModule = new Elysia({
  prefix: "/user",
})
  .use(authPlugin)

  .post(
    "/sync-role",
    async ({ body }) => {
      return await UserService.syncRole({ id: body.id, email: body.email });
    },
    {
      body: UserModel.syncRoleBody,
    },
  );

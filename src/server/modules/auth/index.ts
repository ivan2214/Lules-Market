import { Elysia } from "elysia";
import { getSessionFromHeaders } from "@/server/plugins/auth";
import { AuthModel } from "./model";
import { AuthService } from "./service";

export const authController = new Elysia({
  prefix: "/actions",
})
  .post(
    "/signup",
    async ({ body }) => {
      const response = await AuthService.signUp(body);

      if (!response.success) {
        return {
          success: response.success,
          message: response.message,
        };
      }

      return response;
    },
    {
      body: AuthModel.signUp,
      response: AuthModel.signUpOutput,
    },
  )
  .get("/get-session", async ({ request }) => {
    const session = await getSessionFromHeaders(request.headers);
    return session;
  });

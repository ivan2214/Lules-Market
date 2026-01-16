import { APIError } from "better-auth";
import { Elysia } from "elysia";
import { AppError } from "@/server/errors";
import { getSessionFromHeaders } from "@/server/plugins/auth";
import { AuthModel } from "./model";
import { AuthService } from "./service";

export const authController = new Elysia({
  prefix: "/actions",
})
  .post(
    "/signup",
    async ({ body, status }) => {
      const response = await AuthService.signUp(body);

      if (!response.success) {
        console.log("No funciono");

        return {
          success: response.success,
          mesaage: response.message,
        };
      }

      return response;
    },
    {
      body: AuthModel.signUp,
      response: AuthModel.signUpOutput,
    },
  )
  .get("/get-session", async ({ request: { headers } }) => {
    if (!headers) {
      throw new AppError("No headers provided", "BAD_REQUEST");
    }
    const session = await getSessionFromHeaders(headers);
    return session;
  });

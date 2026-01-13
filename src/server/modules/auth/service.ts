import "server-only";
import { auth } from "@/lib/auth";
import { AppError } from "@/server/errors";
import { BusinessService } from "../business/service";
import type { AuthModel } from "./model";

export const AuthService = {
  async signUp(input: AuthModel.signUp) {
    const { name, email, password, businessData } = input;
    const {
      address,
      category,
      coverImage,
      description,
      logo,
      name: businessName,
      facebook,
      instagram,
      phone,
      tags,
      website,
      whatsapp,
    } = businessData;

    const { user } = await auth.api.signUpEmail({
      body: {
        name,
        email,
        password,
      },
    });

    if (!user) {
      throw new AppError("Usuario no encontrado", "NOT_FOUND", {
        message: "Usuario no encontrado",
      });
    }

    const data = await BusinessService.setup({
      coverImage,
      logo,
      name: businessName,
      address,
      category,
      description,
      facebook,
      instagram,
      phone,
      tags,
      website,
      whatsapp,
      userEmail: user.email,
    });

    return {
      success: !!data?.success,
    };
  },
};

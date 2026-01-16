import "server-only";
import { auth } from "@/lib/auth";
import { BusinessService } from "../business/service";
import type { AuthModel } from "./model";

export const AuthService = {
  async signUp(input: AuthModel.SignUp): Promise<AuthModel.SignUpOutput> {
    try {
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
        return {
          success: false,
          message: "Algo salio mal",
        };
      }

      const { success } = await BusinessService.setup({
        coverImage: coverImage.file,
        logo: logo.file,
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
        success: !!success,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Error en el servicio";

      console.error(errorMessage);
      throw errorMessage;
    }
  },
};

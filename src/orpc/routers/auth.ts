import z from "zod";
import { auth } from "@/lib/auth";
import { client } from "@/orpc/index";
import { signUpSchema } from "@/shared/validators/auth";
import type { BusinessSetupSchema } from "@/shared/validators/business";
import { o } from "../context";

const sigup = o
  .route({
    method: "POST",
    path: "/sign-up",
  })
  .input(signUpSchema.omit({ confirmPassword: true }))
  .output(z.object({ success: z.boolean() }))
  .handler(async ({ input }) => {
    const { name, email, password, businessData, isBusiness } = input;
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
    } = businessData as z.infer<typeof BusinessSetupSchema>;

    if (!isBusiness) {
      const { user } = await auth.api.signUpEmail({
        body: {
          name,
          email,
          password,
        },
      });
      return {
        success: !!user,
      };
    }
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
      };
    }

    const { success } = await client.business.private.setup({
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
      success: !!success,
    };
  });

export const authRouter = {
  sigup,
};

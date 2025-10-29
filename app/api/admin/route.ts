import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

const { ADMIN_EMAIL, ADMIN_PASS, ADMIN_NAME } = process.env;

export async function GET() {
  try {
    if (!ADMIN_EMAIL || !ADMIN_NAME || !ADMIN_PASS) {
      return Response.json({
        error: true,
      });
    }

    const adminExisting = await prisma.admin.findFirst({
      where: {
        user: {
          email: ADMIN_EMAIL,
        },
      },
    });

    if (adminExisting) {
      return Response.json({
        success: true,
        message: "Admin existente",
      });
    }

    const { user } = await auth.api.signUpEmail({
      body: {
        email: ADMIN_EMAIL,
        name: ADMIN_NAME,
        password: ADMIN_PASS,
      },
    });

    const admin = await prisma.admin.create({
      data: {
        userId: user.id,
        permissions: ["ALL"],
      },
    });
    return Response.json({
      success: true,
      message: "Admin creado",
      data: admin,
    });
  } catch (error) {
    return Response.json({
      error: true,
      message: error,
    });
  }
}

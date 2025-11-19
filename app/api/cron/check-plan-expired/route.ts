import { type NextRequest, NextResponse } from "next/server";
import { createLog } from "@/app/data/admin/admin.dal";
import { sendEmail } from "@/lib/email";
import prisma from "@/lib/prisma";

/**
 * Cron job para verificar y desactivar planes expirados
 * Se ejecuta diariamente para mantener la integridad de los planes activos
 */
export async function GET(req: NextRequest) {
  // 🔐 Seguridad: validamos el header Authorization
  const authHeader = req.headers.get("Authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const now = new Date();

    // Buscar todos los planes activos que ya vencieron
    const vencidos = await prisma.currentPlan.findMany({
      where: {
        isActive: true,
        expiresAt: { lt: now },
      },
      include: {
        business: {
          select: {
            name: true,
            id: true,
            user: {
              select: {
                email: true,
              },
            },
          },
        },
        plan: {
          select: {
            name: true,
            type: true,
          },
        },
      },
    });

    let desactivados = 0;

    for (const plan of vencidos) {
      // Desactivar el plan vencido
      await prisma.currentPlan.update({
        where: { id: plan.id },
        data: { isActive: false },
      });

      // enviar email informando el vencimiento del plan

      await sendEmail({
        to: plan.business.user?.email,
        subject: "Tu plan expiró en LulesMarket",
        description: `Tu plan "${plan.plan.name}" ha expirado el ${plan.expiresAt.toLocaleString()}.`,
        buttonText: "Actualizar plan",
        buttonUrl: `${process.env.NEXT_PUBLIC_WEBSITE_URL}/dashboard/plan`,
        title: "Plan expirado",
        userFirstname: plan.business.name,
      });

      // Registrar log de la desactivación
      await createLog({
        adminId: "SYSTEM",
        action: "PLAN_EXPIRED",
        entityType: "PlanActive",
        entityId: plan.id,
        details: {
          businessName: plan.business.name,
          businessId: plan.business.id,
          planName: plan.plan.name,
          planSlug: plan.plan.type,
          expiresAt: plan.expiresAt,
        },
      });

      desactivados++;
    }

    console.log(
      `✅ Cron check-plan-expired: ${desactivados} planes desactivados`,
    );

    return NextResponse.json({
      ok: true,
      desactivados,
      message: `${desactivados} planes expirados desactivados correctamente`,
    });
    // biome-ignore lint/suspicious/noExplicitAny: <necesario>
  } catch (err: any) {
    console.error("❌ Error en cron check-plan-expired:", err);

    // Registrar error en logs
    await createLog({
      adminId: "SYSTEM",
      action: "PLAN_EXPIRATION_CHECK_FAILED",
      details: { error: err.message },
    });

    return NextResponse.json(
      { ok: false, error: err.message },
      { status: 500 },
    );
  }
}

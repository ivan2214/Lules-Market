import { and, eq, lt } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";

import { db, schema } from "@/db";
import { env } from "@/env";
import { orpc } from "@/lib/orpc";

/**
 * Cron job para verificar y desactivar planes expirados
 * Se ejecuta diariamente para mantener la integridad de los planes activos
 */
export async function GET(req: NextRequest) {
  // 🔐 Seguridad: validamos el header Authorization
  const authHeader = req.headers.get("Authorization");
  if (authHeader !== `Bearer ${env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const now = new Date();

    // Buscar todos los planes activos que ya vencieron
    const vencidos = await db.query.currentPlan.findMany({
      where: and(
        eq(schema.currentPlan.isActive, true),
        lt(schema.currentPlan.expiresAt, now),
      ),
      with: {
        business: {
          columns: {
            name: true,
            id: true,
          },
          with: {
            user: {
              columns: {
                email: true,
              },
            },
          },
        },
        plan: {
          columns: {
            name: true,
            type: true,
          },
        },
      },
    });

    let desactivados = 0;

    for (const plan of vencidos) {
      // Desactivar el plan vencido
      await db
        .update(schema.currentPlan)
        .set({ isActive: false })
        .where(eq(schema.currentPlan.id, plan.id));

      // enviar email informando el vencimiento del plan
      if (plan.business?.user?.email && plan.plan && plan.expiresAt) {
        const { sendEmail } = await import("@/lib/email"); // Importación dinámica
        await sendEmail({
          to: plan.business.user.email,
          subject: "Tu plan expiró en LulesMarket",
          description: `Tu plan "${plan.plan.name}" ha expirado el ${plan.expiresAt.toLocaleString()}.`,
          buttonText: "Actualizar plan",
          buttonUrl: `${env.APP_URL}/dashboard/subscription`,
          title: "Plan expirado",
          userFirstname: plan.business.name,
        });
      }

      // Registrar log de la desactivación
      await orpc.admin.createLog({
        adminId: "SYSTEM",
        action: "PLAN_EXPIRED",
        entityType: "PlanActive",
        entityId: plan.id,
        details: {
          businessName: plan.business?.name,
          businessId: plan.business?.id,
          planName: plan.plan?.name,
          planSlug: plan.plan?.type,
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
    await orpc.admin.createLog({
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

import { cacheLife, cacheTag } from "next/cache";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import prisma from "@/lib/prisma";
import { CouponClient } from "./components/coupon-client";
import { CouponCreateFormDialog } from "./components/coupon-create-form-dialog";

export default async function CouponsPage() {
  "use cache";
  cacheLife("hours");
  cacheTag("coupons-page");
  const coupons = await prisma.coupon.findMany({
    include: {
      redemptions: true,
    },
  });

  const redemptions = await prisma.couponRedemption.findMany({
    include: {
      coupon: true,
      business: true,
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start gap-y-2 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="font-bold text-3xl tracking-tight">
            Gestión de Cupones
          </h1>
          <p className="text-muted-foreground">
            Crea y administra cupones de descuento
          </p>
        </div>
        <CouponCreateFormDialog />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="font-medium text-muted-foreground text-sm">
              Total Cupones
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">{coupons.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="font-medium text-muted-foreground text-sm">
              Cupones Activos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl text-green-600">
              {coupons.filter((c) => c.active).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="font-medium text-muted-foreground text-sm">
              Total Canjes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">{redemptions.length}</div>
          </CardContent>
        </Card>
      </div>

      <CouponClient coupons={coupons} redemptions={redemptions} />
    </div>
  );
}

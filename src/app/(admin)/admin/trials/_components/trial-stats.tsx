"use client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Suspense } from "react";
import { orpcTanstack } from "@/lib/orpc";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";

export const TrialStats = () => {
  const {
    data: { trials, activeTrials },
  } = useSuspenseQuery(
    orpcTanstack.admin.getTrialsAndActiveCount.queryOptions(),
  );

  const expiringSoon = activeTrials.filter(
    (t) => t.daysRemaining <= 3 && t.daysRemaining > 0,
  ).length;
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="font-medium text-muted-foreground text-sm">
            Total Trials
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="font-bold text-2xl">{trials.length}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="font-medium text-muted-foreground text-sm">
            Trials Activos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="font-bold text-2xl text-green-600">
            {activeTrials.length}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="font-medium text-muted-foreground text-sm">
            Por Expirar (3 días)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="font-bold text-2xl text-yellow-600">
            <Suspense fallback={<Skeleton className="h-8 w-8" />}>
              {expiringSoon}
            </Suspense>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

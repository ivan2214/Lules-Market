import type { Plan } from "@/db/types";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/shared/components/ui/card";

interface ComparisonTableProps {
  plans: Plan[];
}

export const ComparisonTable: React.FC<ComparisonTableProps> = ({ plans }) => {
  return (
    <div className="mx-auto max-w-5xl">
      <h2 className="mb-8 text-center font-bold text-3xl">
        Comparación Detallada
      </h2>
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="p-4 text-left font-semibold">
                    Característica
                  </th>

                  {plans.map((plan) => (
                    <th
                      key={plan.type}
                      className={cn(
                        "p-4 text-center font-semibold",
                        plan.type === "PREMIUM" && "bg-primary/10 font-bold",
                      )}
                    >
                      {plan.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-4">Cantidad de Productos</td>
                  {plans.map((plan) => (
                    <td
                      key={plan.type}
                      className={cn(
                        "p-4 text-center font-bold",
                        plan.type === "PREMIUM" && "bg-primary/10",
                      )}
                    >
                      {plan.type === "PREMIUM"
                        ? "Ilimitados"
                        : plan.maxProducts}
                    </td>
                  ))}
                </tr>
                <tr className="border-b">
                  <td className="p-4">Imágenes por producto</td>
                  {plans.map((plan) => (
                    <td
                      key={plan.type}
                      className={cn(
                        "p-4 text-center",
                        plan.type === "PREMIUM" && "bg-primary/10 font-bold",
                      )}
                    >
                      {plan.maxImagesPerProduct}
                    </td>
                  ))}
                </tr>
                <tr className="border-b">
                  <td className="p-4">Prioridad en listados</td>
                  {plans.map((plan) => (
                    <td
                      key={plan.type}
                      className={cn(
                        "p-4 text-center",
                        plan.type === "PREMIUM" && "bg-primary/10 font-bold",
                      )}
                    >
                      {plan.listPriority}
                    </td>
                  ))}
                </tr>
                <tr className="border-b">
                  <td className="p-4">Estadísticas de visitas</td>
                  {plans.map((plan) => (
                    <td
                      key={plan.type}
                      className={cn(
                        "p-4 text-center",
                        plan.type === "PREMIUM" && "bg-primary/10 font-bold",
                      )}
                    >
                      {plan.hasStatistics ? "Incluidas" : "-"}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-4">Soporte técnico</td>
                  {plans.map((plan) => (
                    <td
                      key={plan.type}
                      className={cn(
                        "p-4 text-center",
                        plan.type === "PREMIUM" &&
                          "bg-primary/10 font-medium text-primary",
                      )}
                    >
                      {plan.type === "PREMIUM" ? "WhatsApp Directo" : "Email"}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

import { Badge } from "@/components/ui/badge";

type Props = {
  name: string;
  price?: number | null;
  category?: string | null;
  description?: string | null;
};

export async function ProductInfo({
  name,
  price,
  category,
  description,
}: Props) {
  return (
    <div className="space-y-6">
      <div>
        {category && <Badge className="mb-2">{category}</Badge>}
        <h1 className="font-bold text-3xl tracking-tight">{name}</h1>
        <p className="mt-4 font-bold text-3xl">
          {price ? `$${price.toLocaleString()}` : "Consultar precio"}
        </p>
      </div>

      {description && (
        <div>
          <h2 className="mb-2 font-semibold">Descripción</h2>
          <p className="text-muted-foreground leading-relaxed">{description}</p>
        </div>
      )}
    </div>
  );
}

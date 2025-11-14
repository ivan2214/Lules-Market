import Link from "next/link";
import { ImageWithSkeleton } from "@/components/image-with-skeleton";
import { Card, CardContent } from "@/components/ui/card";

type Props = {
  businesses: {
    id: string;
    name: string;
    logo: {
      key: string;
      url: string;
    } | null;
    _count: {
      products: number;
    };
  }[];
};

export function SimilarBusinesses({ businesses }: Props) {
  if (!businesses.length) return null;

  return (
    <div>
      <h2 className="mb-6 font-bold text-2xl">Comercios similares</h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {businesses.map((b) => (
          <Card key={b.id}>
            <CardContent className="flex flex-col items-center gap-2 p-4">
              {b.logo && (
                <ImageWithSkeleton
                  src={b.logo.url}
                  alt={b.name}
                  className="h-16 w-16 rounded-md object-cover"
                />
              )}
              <Link
                href={`/comercios/${b.id}`}
                className="text-center font-medium hover:underline"
              >
                {b.name}
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

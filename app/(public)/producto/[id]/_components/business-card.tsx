import { Store } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/app/shared/components/ui/card";
import type { IconComponentName } from "@/types";
import { ContactButton } from "./contact-button";

type ContactMethod = {
  icon: IconComponentName;
  label: string;
  value?: string | null;
  href?: string | null;
};
type Props = {
  name?: string;
  id?: string;
  contactMethods: ContactMethod[];
};

export function BusinessCard({ name, id, contactMethods }: Props) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="mb-4 flex items-center gap-3">
          <Store className="h-5 w-5 text-muted-foreground" />
          <div>
            <p className="font-semibold">{name}</p>
            {id && (
              <Link
                href={`/comercios/${id}`}
                className="text-muted-foreground text-sm hover:underline"
              >
                Ver más productos
              </Link>
            )}
          </div>
        </div>
        <div className="space-y-2">
          <h3 className="font-semibold text-sm">Contactar al vendedor:</h3>
          <div className="grid gap-2">
            {contactMethods.map((m) => (
              <ContactButton
                key={m.label}
                label={m.label}
                href={m.href}
                icon={m.icon}
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

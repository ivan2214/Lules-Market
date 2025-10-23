import { Mail, MapPin, Phone } from "lucide-react";
import type { Image } from "@/app/generated/prisma";
import { ImageWithSkeleton } from "@/components/image-with-skeleton";

type Props = {
  name: string;
  description?: string | null;
  logo?: Image | null;
  address?: string | null;
  phone?: string | null;
  email?: string | null;
  businessId: string;
};

export async function BusinessHeader({
  name,
  description,
  logo,
  address,
  phone,
  email,
}: Props) {
  return (
    <div className="flex flex-col gap-6 md:flex-row">
      {logo && (
        <div className="h-32 w-32 shrink-0 overflow-hidden rounded-lg bg-muted">
          <ImageWithSkeleton
            src={logo.url}
            alt={name}
            className="h-full w-full object-cover"
          />
        </div>
      )}
      <div className="flex-1">
        <h1 className="font-bold text-3xl tracking-tight">{name}</h1>
        {description && (
          <p className="mt-2 text-muted-foreground leading-relaxed">
            {description}
          </p>
        )}
        <div className="mt-4 flex flex-wrap gap-4">
          {address && (
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              {address}
            </div>
          )}
          {phone && (
            <a
              href={`tel:${phone}`}
              className="flex items-center gap-2 text-sm hover:underline"
            >
              <Phone className="h-4 w-4 text-muted-foreground" />
              {phone}
            </a>
          )}
          {email && (
            <a
              href={`mailto:${email}`}
              className="flex items-center gap-2 text-sm hover:underline"
            >
              <Mail className="h-4 w-4 text-muted-foreground" />
              {email}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

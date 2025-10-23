import { Globe, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type Props = {
  whatsapp?: string | null;
  website?: string | null;
};

export function ContactCard({ whatsapp, website }: Props) {
  if (!whatsapp && !website) return null;

  return (
    <Card>
      <CardContent className="pt-6">
        <h2 className="mb-4 font-semibold">Contactar</h2>
        <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
          {whatsapp && (
            <Button asChild variant="outline" className="bg-transparent">
              <a
                href={`https://wa.me/${whatsapp.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                WhatsApp
              </a>
            </Button>
          )}
          {website && (
            <Button asChild variant="outline" className="bg-transparent">
              <a href={website} target="_blank" rel="noopener noreferrer">
                <Globe className="mr-2 h-4 w-4" />
                Sitio Web
              </a>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

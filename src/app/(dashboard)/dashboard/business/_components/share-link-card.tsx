"use client";

import { Download, ExternalLink, Share2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { CopyLinkButton } from "./copy-link-button";

interface ShareLinkCardProps {
  businessId: string;
}

/**
 * Component to display the public link of the business and a QR code to share it.
 */
export function ShareLinkCard({ businessId }: ShareLinkCardProps) {
  const [origin, setOrigin] = useState("");
  const [canShare, setCanShare] = useState(false);

  useEffect(() => {
    setOrigin(window.location.origin);
    if (
      typeof navigator !== "undefined" &&
      typeof navigator.share === "function"
    ) {
      setCanShare(true);
    }
  }, []);

  const path = `/comercio/${businessId}`;
  const fullUrl = origin ? `${origin}${path}` : path;

  const handleShare = async () => {
    try {
      await navigator.share({
        title: "Mi Negocio en Lules Market",
        text: "¡Mira mi perfil en Lules Market!",
        url: fullUrl,
      });
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  const downloadQRCode = () => {
    const svg = document.getElementById("business-qr-code");
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      // White background
      if (ctx) {
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        const pngFile = canvas.toDataURL("image/png");
        const downloadLink = document.createElement("a");
        downloadLink.download = `lules-market-qr-${businessId}.png`;
        downloadLink.href = pngFile;
        downloadLink.click();
      }
    };

    img.src = `data:image/svg+xml;base64,${btoa(svgData)}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Comparte tu Enlace</CardTitle>
        <CardDescription>
          Obtén un enlace único y código QR para compartir en redes sociales,
          WhatsApp o imprimirlo en tu local.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Tu Enlace Público</Label>
          <div className="flex gap-2">
            <Input value={fullUrl} readOnly />
            <CopyLinkButton url={fullUrl} />
            {canShare && (
              <Button variant="outline" size="icon" onClick={handleShare}>
                <Share2 className="h-4 w-4" />
              </Button>
            )}
            <Button variant="outline" size="icon" asChild>
              <Link href={path} target="_blank">
                <ExternalLink className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        <div className="flex flex-col items-center gap-4 rounded-lg border p-6 sm:flex-row sm:justify-between">
          <div className="space-y-1">
            <h3 className="font-medium">Código QR</h3>
            <p className="text-muted-foreground text-sm">
              Escanea para ir directo a tu perfil
            </p>
            <Button
              onClick={downloadQRCode}
              variant="outline"
              className="mt-4 w-full sm:w-auto"
            >
              <Download className="mr-2 h-4 w-4" />
              Descargar QR
            </Button>
          </div>
          <div className="rounded-lg bg-white p-4 shadow-sm">
            <QRCode
              id="business-qr-code"
              value={fullUrl}
              size={150}
              level="H"
              className="h-auto w-full max-w-[150px]"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

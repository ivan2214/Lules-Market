"use client";

import { CreditCard, Mail, Save, Settings2, Shield } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    // General
    siteName: "Mi Plataforma",
    siteDescription: "Plataforma de comercio electrónico",
    maintenanceMode: false,
    // Free Plan Limits
    freePlanMaxProducts: 10,
    freePlanMaxImages: 3,
    // Email
    emailProvider: "sendgrid",
    emailApiKey: "sk_test_...",
    emailFromAddress: "noreply@example.com",
    // Mercado Pago
    mpPublicKey: "APP_USR_...",
    mpAccessToken: "APP_USR_...",
    mpWebhookSecret: "webhook_secret_...",
    // Security
    enableRateLimiting: true,
    maxLoginAttempts: 5,
    sessionTimeout: 30,
  });

  const handleSave = (section: string) => {
    console.log("Guardar configuración:", section, settings);
    toast.success("Configuración guardada", {
      description: `Los cambios en ${section} se han guardado correctamente.`,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-bold text-3xl tracking-tight">
          Configuración del Sistema
        </h1>
        <p className="text-muted-foreground">
          Administra las configuraciones globales de la plataforma
        </p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList>
          <TabsTrigger value="general">
            <Settings2 className="mr-2 h-4 w-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="email">
            <Mail className="mr-2 h-4 w-4" />
            Email
          </TabsTrigger>
          <TabsTrigger value="payments">
            <CreditCard className="mr-2 h-4 w-4" />
            Pagos
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield className="mr-2 h-4 w-4" />
            Seguridad
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configuración General</CardTitle>
              <CardDescription>Ajustes básicos del sitio</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="siteName">Nombre del Sitio</Label>
                <Input
                  id="siteName"
                  value={settings.siteName}
                  onChange={(e) =>
                    setSettings({ ...settings, siteName: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="siteDescription">Descripción</Label>
                <Textarea
                  id="siteDescription"
                  value={settings.siteDescription}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      siteDescription: e.target.value,
                    })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Modo Mantenimiento</Label>
                  <p className="text-muted-foreground text-sm">
                    Desactiva el acceso público al sitio
                  </p>
                </div>
                <Switch
                  checked={settings.maintenanceMode}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, maintenanceMode: checked })
                  }
                />
              </div>
              <Button onClick={() => handleSave("general")}>
                <Save className="mr-2 h-4 w-4" />
                Guardar Cambios
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Límites del Plan FREE</CardTitle>
              <CardDescription>
                Define las restricciones para usuarios gratuitos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="maxProducts">Máximo de Productos</Label>
                <Input
                  id="maxProducts"
                  type="number"
                  value={settings.freePlanMaxProducts}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      freePlanMaxProducts: Number.parseInt(e.target.value),
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxImages">
                  Máximo de Imágenes por Producto
                </Label>
                <Input
                  id="maxImages"
                  type="number"
                  value={settings.freePlanMaxImages}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      freePlanMaxImages: Number.parseInt(e.target.value),
                    })
                  }
                />
              </div>
              <Button onClick={() => handleSave("límites")}>
                <Save className="mr-2 h-4 w-4" />
                Guardar Cambios
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="email" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configuración de Email</CardTitle>
              <CardDescription>
                Configura el proveedor de correo electrónico
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="emailProvider">Proveedor</Label>
                <Input
                  id="emailProvider"
                  value={settings.emailProvider}
                  onChange={(e) =>
                    setSettings({ ...settings, emailProvider: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emailApiKey">API Key</Label>
                <Input
                  id="emailApiKey"
                  type="password"
                  value={settings.emailApiKey}
                  onChange={(e) =>
                    setSettings({ ...settings, emailApiKey: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emailFrom">Dirección de Envío</Label>
                <Input
                  id="emailFrom"
                  type="email"
                  value={settings.emailFromAddress}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      emailFromAddress: e.target.value,
                    })
                  }
                />
              </div>
              <Button onClick={() => handleSave("email")}>
                <Save className="mr-2 h-4 w-4" />
                Guardar Cambios
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Integración con Mercado Pago</CardTitle>
              <CardDescription>
                Configura las credenciales de Mercado Pago
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="mpPublicKey">Public Key</Label>
                <Input
                  id="mpPublicKey"
                  value={settings.mpPublicKey}
                  onChange={(e) =>
                    setSettings({ ...settings, mpPublicKey: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mpAccessToken">Access Token</Label>
                <Input
                  id="mpAccessToken"
                  type="password"
                  value={settings.mpAccessToken}
                  onChange={(e) =>
                    setSettings({ ...settings, mpAccessToken: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mpWebhook">Webhook Secret</Label>
                <Input
                  id="mpWebhook"
                  type="password"
                  value={settings.mpWebhookSecret}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      mpWebhookSecret: e.target.value,
                    })
                  }
                />
              </div>
              <Button onClick={() => handleSave("pagos")}>
                <Save className="mr-2 h-4 w-4" />
                Guardar Cambios
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configuración de Seguridad</CardTitle>
              <CardDescription>
                Ajusta las políticas de seguridad del sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Rate Limiting</Label>
                  <p className="text-muted-foreground text-sm">
                    Limita las solicitudes por IP
                  </p>
                </div>
                <Switch
                  checked={settings.enableRateLimiting}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, enableRateLimiting: checked })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxAttempts">Intentos Máximos de Login</Label>
                <Input
                  id="maxAttempts"
                  type="number"
                  value={settings.maxLoginAttempts}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      maxLoginAttempts: Number.parseInt(e.target.value),
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sessionTimeout">
                  Timeout de Sesión (minutos)
                </Label>
                <Input
                  id="sessionTimeout"
                  type="number"
                  value={settings.sessionTimeout}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      sessionTimeout: Number.parseInt(e.target.value),
                    })
                  }
                />
              </div>
              <Button onClick={() => handleSave("seguridad")}>
                <Save className="mr-2 h-4 w-4" />
                Guardar Cambios
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

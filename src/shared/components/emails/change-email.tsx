import { env } from "@/env/server";
import { BaseEmailTemplate } from "./base-email-template";

interface ChangeEmailProps {
  userFirstname: string;
  appName: string;
  logoUrl?: string;
  newEmail: string;
  confirmUrl: string;
  expiresIn?: string;
}

export function ChangeEmailTemplate({
  userFirstname,
  appName,
  logoUrl,
  newEmail,
  confirmUrl,
  expiresIn = "1 hora",
}: ChangeEmailProps) {
  return (
    <BaseEmailTemplate
      userFirstname={userFirstname}
      appName={appName}
      logoUrl={logoUrl}
      title={`${appName} - Confirmar cambio de correo`}
      description={`Has solicitado cambiar tu correo electrónico a ${newEmail}. Haz clic en el botón de abajo para confirmar este cambio. El enlace expirará en ${expiresIn}.`}
      buttonText="Confirmar cambio de correo"
      buttonUrl={confirmUrl}
      footerText="Si no solicitaste este cambio, ignora este correo y tu email actual seguirá siendo el mismo."
    />
  );
}
ChangeEmailTemplate.PreviewProps = {
  userFirstname: "Carlos",
  appName: "LulesMarket",
  logoUrl:
    "https://lules-market.t3.storage.dev/AIEnhancer_unnamed-removebg-preview.png",
  newEmail: "nuevo@email.com",
  confirmUrl: `${env.APP_URL}/auth/change-email?token=ABC123`,
  expiresIn: "1 hora",
};

export default ChangeEmailTemplate;

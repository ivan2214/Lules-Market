import { BaseEmailTemplate } from "./base-email-template";

interface MagicLinkEmailProps {
  userFirstname: string;
  appName: string;
  logoUrl?: string;
  magicLinkUrl: string;
  expiresIn?: string;
}

export function MagicLinkEmail({
  userFirstname,
  appName,
  logoUrl,
  magicLinkUrl,
  expiresIn = "15 minutos",
}: MagicLinkEmailProps) {
  return (
    <BaseEmailTemplate
      userFirstname={userFirstname}
      appName={appName}
      logoUrl={logoUrl}
      title={`${appName} - Enlace de inicio de sesión`}
      description={`Solicitaste iniciar sesión en tu cuenta. Haz clic en el botón de abajo para acceder de forma segura. Este enlace expirará en ${expiresIn}.`}
      buttonText="Iniciar sesión"
      buttonUrl={magicLinkUrl}
      footerText="Si no solicitaste este enlace, puedes ignorar este correo de forma segura."
    />
  );
}

MagicLinkEmail.PreviewProps = {
  userFirstname: "Carlos",
  appName: "LulesMarket",
  logoUrl: "https://lules-market-dev.t3.storage.dev/logo.webp",
  magicLinkUrl: "https://www.lulesmarket.com/auth/magic?token=MAGIC123",
  expiresIn: "15 minutos",
};

export default MagicLinkEmail;

import { env } from "@/env/server";
import { BaseEmailTemplate } from "./base-email-template";

interface VerificationEmailProps {
  userFirstname: string;
  appName: string;
  logoUrl?: string;
  verificationUrl: string;
  token?: string;
}

export function VerificationEmail({
  userFirstname,
  appName,
  logoUrl,
  verificationUrl,
  token,
}: VerificationEmailProps) {
  return (
    <BaseEmailTemplate
      userFirstname={userFirstname}
      appName={appName}
      logoUrl={logoUrl}
      title={`${appName} - Verifica tu correo electrónico`}
      description="Gracias por registrarte. Por favor verifica tu correo electrónico haciendo clic en el botón de abajo o ingresando el código de verificación en la página."
      buttonText="Verificar correo electrónico"
      buttonUrl={verificationUrl}
      token={token}
      footerText="Si no creaste una cuenta, puedes ignorar este correo."
    />
  );
}

VerificationEmail.PreviewProps = {
  userFirstname: "Carlos",
  appName: "LulesMarket",
  logoUrl:
    "https://lules-market.t3.storage.dev/AIEnhancer_unnamed-removebg-preview.png",
  verificationUrl: `${env.APP_URL}/auth/verify?token=ABC123`,
  token: "ABC123",
};

export default VerificationEmail;

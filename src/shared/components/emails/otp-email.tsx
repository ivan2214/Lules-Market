import { BaseEmailTemplate } from "./base-email-template";

interface OtpEmailProps {
  userFirstname: string;
  appName: string;
  logoUrl?: string;
  otp: string;
  expiresIn?: string;
}

export function OtpEmail({
  userFirstname,
  appName,
  logoUrl,
  otp,
  expiresIn = "10 minutos",
}: OtpEmailProps) {
  return (
    <BaseEmailTemplate
      userFirstname={userFirstname}
      appName={appName}
      logoUrl={logoUrl}
      title={`${appName} - Código de verificación`}
      description={`Usa el siguiente código para completar tu verificación de dos factores. Este código expirará en ${expiresIn}.`}
      token={otp}
      footerText="Si no solicitaste este código, te recomendamos cambiar tu contraseña inmediatamente."
    />
  );
}

OtpEmail.PreviewProps = {
  userFirstname: "Carlos",
  appName: "LulesMarket",
  logoUrl:
    "https://lules-market.t3.storage.dev/AIEnhancer_unnamed-removebg-preview.png",
  otp: "123456",
  expiresIn: "10 minutos",
};

export default OtpEmail;

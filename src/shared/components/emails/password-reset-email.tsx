import { BaseEmailTemplate } from "./base-email-template";

interface PasswordResetEmailProps {
  userFirstname: string;
  appName: string;
  logoUrl?: string;
  resetUrl: string;
  token?: string;
  expiresIn?: string;
}

export function PasswordResetEmail({
  userFirstname,
  appName,
  logoUrl,
  resetUrl,
  token,
  expiresIn = "1 hora",
}: PasswordResetEmailProps) {
  return (
    <BaseEmailTemplate
      userFirstname={userFirstname}
      appName={appName}
      logoUrl={logoUrl}
      title={`${appName} - Restablecer contraseña`}
      description={`Recibimos una solicitud para restablecer la contraseña de tu cuenta. Haz clic en el botón de abajo para crear una nueva contraseña. Este enlace expirará en ${expiresIn}.`}
      buttonText="Restablecer contraseña"
      buttonUrl={resetUrl}
      token={token}
      footerText="Si no solicitaste un cambio de contraseña, puedes ignorar este correo. Tu contraseña seguirá siendo la misma."
    />
  );
}

PasswordResetEmail.PreviewProps = {
  userFirstname: "Carlos",
  appName: "LulesMarket",
  logoUrl: "https://lules-market-dev.t3.storage.dev/logo.webp",
  resetUrl: "https://www.lulesmarket.com/reset-password?token=XYZ789",
  token: "XYZ789",
  expiresIn: "1 hora",
};

export default PasswordResetEmail;

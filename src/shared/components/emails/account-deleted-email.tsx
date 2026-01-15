import { BaseEmailTemplate } from "./base-email-template";

interface AccountDeletedEmailProps {
  userFirstname: string;
  appName: string;
  logoUrl?: string;
  supportEmail?: string;
}

export function AccountDeletedEmail({
  userFirstname,
  appName,
  logoUrl,
  supportEmail = "soporte@lulesmarket.com",
}: AccountDeletedEmailProps) {
  return (
    <BaseEmailTemplate
      userFirstname={userFirstname}
      appName={appName}
      logoUrl={logoUrl}
      title={`${appName} - Cuenta eliminada`}
      description={`Tu cuenta en ${appName} ha sido eliminada exitosamente. Todos tus datos personales han sido removidos de nuestros sistemas de acuerdo con nuestra política de privacidad.`}
      footerText={`Si no solicitaste esta eliminación o crees que fue un error, contáctanos a ${supportEmail} dentro de los próximos 30 días.`}
      showSecurityWarning={false}
    />
  );
}

AccountDeletedEmail.PreviewProps = {
  userFirstname: "Carlos",
  appName: "LulesMarket",
  logoUrl: "https://lules-market-dev.t3.storage.dev/logo.webp",
};

export default AccountDeletedEmail;

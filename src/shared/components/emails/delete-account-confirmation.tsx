import { env } from "@/env/server";
import { BaseEmailTemplate } from "./base-email-template";

interface DeleteAccountConfirmationProps {
  userFirstname: string;
  appName: string;
  logoUrl?: string;
  confirmUrl: string;
  expiresIn?: string;
}

export function DeleteAccountConfirmationEmail({
  userFirstname,
  appName,
  logoUrl,
  confirmUrl,
  expiresIn = "1 hora",
}: DeleteAccountConfirmationProps) {
  return (
    <BaseEmailTemplate
      userFirstname={userFirstname}
      appName={appName}
      logoUrl={logoUrl}
      title={`${appName} - Confirmar eliminación de cuenta`}
      description={`Has solicitado eliminar tu cuenta. Esta acción es irreversible y eliminará todos tus datos permanentemente. Haz clic en el botón de abajo para confirmar. El enlace expirará en ${expiresIn}.`}
      buttonText="Confirmar eliminación"
      buttonUrl={confirmUrl}
      footerText="Si no solicitaste eliminar tu cuenta, ignora este correo. Tu cuenta permanecerá activa."
    />
  );
}

DeleteAccountConfirmationEmail.PreviewProps = {
  userFirstname: "Carlos",
  appName: "LulesMarket",
  logoUrl:
    "https://lules-market.t3.storage.dev/AIEnhancer_unnamed-removebg-preview.png",
  confirmUrl: `${env.APP_URL}/auth/delete-account?token=ABC123`,
  expiresIn: "1 hora",
};

export default DeleteAccountConfirmationEmail;

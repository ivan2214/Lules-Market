import { render } from "@react-email/components";
import { transporter } from "@/config/mail.config";
import { env } from "@/env/server";
import {
  AccountDeletedEmail,
  ChangeEmailTemplate,
  DeleteAccountConfirmationEmail,
  MagicLinkEmail,
  OtpEmail,
  PasswordResetEmail,
  VerificationEmail,
  WelcomeEmail,
} from "@/shared/components/emails";

interface BaseEmailParams {
  to: string;
  userFirstname: string;
}

interface VerificationEmailParams extends BaseEmailParams {
  type: "verification";
  verificationUrl: string;
  token?: string;
}

interface PasswordResetEmailParams extends BaseEmailParams {
  type: "password-reset";
  resetUrl: string;
  token?: string;
  expiresIn?: string;
}

interface WelcomeEmailParams extends BaseEmailParams {
  type: "welcome";
  dashboardUrl: string;
}

interface MagicLinkEmailParams extends BaseEmailParams {
  type: "magic-link";
  magicLinkUrl: string;
  expiresIn?: string;
}

interface AccountDeletedEmailParams extends BaseEmailParams {
  type: "account-deleted";
  supportEmail?: string;
}

interface ChangeEmailParams extends BaseEmailParams {
  type: "change-email";
  newEmail: string;
  confirmUrl: string;
  expiresIn?: string;
}

interface DeleteAccountConfirmationParams extends BaseEmailParams {
  type: "delete-account-confirmation";
  confirmUrl: string;
  expiresIn?: string;
}

interface OtpEmailParams extends BaseEmailParams {
  type: "otp";
  otp: string;
  expiresIn?: string;
}

type SendEmailParams =
  | VerificationEmailParams
  | PasswordResetEmailParams
  | WelcomeEmailParams
  | MagicLinkEmailParams
  | AccountDeletedEmailParams
  | ChangeEmailParams
  | DeleteAccountConfirmationParams
  | OtpEmailParams;

const APP_NAME = "Lules Market";
const LOGO_URL =
  "https://lules-market.t3.storage.dev/AIEnhancer_unnamed-removebg-preview.png";

const subjectMap = {
  verification: `${APP_NAME} - Verifica tu correo electrónico`,
  "password-reset": `${APP_NAME} - Restablecer contraseña`,
  welcome: `Bienvenido a ${APP_NAME}`,
  "magic-link": `${APP_NAME} - Enlace de inicio de sesión`,
  "account-deleted": `${APP_NAME} - Cuenta eliminada`,
  "change-email": `${APP_NAME} - Confirmar cambio de correo`,
  "delete-account-confirmation": `${APP_NAME} - Confirmar eliminación de cuenta`,
  otp: `${APP_NAME} - Tu código de verificación`,
};

export async function sendEmail(params: SendEmailParams) {
  let html: string;

  switch (params.type) {
    case "verification":
      html = await render(
        VerificationEmail({
          userFirstname: params.userFirstname,
          appName: APP_NAME,
          logoUrl: LOGO_URL,
          verificationUrl: params.verificationUrl,
          token: params.token,
        }),
      );
      break;

    case "password-reset":
      html = await render(
        PasswordResetEmail({
          userFirstname: params.userFirstname,
          appName: APP_NAME,
          logoUrl: LOGO_URL,
          resetUrl: params.resetUrl,
          token: params.token,
          expiresIn: params.expiresIn,
        }),
      );
      break;

    case "welcome":
      html = await render(
        WelcomeEmail({
          userFirstname: params.userFirstname,
          appName: APP_NAME,
          logoUrl: LOGO_URL,
          dashboardUrl: params.dashboardUrl,
        }),
      );
      break;

    case "magic-link":
      html = await render(
        MagicLinkEmail({
          userFirstname: params.userFirstname,
          appName: APP_NAME,
          logoUrl: LOGO_URL,
          magicLinkUrl: params.magicLinkUrl,
          expiresIn: params.expiresIn,
        }),
      );
      break;

    case "account-deleted":
      html = await render(
        AccountDeletedEmail({
          userFirstname: params.userFirstname,
          appName: APP_NAME,
          logoUrl: LOGO_URL,
          supportEmail: params.supportEmail,
        }),
      );
      break;

    case "change-email":
      html = await render(
        ChangeEmailTemplate({
          userFirstname: params.userFirstname,
          appName: APP_NAME,
          logoUrl: LOGO_URL,
          newEmail: params.newEmail,
          confirmUrl: params.confirmUrl,
          expiresIn: params.expiresIn,
        }),
      );
      break;

    case "delete-account-confirmation":
      html = await render(
        DeleteAccountConfirmationEmail({
          userFirstname: params.userFirstname,
          appName: APP_NAME,
          logoUrl: LOGO_URL,
          confirmUrl: params.confirmUrl,
          expiresIn: params.expiresIn,
        }),
      );
      break;

    case "otp":
      html = await render(
        OtpEmail({
          userFirstname: params.userFirstname,
          appName: APP_NAME,
          logoUrl: LOGO_URL,
          otp: params.otp,
          expiresIn: params.expiresIn,
        }),
      );
      break;
  }

  await transporter.sendMail({
    from: env.EMAIL_FROM,
    to: params.to,
    subject: subjectMap[params.type],
    html,
  });
}

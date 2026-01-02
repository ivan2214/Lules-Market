import { render } from "@react-email/components";
import { transporter } from "@/config/mail.config";
import { env } from "@/env/server";
import { EmailTemplate } from "@/shared/components/email-template";

export async function sendEmail({
  to,
  subject,
  description,
  buttonText,
  buttonUrl,
  title,
  userFirstname,
  token,
}: {
  to: string;
  subject: string;
  description: string;
  buttonText: string;
  buttonUrl: string;
  title: string;
  userFirstname: string;
  token?: string;
}) {
  const html = await render(
    <EmailTemplate
      appName="LulesMarket"
      description={description}
      buttonText={buttonText}
      buttonUrl={buttonUrl}
      title={title}
      userFirstname={userFirstname}
      token={token}
    />,
  );

  await transporter.sendMail({
    from: env.EMAIL_FROM,
    to,
    subject,
    html,
  });
}

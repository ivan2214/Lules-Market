import { render } from "@react-email/components";
import nodemailer from "nodemailer";
import { EmailTemplate } from "@/app/shared/components/email-template";
import { env } from "@/env";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: env.EMAIL_USER,
    pass: env.EMAIL_PASS,
  },
  secure: true,
});

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

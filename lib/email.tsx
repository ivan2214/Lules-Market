import { render } from "@react-email/components";
import nodemailer from "nodemailer";
import { EmailTemplate } from "@/components/email-template";

export const transporter = nodemailer.createTransport({
	service: "gmail",
	auth: {
		user: process.env.EMAIL_USER,
		pass: process.env.EMAIL_PASS,
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
}: {
	to: string;
	subject: string;
	description: string;
	buttonText: string;
	buttonUrl: string;
	title: string;
	userFirstname: string;
}) {
	const html = await render(
		<EmailTemplate
			appName="LulesMarket"
			description={description}
			buttonText={buttonText}
			buttonUrl={buttonUrl}
			title={title}
			userFirstname={userFirstname}
		/>,
	);

	await transporter.sendMail({
		from: process.env.EMAIL_FROM,
		to,
		subject,
		html,
	});
}

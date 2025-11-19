import {
  Body,
  Button,
  Container,
  Head,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface EmailTemplateProps {
  userFirstname: string;
  appName: string;
  logoUrl?: string;
  title: string;
  description: string;
  buttonText: string;
  buttonUrl: string;
  footerText?: string;
  moreInfoUrl?: string;
}

const baseUrl = process.env.APP_URL;

export const EmailTemplate = ({
  userFirstname,
  appName,
  logoUrl = "https://lules-market-dev.t3.storage.dev/logo.webp",
  title = `${appName} - Notificación`,
  description,
  buttonText,
  buttonUrl,
  footerText = "Feliz día!",
  moreInfoUrl = `${baseUrl}/legal`,
}: EmailTemplateProps) => {
  return (
    <Html>
      <Head />
      <Preview>{title}</Preview>
      <Body style={main}>
        <Container style={container}>
          {logoUrl && (
            <Img
              style={{
                borderRadius: "12px",
              }}
              src={logoUrl}
              width="150"
              alt={`${appName} logo`}
            />
          )}
          <Section>
            <Text style={text}>Hola {userFirstname},</Text>
            <Text style={text}>{description}</Text>
            {buttonText && buttonUrl && (
              <Button style={button} href={buttonUrl}>
                {buttonText}
              </Button>
            )}
            <Text style={text}>
              Para proteger tu cuenta, no reenvíes este correo electrónico.
              Consultá nuestro centro de ayuda para obtener más{" "}
              <Link style={anchor} href={moreInfoUrl}>
                consejos de seguridad
              </Link>
              .
            </Text>
            <Text style={text}>{footerText}</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

EmailTemplate.PreviewProps = {
  userFirstname: "Alan",
  appName: "LulesMarket",
  description:
    "Alguien solicitó recientemente un cambio de contraseña para tu cuenta. Si fuiste vos, podés establecer una nueva contraseña a continuación.",
  buttonText: "Reestablecer contraseña",
  buttonUrl: "https://www.lulesmarket.com/reset",
  footerText: "Gracias por confiar en nosotros!",
} as EmailTemplateProps;

export default EmailTemplate;

// Estilos
const main = {
  backgroundColor: "#f6f9fc",
  padding: "10px 0",
};

const container = {
  backgroundColor: "#ffffff",
  border: "1px solid #f0f0f0",
  padding: "45px",
};

const text = {
  fontSize: "16px",
  fontFamily: "'Open Sans', 'Helvetica Neue', Arial, sans-serif",
  fontWeight: "300",
  color: "#404040",
  lineHeight: "26px",
};

const button = {
  backgroundColor: "#e92932",
  borderRadius: "6px",
  color: "#fff",
  fontFamily: "'Open Sans', 'Helvetica Neue', Arial",
  fontSize: "15px",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  width: "210px",
  padding: "14px 7px",
};

const anchor = {
  textDecoration: "underline",
  color: "#e92932",
};

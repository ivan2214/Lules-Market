import { Section, Text } from "@react-email/components";
import { BaseEmailTemplate } from "./base-email-template";

interface WelcomeEmailProps {
  userFirstname: string;
  appName: string;
  logoUrl?: string;
  dashboardUrl: string;
}

export function WelcomeEmail({
  userFirstname,
  appName,
  logoUrl,
  dashboardUrl,
}: WelcomeEmailProps) {
  return (
    <BaseEmailTemplate
      userFirstname={userFirstname}
      appName={appName}
      logoUrl={logoUrl}
      title={`Bienvenido a ${appName}`}
      description={`¡Gracias por unirte a ${appName}! Estamos emocionados de tenerte con nosotros. Tu cuenta ha sido creada exitosamente y ya puedes comenzar a explorar todo lo que tenemos para ofrecerte.`}
      buttonText="Ir a mi cuenta"
      buttonUrl={dashboardUrl}
      footerText="¡Esperamos que disfrutes tu experiencia!"
      showSecurityWarning={false}
      additionalContent={
        <Section style={featuresSection}>
          <Text style={featuresTitle}>¿Qué puedes hacer ahora?</Text>
          <Text style={featureItem}>
            • Explora nuestro catálogo de productos
          </Text>
          <Text style={featureItem}>• Personaliza tu perfil</Text>
          <Text style={featureItem}>• Guarda tus favoritos</Text>
        </Section>
      }
    />
  );
}

const featuresSection = {
  backgroundColor: "#f9fafb",
  border: "1px solid #e5e7eb",
  borderRadius: "8px",
  padding: "16px 20px",
  marginBottom: "24px",
};

const featuresTitle = {
  fontSize: "14px",
  fontWeight: "600",
  color: "#111827",
  marginBottom: "8px",
};

const featureItem = {
  fontSize: "14px",
  color: "#4b5563",
  margin: "4px 0",
  lineHeight: "20px",
};

WelcomeEmail.PreviewProps = {
  userFirstname: "Carlos",
  appName: "LulesMarket",
  logoUrl: "https://lules-market-dev.t3.storage.dev/logo.webp",
  dashboardUrl: "https://www.lulesmarket.com/dashboard",
};

export default WelcomeEmail;

import { Footer } from "@/shared/components/footer";
import { Navigation } from "@/shared/components/navigation";

export default function ExplorarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="mx-auto flex min-h-screen flex-col">
      <Navigation />
      <main className="container mx-auto px-4 py-16">{children}</main>
      <Footer />
    </section>
  );
}

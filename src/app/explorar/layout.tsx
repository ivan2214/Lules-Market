import { Footer } from "@/shared/components/footer";
import { Navigation } from "@/shared/components/navigation";

export default function ExplorarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="mx-auto flex min-h-screen flex-col">
      <Navigation />
      <section className="lg:p-10">{children}</section>
      <Footer />
    </main>
  );
}

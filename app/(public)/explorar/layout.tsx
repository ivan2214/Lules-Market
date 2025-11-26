export default function ExplorarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="container mx-auto min-h-screen w-full px-4 py-8">
      {children}
    </main>
  );
}

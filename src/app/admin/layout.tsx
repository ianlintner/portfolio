export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-4xl mx-auto p-8">
        {children}
      </main>
    </div>
  );
}

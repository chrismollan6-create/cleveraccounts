export const metadata = {
  title: "Clever Accounts CMS",
  description: "Content management for cleveraccounts.com",
};

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}

import type { Metadata } from 'next';
import '../globals.css';

/**
 * Root layout for print/PDF routes — deliberately chrome-free (no funnel
 * header/footer, no cookie banner, no analytics). These pages are rendered
 * to PDF by headless Chrome, or previewed in the browser during design.
 *
 * Brand theming is NOT set here: each document sets `data-brand` on its own
 * root element, so a single route can render either brand. Both brand fonts
 * are loaded so whichever brand a document selects has its typeface ready.
 */
export const metadata: Metadata = {
  title: 'Onboarding Guide',
  robots: { index: false, follow: false },
};

export default function PdfLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Montserrat+Alternates:wght@400;500;600;700&display=swap"
        />
        <style>{`@page { size: A4; margin: 12mm 0; } @page :first { margin: 0; } html, body { margin: 0; padding: 0; }
          @media screen { body { background: #e2e8f0; padding: 28px 16px; } .onboarding-guide { box-shadow: 0 6px 40px rgba(15,23,42,0.20); border-radius: 2px; } }`}</style>
      </head>
      <body>{children}</body>
    </html>
  );
}

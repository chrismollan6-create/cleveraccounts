import { ReactNode } from "react";

interface FormPageLayoutProps {
  title: string;
  description?: string;
  note?: string;
  children: ReactNode;
}

export default function FormPageLayout({ title, description, note, children }: FormPageLayoutProps) {
  return (
    <>
      <section className="relative overflow-hidden bg-dark py-16 md:py-20">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-primary/20 blur-3xl animate-blob" />
          <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] rounded-full bg-secondary/10 blur-3xl animate-blob animation-delay-2000" />
        </div>
        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-5xl font-black text-white mb-4">{title}</h1>
          {description && (
            <p className="text-lg text-white/70 max-w-2xl mx-auto">{description}</p>
          )}
          {note && (
            <p className="mt-3 text-sm text-secondary font-medium">{note}</p>
          )}
        </div>
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none">
          <svg viewBox="0 0 1440 50" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-12" preserveAspectRatio="none">
            <path d="M0,0 C480,50 960,50 1440,0 L1440,50 L0,50 Z" fill="white" />
          </svg>
        </div>
      </section>

      <section className="bg-white py-10">
        <div className="max-w-4xl mx-auto px-4">
          {children}
        </div>
      </section>
    </>
  );
}

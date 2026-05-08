import Link from 'next/link';
import { CheckCircle2, AlertTriangle, AlertCircle, Download } from 'lucide-react';
import { COMPANY } from '@/lib/constants';

interface Props {
  title: string;
  body: string;
  variant: 'success' | 'warning' | 'error';
  downloadUrl?: string;
}

const ICONS = {
  success: CheckCircle2,
  warning: AlertTriangle,
  error: AlertCircle,
};

const COLORS = {
  success: 'text-emerald-600 bg-emerald-50',
  warning: 'text-amber-600 bg-amber-50',
  error: 'text-rose-600 bg-rose-50',
};

export default function LetterStateMessage({ title, body, variant, downloadUrl }: Props) {
  const Icon = ICONS[variant];

  return (
    <main className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-lg w-full bg-white rounded-2xl shadow-md border border-gray-100 p-8 sm:p-10">
        <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-6 ${COLORS[variant]}`}>
          <Icon size={28} />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-text mb-3">{title}</h1>
        <p className="text-text-light leading-relaxed mb-6">{body}</p>

        {downloadUrl && (
          <a
            href={downloadUrl}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-primary text-white font-semibold hover:bg-primary-dark transition-colors"
          >
            <Download size={18} />
            Download signed copy
          </a>
        )}

        <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col sm:flex-row gap-2 sm:gap-4 text-sm text-text-light">
          <span>Need help?</span>
          <a className="text-primary hover:underline" href={`mailto:${COMPANY.email}`}>
            {COMPANY.email}
          </a>
          <span className="text-gray-300 hidden sm:inline">·</span>
          <a className="text-primary hover:underline" href={`tel:${COMPANY.phone.replace(/\s/g, '')}`}>
            {COMPANY.phone}
          </a>
        </div>

        <div className="mt-6 text-xs text-text-light">
          <Link href="/" className="hover:text-primary transition-colors">
            ← Back to cleveraccounts.com
          </Link>
        </div>
      </div>
    </main>
  );
}

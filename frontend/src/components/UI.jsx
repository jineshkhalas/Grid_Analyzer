import { fmt } from '../services/validation.js';

export function Card({ title, subtitle, action, children, className = '' }) {
  return (
    <section className={`rounded-lg border border-grid-200 bg-white ${className}`}>
      {(title || action) && (
        <header className="flex flex-wrap items-center justify-between gap-2 border-b border-grid-100 px-4 py-3">
          <div>
            <h2 className="text-base font-semibold">{title}</h2>
            {subtitle && <p className="text-sm text-slate-600">{subtitle}</p>}
          </div>
          {action}
        </header>
      )}
      <div className="p-4">{children}</div>
    </section>
  );
}

const variants = {
  primary: 'bg-grid-600 text-white hover:bg-grid-700 disabled:bg-slate-300',
  secondary: 'border border-grid-200 bg-white text-ink hover:bg-grid-50 disabled:text-slate-400',
  danger: 'border border-red-300 bg-white text-red-700 hover:bg-red-50 disabled:text-slate-400',
};

export function Button({ variant = 'secondary', className = '', ...props }) {
  return (
    <button
      type="button"
      className={`inline-flex items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium disabled:cursor-not-allowed ${variants[variant]} ${className}`}
      {...props}
    />
  );
}

const badgeStyles = {
  normal: 'bg-emerald-100 text-emerald-900',
  warning: 'bg-amber-100 text-amber-900',
  overloaded: 'bg-red-100 text-red-900',
  out: 'bg-slate-200 text-slate-700',
  info: 'bg-grid-100 text-grid-900',
};
const badgeText = { normal: 'Normal', warning: 'Near limit', overloaded: 'Overloaded', out: 'Out of service' };

export function Badge({ status = 'info', children }) {
  return (
    <span className={`inline-block rounded px-2 py-0.5 text-xs font-semibold ${badgeStyles[status] || badgeStyles.info}`}>
      {children || badgeText[status] || status}
    </span>
  );
}

export function Field({ label, id, hint, children }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-medium">{label}</label>
      {children}
      {hint && <p className="mt-1 text-xs text-slate-600">{hint}</p>}
    </div>
  );
}

export const inputClass =
  'w-full rounded-md border border-slate-300 bg-white px-2 py-1.5 text-sm num focus:border-grid-600';

export function Spinner({ label = 'Loading...' }) {
  return (
    <div role="status" className="flex items-center gap-2 py-6 text-sm text-slate-600">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-grid-200 border-t-grid-600" />
      {label}
    </div>
  );
}

export function EmptyState({ title, children, action }) {
  return (
    <div className="rounded-lg border border-dashed border-grid-200 bg-grid-50 px-4 py-8 text-center">
      <p className="font-semibold">{title}</p>
      {children && <p className="mx-auto mt-1 max-w-md text-sm text-slate-600">{children}</p>}
      {action && <div className="mt-3">{action}</div>}
    </div>
  );
}

export function ErrorBox({ title = 'Something went wrong', children }) {
  if (!children) return null;
  return (
    <div role="alert" className="rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-900">
      <p className="font-semibold">{title}</p>
      <div className="mt-0.5">{children}</div>
    </div>
  );
}

export function Notice({ tone = 'info', children }) {
  const tones = {
    info: 'border-grid-200 bg-grid-50 text-grid-900',
    warn: 'border-amber-300 bg-amber-50 text-amber-900',
    ok: 'border-emerald-300 bg-emerald-50 text-emerald-900',
  };
  return <div className={`rounded-md border px-3 py-2 text-sm ${tones[tone]}`}>{children}</div>;
}

export function Stat({ label, value, tone }) {
  const color = tone === 'bad' ? 'text-red-700' : tone === 'good' ? 'text-emerald-700' : 'text-ink';
  return (
    <div className="rounded-lg border border-grid-200 bg-white px-4 py-3">
      <p className="text-sm text-slate-600">{label}</p>
      <p className={`num text-2xl font-semibold ${color}`}>{value}</p>
    </div>
  );
}

export function Disclosure({ title, children, defaultOpen = false }) {
  return (
    <details open={defaultOpen} className="group rounded-md border border-grid-200 bg-white">
      <summary className="cursor-pointer select-none rounded-md px-3 py-2 text-sm font-semibold hover:bg-grid-50">
        {title}
      </summary>
      <div className="border-t border-grid-100 p-3">{children}</div>
    </details>
  );
}

export function LoadingBar({ pct, status }) {
  const color = status === 'overloaded' ? 'bg-red-600' : status === 'warning' ? 'bg-amber-500' : 'bg-emerald-600';
  return (
    <div className="flex items-center gap-2">
      <div className="h-2 w-20 overflow-hidden rounded bg-slate-200" aria-hidden="true">
        <div className={`h-full ${color}`} style={{ width: `${Math.min(pct, 100)}%` }} />
      </div>
      <span className="num w-14 text-right">{fmt(pct, 1)}%</span>
    </div>
  );
}

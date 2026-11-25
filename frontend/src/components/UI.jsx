import { fmt } from '../services/validation.js';

export function Card({ title, subtitle, action, children, className = '' }) {
  return (
    <section className={`rounded-lg border border-line bg-panel ${className}`}>
      {(title || action) && (
        <header className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-4 py-3">
          <div>
            <h2 className="text-base font-semibold">{title}</h2>
            {subtitle && <p className="text-sm text-muted">{subtitle}</p>}
          </div>
          {action}
        </header>
      )}
      <div className="p-4">{children}</div>
    </section>
  );
}

const variants = {
  primary: 'border-transparent bg-accent text-inset enabled:hover:bg-accent-hover disabled:border-line disabled:bg-raised disabled:text-muted',
  secondary: 'border-line bg-panel text-ink enabled:hover:border-muted enabled:hover:bg-raised disabled:text-muted',
  danger: 'border-red-400/30 bg-transparent text-red-300 enabled:hover:border-red-400/50 enabled:hover:bg-red-400/10 disabled:text-muted',
};

export function Button({ variant = 'secondary', className = '', ...props }) {
  return (
    <button
      type="button"
      className={`inline-flex items-center justify-center gap-1.5 rounded-md border px-3 py-1.5 text-sm font-medium motion-safe:transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${className}`}
      {...props}
    />
  );
}

const badgeStyles = {
  normal: 'border-emerald-400/25 bg-emerald-400/10 text-emerald-300',
  warning: 'border-amber-400/25 bg-amber-400/10 text-amber-300',
  overloaded: 'border-red-400/25 bg-red-400/10 text-red-300',
  out: 'border-line bg-inset text-muted',
  info: 'border-line bg-raised text-ink',
};
const badgeText = { normal: 'Normal', warning: 'Near limit', overloaded: 'Overloaded', out: 'Out of service' };

export function Badge({ status = 'info', children }) {
  return (
    <span className={`inline-block rounded border px-2 py-0.5 text-xs font-medium ${badgeStyles[status] || badgeStyles.info}`}>
      {children || badgeText[status] || status}
    </span>
  );
}

export function Field({ label, id, hint, children }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-medium">{label}</label>
      {children}
      {hint && <p className="mt-1 text-xs text-muted">{hint}</p>}
    </div>
  );
}

export const inputClass =
  'w-full rounded-md border border-line bg-inset px-2 py-1.5 text-sm tabular-nums text-ink placeholder:text-muted motion-safe:transition-colors hover:border-muted focus:border-accent';

export function Spinner({ label = 'Loading...' }) {
  return (
    <div role="status" className="flex items-center gap-2 py-6 text-sm text-muted">
      <span className="h-4 w-4 rounded-full border-2 border-line border-t-accent motion-safe:animate-spin" />
      {label}
    </div>
  );
}

export function EmptyState({ title, children, action }) {
  return (
    <div className="rounded-lg border border-dashed border-line bg-inset px-4 py-8 text-center">
      <p className="font-semibold">{title}</p>
      {children && <p className="mx-auto mt-1 max-w-md text-sm text-muted">{children}</p>}
      {action && <div className="mt-3">{action}</div>}
    </div>
  );
}

export function ErrorBox({ title = 'Something went wrong', children }) {
  if (!children) return null;
  return (
    <div role="alert" className="rounded-md border border-red-400/30 bg-red-400/10 px-3 py-2 text-sm text-red-200">
      <p className="font-semibold">{title}</p>
      <div className="mt-0.5">{children}</div>
    </div>
  );
}

export function Notice({ tone = 'info', children }) {
  const tones = {
    info: 'border-line bg-raised text-ink',
    warn: 'border-amber-400/25 bg-amber-400/5 text-amber-200',
    ok: 'border-emerald-400/25 bg-emerald-400/5 text-emerald-200',
  };
  return <div className={`rounded-md border px-3 py-2 text-sm ${tones[tone]}`}>{children}</div>;
}

export function Stat({ label, value, tone }) {
  const color = tone === 'bad' ? 'text-red-300' : tone === 'good' ? 'text-emerald-300' : 'text-ink';
  return (
    <div className="rounded-lg border border-line bg-panel px-4 py-3">
      <p className="text-sm text-muted">{label}</p>
      <p className={`text-2xl font-semibold tabular-nums ${color}`}>{value}</p>
    </div>
  );
}

export function Disclosure({ title, children, defaultOpen = false }) {
  return (
    <details open={defaultOpen} className="rounded-md border border-line bg-panel">
      <summary className="cursor-pointer select-none rounded-md px-3 py-2 text-sm font-semibold marker:text-muted hover:bg-raised">
        {title}
      </summary>
      <div className="border-t border-line p-3">{children}</div>
    </details>
  );
}

export function LoadingBar({ pct, status }) {
  const color = status === 'overloaded' ? 'bg-red-600' : status === 'warning' ? 'bg-amber-500' : 'bg-emerald-600';
  return (
    <div className="flex items-center gap-2">
      <div className="h-2 w-20 overflow-hidden rounded bg-raised" aria-hidden="true">
        <div className={`h-full ${color}`} style={{ width: `${Math.min(pct, 100)}%` }} />
      </div>
      <span className="w-14 text-right tabular-nums">{fmt(pct, 1)}%</span>
    </div>
  );
}

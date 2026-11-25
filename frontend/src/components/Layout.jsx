import { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { storageMode } from '../services/storage.js';
import { useGrid } from '../context/GridContext.jsx';

const links = [
  { to: '/', label: 'Dashboard', end: true },
  { to: '/editor', label: 'Grid editor' },
  { to: '/analysis', label: 'Analysis' },
  { to: '/history', label: 'Saved results' },
];

export default function Layout() {
  const [open, setOpen] = useState(false);
  const { grid, dirty } = useGrid();
  const location = useLocation();
  useEffect(() => setOpen(false), [location.pathname]);

  const nav = (
    <nav aria-label="Main" className="flex flex-col gap-1">
      {links.map((l) => (
        <NavLink
          key={l.to}
          to={l.to}
          end={l.end}
          className={({ isActive }) =>
            `rounded-r-md border-l-2 px-3 py-2 text-sm font-medium motion-safe:transition-colors ${isActive ? 'border-accent bg-raised text-ink' : 'border-transparent text-muted hover:bg-panel hover:text-ink'}`
          }
        >
          {l.label}
        </NavLink>
      ))}
    </nav>
  );

  return (
    <div className="flex min-h-full flex-col md:flex-row">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-50 focus:rounded focus:bg-panel focus:p-2 focus:text-ink">Skip to content</a>

      <header className="flex items-center justify-between border-b border-line bg-inset px-4 py-3 md:hidden">
        <span className="font-semibold">Grid Analyzer</span>
        <button
          type="button" aria-expanded={open} aria-controls="mobile-nav"
          onClick={() => setOpen((o) => !o)}
          className="rounded border border-line px-3 py-1 text-sm hover:bg-raised"
        >
          {open ? 'Close' : 'Menu'}
        </button>
      </header>
      {open && <div id="mobile-nav" className="border-b border-line bg-inset p-3 md:hidden">{nav}</div>}

      <aside className="hidden w-60 shrink-0 flex-col border-r border-line bg-inset p-4 md:flex">
        <p className="text-lg font-semibold">Grid Analyzer</p>
        <p className="mb-5 text-xs text-muted">DC power flow &amp; contingency</p>
        {nav}
        <div className="mt-auto space-y-1 border-t border-line pt-3 text-xs text-muted">
          <p>Editing: <span className="font-medium text-ink">{grid.name}</span>{dirty && ' (unsaved)'}</p>
          <p>
            Storage:{' '}
            <span className="font-medium text-ink">{storageMode === 'firestore' ? 'Firebase Firestore' : 'Demo mode (this browser)'}</span>
          </p>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <main id="main" className="mx-auto w-full max-w-6xl flex-1 space-y-5 p-4 md:p-6">
          <Outlet />
        </main>
        <footer className="border-t border-line bg-inset px-4 py-3 text-xs text-muted">
          Educational DC power-flow approximation. Not a real operational power-grid control or safety system.
          Values are per-unit on one common system base.
        </footer>
      </div>
    </div>
  );
}

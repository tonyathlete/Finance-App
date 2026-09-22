import React, { useState, type ReactNode } from 'react';
import { useApp } from '@/context/AppContext';
import { useRouter } from '@/lib/router';
import { BrandMark } from './Brand';

interface NavItem {
  label: string;
  icon: string;
  path: string;
}

const clientNav: NavItem[] = [
  { label: 'Accueil', icon: 'fa-house', path: '/client' },
  { label: 'Budget', icon: 'fa-wallet', path: '/client/budget' },
  { label: 'Objectifs', icon: 'fa-bullseye', path: '/client/objectifs' },
  { label: 'Dettes', icon: 'fa-hand-holding-dollar', path: '/client/dettes' },
  { label: 'Valeur nette', icon: 'fa-scale-balanced', path: '/client/valeur-nette' },
  { label: 'Retraite', icon: 'fa-umbrella-beach', path: '/client/retraite' },
  { label: 'Check-in', icon: 'fa-calendar-check', path: '/client/checkin' },
  { label: 'Assurances', icon: 'fa-shield-halved', path: '/client/assurances' },
  { label: 'Mon profil', icon: 'fa-user', path: '/client/profil' },
];

const advisorNav: NavItem[] = [
  { label: 'Tableau de bord', icon: 'fa-chart-line', path: '/conseiller' },
  { label: 'Clients', icon: 'fa-users', path: '/conseiller/clients' },
  { label: 'Suivis & relances', icon: 'fa-bell', path: '/conseiller/suivis' },
  { label: 'Mon cabinet', icon: 'fa-briefcase', path: '/conseiller/cabinet' },
];

export const Layout: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { state, logout, currentClient } = useApp();
  const { path, navigate } = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isAdvisor = state.role === 'advisor';
  const nav = isAdvisor ? advisorNav : clientNav;

  const isActive = (p: string) => {
    if (p === '/client' || p === '/conseiller') return path === p;
    return path.startsWith(p);
  };

  const name = isAdvisor
    ? state.advisor.fullName
    : currentClient
    ? `${currentClient.firstName} ${currentClient.lastName}`
    : '';

  return (
    <div className="min-h-screen flex bg-paper-50">
      {/* Sidebar desktop */}
      <aside className="hidden lg:flex w-64 flex-col bg-forest-800 text-paper-100 fixed inset-y-0">
        <Brand />
        <nav className="flex-1 px-3 space-y-1 mt-2">
          {nav.map((n) => (
            <button
              key={n.path}
              onClick={() => navigate(n.path)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                isActive(n.path)
                  ? 'bg-forest-600 text-white shadow-sm'
                  : 'text-forest-100/80 hover:bg-forest-700 hover:text-white'
              }`}
            >
              <i className={`fas ${n.icon} w-5 text-center`} />
              {n.label}
            </button>
          ))}
        </nav>
        <div className="p-3 border-t border-forest-700">
          <div className="flex items-center gap-2 px-2 py-2 text-sm">
            <span className="w-8 h-8 rounded-full bg-gold-400 text-forest-900 flex items-center justify-center text-xs font-bold">
              {isAdvisor ? 'CSF' : name.split(' ').map((x) => x[0]).slice(0, 2).join('')}
            </span>
            <div className="min-w-0">
              <p className="truncate font-medium text-white">{name}</p>
              <p className="text-xs text-forest-100/60">
                {isAdvisor ? 'Espace conseiller' : 'Espace client'}
              </p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center gap-2 px-3 py-2 mt-1 rounded-xl text-sm text-forest-100/70 hover:bg-forest-700 hover:text-white transition"
          >
            <i className="fas fa-arrow-right-from-bracket w-5 text-center" />
            Quitter
          </button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 inset-x-0 z-30 bg-forest-800 text-white flex items-center justify-between px-4 h-14">
        <div className="flex items-center gap-2">
          <BrandMark size={28} />
          <span className="font-display font-semibold">Boussole<span className="text-gold-400">·</span></span>
        </div>
        <button onClick={() => setMobileOpen((o) => !o)} className="p-2">
          <i className={`fas ${mobileOpen ? 'fa-times' : 'fa-bars'}`} />
        </button>
      </div>

      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-20 pt-14 bg-forest-800 text-paper-100">
          <nav className="px-4 py-4 space-y-1">
            {nav.map((n) => (
              <button
                key={n.path}
                onClick={() => {
                  navigate(n.path);
                  setMobileOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium ${
                  isActive(n.path) ? 'bg-forest-600 text-white' : 'text-forest-100/80'
                }`}
              >
                <i className={`fas ${n.icon} w-5 text-center`} />
                {n.label}
              </button>
            ))}
            <button
              onClick={() => {
                logout();
                setMobileOpen(false);
              }}
              className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm text-forest-100/70"
            >
              <i className="fas fa-arrow-right-from-bracket w-5 text-center" />
              Quitter
            </button>
          </nav>
        </div>
      )}

      {/* Contenu */}
      <main className="flex-1 lg:ml-64 pt-14 lg:pt-0 flex flex-col">
        <div key={path} className="max-w-5xl mx-auto w-full px-4 sm:px-6 py-6 lg:py-10 animate-fadeIn flex-1">
          {children}
        </div>
        <footer className="max-w-5xl mx-auto w-full px-4 sm:px-6 py-6 mt-4 border-t border-paper-200 flex items-center justify-between text-xs text-forest-400 no-print">
          <span>© {new Date().getFullYear()} Boussole · Outil éducatif — ne constitue pas un conseil financier.</span>
          <button onClick={() => navigate('/mentions')} className="underline hover:text-forest-700">Mentions légales</button>
        </footer>
      </main>
    </div>
  );
};

const Brand: React.FC = () => (
  <div className="px-5 py-6 flex items-center gap-3">
    <BrandMark size={40} />
    <div>
      <p className="font-display font-semibold text-white leading-tight">Boussole<span className="text-gold-400">·</span></p>
      <p className="text-xs text-forest-100/60">Accompagnement financier</p>
    </div>
  </div>
);

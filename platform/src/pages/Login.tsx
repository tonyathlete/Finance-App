import React from 'react';
import { useApp } from '@/context/AppContext';
import { useRouter } from '@/lib/router';
import { BrandLockup } from '@/components/Brand';

export const Login: React.FC = () => {
  const { state, loginAsAdvisor, loginAsClient } = useApp();
  const { navigate } = useRouter();

  const enterAdvisor = () => { loginAsAdvisor(); navigate('/conseiller'); };
  const enterClient = (id: string) => { loginAsClient(id); navigate('/client'); };

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-2">
      {/* Colonne héro */}
      <div className="relative bg-gradient-to-br from-forest-700 via-forest-800 to-forest-950 text-paper-50 px-6 sm:px-10 py-10 lg:py-16 flex flex-col overflow-hidden">
        <div className="absolute -right-16 -top-16 w-72 h-72 rounded-full bg-gold-400/10 blur-3xl" />
        <div className="absolute right-24 bottom-10 w-40 h-40 rounded-full bg-forest-400/10 blur-2xl" />
        <div className="relative">
          <BrandLockup tone="light" />
        </div>
        <div className="relative flex-1 flex flex-col justify-center max-w-md mt-10 lg:mt-0">
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-gold-300 mb-4">
            <span className="w-6 h-px bg-gold-300" /> Version brouillon
          </span>
          <h1 className="font-display text-4xl sm:text-5xl font-semibold leading-tight">
            Vos finances,<br />enfin claires.
          </h1>
          <p className="text-forest-100/80 mt-4 text-lg">
            Un budget simple, des objectifs qui avancent, et un accompagnement humain
            semaine après semaine.
          </p>
          <ul className="mt-8 space-y-3">
            {[
              ['fa-wallet', 'Budget clair et règle 50/30/20'],
              ['fa-hand-holding-dollar', 'Plan pour rembourser vos dettes plus vite'],
              ['fa-bullseye', 'Objectifs : voyage, retraite, fonds d’urgence'],
              ['fa-calendar-check', 'Check-in hebdomadaire avec votre conseiller'],
            ].map(([icon, text]) => (
              <li key={text} className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-gold-300">
                  <i className={`fas ${icon}`} />
                </span>
                <span className="text-forest-50/90">{text}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="relative mt-10 text-xs text-forest-100/50">
          © {new Date().getFullYear()} · Conçu pour être conforme aux attentes de l'AMF et à la Loi 25
        </div>
      </div>

      {/* Colonne accès */}
      <div className="px-6 sm:px-10 py-10 lg:py-16 flex flex-col justify-center">
        <div className="max-w-md w-full mx-auto space-y-6">
          <div>
            <h2 className="font-display text-2xl font-semibold text-forest-900">Choisir un espace</h2>
            <p className="text-forest-500 text-sm mt-1">
              Deux clients de démonstration sont préconfigurés. Les données restent dans votre navigateur.
            </p>
          </div>

          {/* Conseiller */}
          <button
            onClick={enterAdvisor}
            className="w-full flex items-center gap-4 p-4 rounded-2xl bg-forest-600 text-white hover:bg-forest-700 transition shadow-card text-left group"
          >
            <span className="w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center">
              <i className="fas fa-user-tie text-lg" />
            </span>
            <span className="flex-1">
              <span className="block font-semibold">Espace conseiller</span>
              <span className="block text-sm text-forest-100/80">Vue d'ensemble, clients, suivis et relances</span>
            </span>
            <i className="fas fa-arrow-right group-hover:translate-x-1 transition-transform" />
          </button>

          {/* Clients */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-forest-400 mb-2">Espace client (démo)</p>
            <div className="space-y-2">
              {state.clients.map((c) => (
                <button
                  key={c.id}
                  onClick={() => enterClient(c.id)}
                  className="w-full flex items-center gap-3 p-3 rounded-xl border border-paper-200 bg-white hover:border-forest-300 hover:shadow-card transition text-left group"
                >
                  <span className="w-10 h-10 rounded-full bg-gold-100 text-gold-700 flex items-center justify-center text-sm font-semibold">
                    {c.firstName[0]}{c.lastName[0]}
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="block font-medium text-forest-900">{c.firstName} {c.lastName}</span>
                    <span className="block text-xs text-forest-400 truncate">{c.situation}</span>
                  </span>
                  <i className="fas fa-chevron-right text-forest-300 group-hover:text-forest-500" />
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between text-xs text-forest-400">
            <span className="flex items-center gap-1"><i className="fas fa-lock" /> Aucune donnée sensible collectée</span>
            <button onClick={() => navigate('/mentions')} className="underline hover:text-forest-700">
              Mentions légales
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

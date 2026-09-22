import React from 'react';
import { useApp } from '@/context/AppContext';
import { useRouter } from '@/lib/router';
import { Card, Button } from '@/components/ui';
import { Disclaimer } from '@/components/Compliance';

export const Login: React.FC = () => {
  const { state, loginAsAdvisor, loginAsClient } = useApp();
  const { navigate } = useRouter();

  const enterAdvisor = () => {
    loginAsAdvisor();
    navigate('/conseiller');
  };
  const enterClient = (id: string) => {
    loginAsClient(id);
    navigate('/client');
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Bandeau héro */}
      <header className="bg-forest-800 text-paper-50">
        <div className="max-w-4xl mx-auto px-6 py-10 flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gold-400 text-forest-900 flex items-center justify-center">
            <i className="fas fa-leaf text-lg" />
          </div>
          <div>
            <p className="font-display text-xl font-semibold">Plateforme d'accompagnement financier</p>
            <p className="text-sm text-forest-100/70">Budget · Objectifs · Suivis hebdomadaires</p>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-10 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h1 className="font-display text-3xl font-semibold text-forest-900">
            Bienvenue — version brouillon
          </h1>
          <p className="text-forest-500">
            Choisissez un espace pour explorer la démo. Deux clients fictifs sont déjà
            configurés. Les données sont enregistrées localement dans votre navigateur.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Espace conseiller */}
          <Card className="p-6 flex flex-col">
            <div className="w-12 h-12 rounded-xl bg-forest-600 text-white flex items-center justify-center mb-4">
              <i className="fas fa-user-tie text-lg" />
            </div>
            <h2 className="font-display text-xl font-semibold text-forest-900">Espace conseiller</h2>
            <p className="text-sm text-forest-500 mt-1 flex-1">
              Réservé à vous. Vue d'ensemble de vos clients, budgets, objectifs, et gestion
              des suivis et relances hebdomadaires.
            </p>
            <Button className="mt-4 w-full" icon="fa-arrow-right" onClick={enterAdvisor}>
              Entrer comme conseiller
            </Button>
          </Card>

          {/* Espace client */}
          <Card className="p-6 flex flex-col">
            <div className="w-12 h-12 rounded-xl bg-gold-400 text-forest-900 flex items-center justify-center mb-4">
              <i className="fas fa-user text-lg" />
            </div>
            <h2 className="font-display text-xl font-semibold text-forest-900">Espace client</h2>
            <p className="text-sm text-forest-500 mt-1">
              Ce que vos clients voient : leur budget, leurs objectifs, leur check-in
              hebdomadaire et le récap de leurs assurances.
            </p>
            <div className="mt-4 space-y-2">
              {state.clients.map((c) => (
                <button
                  key={c.id}
                  onClick={() => enterClient(c.id)}
                  className="w-full flex items-center gap-3 p-3 rounded-xl border border-paper-200 hover:border-forest-300 hover:bg-forest-50 transition text-left"
                >
                  <span className="w-9 h-9 rounded-full bg-forest-100 text-forest-700 flex items-center justify-center text-sm font-semibold">
                    {c.firstName[0]}
                    {c.lastName[0]}
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="block font-medium text-forest-900">
                      {c.firstName} {c.lastName}
                    </span>
                    <span className="block text-xs text-forest-400 truncate">{c.situation}</span>
                  </span>
                  <i className="fas fa-chevron-right text-forest-300" />
                </button>
              ))}
            </div>
          </Card>
        </div>

        <Disclaimer />
      </main>

      <footer className="border-t border-paper-200 py-6">
        <p className="text-center text-xs text-forest-400">
          © {new Date().getFullYear()} — Brouillon de plateforme · Conçu pour être conforme
          aux attentes de l'AMF et à la Loi 25
        </p>
      </footer>
    </div>
  );
};

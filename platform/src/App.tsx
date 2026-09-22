import React from 'react';
import { useApp } from '@/context/AppContext';
import { useRouter, segments } from '@/lib/router';
import { Layout } from '@/components/Layout';
import { Login } from '@/pages/Login';
import { AuthLogin } from '@/pages/AuthLogin';
import { Legal } from '@/pages/Legal';
import { Onboarding } from '@/pages/client/Onboarding';
import { BrandMark } from '@/components/Brand';

// Client
import { ClientDashboard } from '@/pages/client/ClientDashboard';
import { Budget } from '@/pages/client/Budget';
import { Goals } from '@/pages/client/Goals';
import { Debts } from '@/pages/client/Debts';
import { NetWorth } from '@/pages/client/NetWorth';
import { Retirement } from '@/pages/client/Retirement';
import { CheckIn } from '@/pages/client/CheckIn';
import { Insurance } from '@/pages/client/Insurance';
import { Profile } from '@/pages/client/Profile';

// Conseiller
import { AdvisorDashboard } from '@/pages/advisor/AdvisorDashboard';
import { ClientList } from '@/pages/advisor/ClientList';
import { ClientDetail } from '@/pages/advisor/ClientDetail';
import { FollowUps } from '@/pages/advisor/FollowUps';
import { Cabinet } from '@/pages/advisor/Cabinet';

const App: React.FC = () => {
  const { state, currentClient, mode, ready, authEmail } = useApp();
  const { path } = useRouter();
  const seg = segments(path);

  // Page publique : mentions légales (accessible sans connexion)
  if (seg[0] === 'mentions') {
    return <Legal onBack={() => (window.location.hash = state.role ? (state.role === 'advisor' ? '/conseiller' : '/client') : '/')} />;
  }

  // Chargement (mode Supabase : récupération de la session / de l'espace)
  if (!ready) return <LoadingScreen />;

  // Mode Supabase : authentification requise
  if (mode === 'supabase' && !authEmail) return <AuthLogin />;

  // Mode démo : sélection de l'espace
  if (!state.role) return <Login />;

  // Espace conseiller
  if (state.role === 'advisor') {
    let page: React.ReactNode;
    if (seg[0] !== 'conseiller') page = <AdvisorDashboard />;
    else if (seg[1] === 'clients') page = <ClientList />;
    else if (seg[1] === 'client' && seg[2]) page = <ClientDetail clientId={seg[2]} />;
    else if (seg[1] === 'suivis') page = <FollowUps />;
    else if (seg[1] === 'cabinet') page = <Cabinet />;
    else page = <AdvisorDashboard />;
    return <Layout>{page}</Layout>;
  }

  // Espace client
  if (!currentClient) return <Login />;

  // Parcours de démarrage (plein écran, hors Layout)
  const isNewClient =
    currentClient.incomes.length === 0 &&
    currentClient.budget.length === 0 &&
    currentClient.goals.length === 0;
  if (seg[1] === 'demarrage' || (seg.length < 2 && isNewClient)) {
    return <Onboarding />;
  }

  let page: React.ReactNode;
  if (seg[0] !== 'client') page = <ClientDashboard />;
  else if (seg[1] === 'budget') page = <Budget />;
  else if (seg[1] === 'objectifs') page = <Goals />;
  else if (seg[1] === 'dettes') page = <Debts />;
  else if (seg[1] === 'valeur-nette') page = <NetWorth />;
  else if (seg[1] === 'retraite') page = <Retirement />;
  else if (seg[1] === 'checkin') page = <CheckIn />;
  else if (seg[1] === 'assurances') page = <Insurance />;
  else if (seg[1] === 'profil') page = <Profile />;
  else page = <ClientDashboard />;
  return <Layout>{page}</Layout>;
};

const LoadingScreen: React.FC = () => (
  <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-paper-50">
    <BrandMark size={48} />
    <p className="text-forest-500 text-sm animate-pulse">Chargement de votre espace…</p>
  </div>
);

export default App;

import React from 'react';
import { useApp } from '@/context/AppContext';
import { useRouter, segments } from '@/lib/router';
import { Layout } from '@/components/Layout';
import { Login } from '@/pages/Login';

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
  const { state, currentClient } = useApp();
  const { path } = useRouter();
  const seg = segments(path);

  // Pas connecté → écran de connexion
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

export default App;

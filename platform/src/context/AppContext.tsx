import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { AppState, Client, Role, AdvisorProfile } from '@/types';
import { seedState } from '@/data/seed';

const STORAGE_KEY = 'csf_platform_state_v1';

function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as AppState;
      // Fusion douce pour tolérer les évolutions de schéma
      return { ...seedState, ...parsed, advisor: { ...seedState.advisor, ...parsed.advisor } };
    }
  } catch {
    /* ignore */
  }
  return seedState;
}

interface AppContextValue {
  state: AppState;
  // session
  loginAsAdvisor: () => void;
  loginAsClient: (clientId: string) => void;
  logout: () => void;
  // helpers
  currentClient: Client | null;
  getClient: (id: string) => Client | undefined;
  // mutations
  updateClient: (id: string, updater: (c: Client) => Client) => void;
  addClient: (c: Client) => void;
  updateAdvisor: (updater: (a: AdvisorProfile) => AdvisorProfile) => void;
  resetDemo: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>(loadState);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* quota / mode privé : on ignore */
    }
  }, [state]);

  const value = useMemo<AppContextValue>(() => {
    const getClient = (id: string) => state.clients.find((c) => c.id === id);

    return {
      state,
      loginAsAdvisor: () => setState((s) => ({ ...s, role: 'advisor', currentUserId: null })),
      loginAsClient: (clientId: string) =>
        setState((s) => ({ ...s, role: 'client', currentUserId: clientId })),
      logout: () => setState((s) => ({ ...s, role: null, currentUserId: null })),
      currentClient: state.currentUserId ? getClient(state.currentUserId) || null : null,
      getClient,
      updateClient: (id, updater) =>
        setState((s) => ({
          ...s,
          clients: s.clients.map((c) => (c.id === id ? updater(c) : c)),
        })),
      addClient: (c) => setState((s) => ({ ...s, clients: [...s.clients, c] })),
      updateAdvisor: (updater) =>
        setState((s) => ({ ...s, advisor: updater(s.advisor) })),
      resetDemo: () => {
        localStorage.removeItem(STORAGE_KEY);
        setState({ ...seedState });
      },
    };
  }, [state]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = (): AppContextValue => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp doit être utilisé dans AppProvider');
  return ctx;
};

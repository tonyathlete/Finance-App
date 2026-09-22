import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import type { AppState, Client, Role, AdvisorProfile } from '@/types';
import { seedState } from '@/data/seed';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

const STORAGE_KEY = 'csf_platform_state_v1';

// Portion persistée dans Supabase (le rôle et le client courant restent locaux)
interface Workspace {
  advisor: AdvisorProfile;
  clients: Client[];
}

const normalizeClients = (clients: Client[] = []): Client[] =>
  clients.map((c) => ({ ...c, debts: c.debts ?? [], assets: c.assets ?? [] }));

function loadLocal(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as AppState;
      const merged = { ...seedState, ...parsed, advisor: { ...seedState.advisor, ...parsed.advisor } };
      merged.clients = normalizeClients(merged.clients);
      return merged;
    }
  } catch {
    /* ignore */
  }
  return seedState;
}

interface AppContextValue {
  state: AppState;
  mode: 'demo' | 'supabase';
  ready: boolean;
  authEmail: string | null;
  // session
  loginAsAdvisor: () => void;
  loginAsClient: (clientId: string) => void;
  logout: () => void;
  // auth (mode Supabase)
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string) => Promise<{ error: string | null }>;
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

const emptyState: AppState = { advisor: seedState.advisor, clients: [], currentUserId: null, role: null };

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const demo = !isSupabaseConfigured;
  const [state, setState] = useState<AppState>(() => (demo ? loadLocal() : emptyState));
  const [ready, setReady] = useState<boolean>(demo);
  const [authEmail, setAuthEmail] = useState<string | null>(null);
  const ownerId = useRef<string | null>(null);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // --- Mode démo : persistance locale --------------------------------------
  useEffect(() => {
    if (!demo) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* quota / navigation privée */
    }
  }, [state, demo]);

  // --- Mode Supabase : session + chargement --------------------------------
  useEffect(() => {
    if (demo || !supabase) return;
    let active = true;

    const handleSession = async (userId: string | null, email: string | null) => {
      ownerId.current = userId;
      setAuthEmail(email);
      if (!userId) {
        if (active) { setReady(true); }
        return;
      }
      const { data } = await supabase!
        .from('workspaces')
        .select('data')
        .eq('owner_id', userId)
        .maybeSingle();

      let ws = data?.data as Workspace | undefined;
      if (!ws) {
        ws = { advisor: { ...seedState.advisor, email: email ?? '' }, clients: [] };
        await supabase!.from('workspaces').upsert({ owner_id: userId, data: ws });
      }
      if (!active) return;
      setState({
        advisor: { ...seedState.advisor, ...ws.advisor },
        clients: normalizeClients(ws.clients),
        role: 'advisor',
        currentUserId: null,
      });
      setReady(true);
    };

    supabase.auth.getSession().then(({ data }) => {
      handleSession(data.session?.user?.id ?? null, data.session?.user?.email ?? null);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      handleSession(session?.user?.id ?? null, session?.user?.email ?? null);
    });
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, [demo]);

  // --- Mode Supabase : sauvegarde (anti-rebond) ----------------------------
  useEffect(() => {
    if (demo || !supabase || !ownerId.current || !ready) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      supabase!
        .from('workspaces')
        .upsert({ owner_id: ownerId.current, data: { advisor: state.advisor, clients: state.clients } })
        .then(({ error }) => { if (error) console.error('Sauvegarde Supabase :', error.message); });
    }, 800);
  }, [state.advisor, state.clients, demo, ready]);

  const value = useMemo<AppContextValue>(() => {
    const getClient = (id: string) => state.clients.find((c) => c.id === id);
    return {
      state,
      mode: demo ? 'demo' : 'supabase',
      ready,
      authEmail,
      loginAsAdvisor: () => setState((s) => ({ ...s, role: 'advisor', currentUserId: null })),
      loginAsClient: (clientId) => setState((s) => ({ ...s, role: 'client', currentUserId: clientId })),
      logout: () => {
        if (demo) {
          setState((s) => ({ ...s, role: null, currentUserId: null }));
        } else {
          supabase?.auth.signOut();
          setState(emptyState);
        }
      },
      signIn: async (email, password) => {
        if (!supabase) return { error: 'Backend non configuré.' };
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        return { error: error?.message ?? null };
      },
      signUp: async (email, password) => {
        if (!supabase) return { error: 'Backend non configuré.' };
        const { error } = await supabase.auth.signUp({ email, password });
        return { error: error?.message ?? null };
      },
      currentClient: state.currentUserId ? getClient(state.currentUserId) || null : null,
      getClient,
      updateClient: (id, updater) =>
        setState((s) => ({ ...s, clients: s.clients.map((c) => (c.id === id ? updater(c) : c)) })),
      addClient: (c) => setState((s) => ({ ...s, clients: [...s.clients, c] })),
      updateAdvisor: (updater) => setState((s) => ({ ...s, advisor: updater(s.advisor) })),
      resetDemo: () => {
        localStorage.removeItem(STORAGE_KEY);
        setState({ ...seedState });
      },
    };
  }, [state, demo, ready, authEmail]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = (): AppContextValue => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp doit être utilisé dans AppProvider');
  return ctx;
};

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import type { AppState, Client, AdvisorProfile } from '@/types';
import { seedState } from '@/data/seed';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import {
  fetchAdvisorClients, fetchMyClientRow, claimByEmail,
  insertClient, updateClientRow, deleteClientRow,
} from '@/lib/clientsRepo';

const STORAGE_KEY = 'csf_platform_state_v1';

const normalizeClients = (clients: Client[] = []): Client[] =>
  clients.map((c) => ({ ...c, debts: c.debts ?? [], assets: c.assets ?? [], referrals: c.referrals ?? [] }));

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
  advisorAllowed: boolean;
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
  removeClient: (id: string) => void;
  updateAdvisor: (updater: (a: AdvisorProfile) => AdvisorProfile) => void;
  resetDemo: () => void;
}

// Liste blanche des courriels conseiller (VITE_ADVISOR_EMAILS, séparés par virgules).
const ADVISOR_ALLOWLIST = (import.meta.env.VITE_ADVISOR_EMAILS || '')
  .split(',')
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

const isAllowedAdvisor = (email: string | null): boolean => {
  if (ADVISOR_ALLOWLIST.length === 0) return true; // aucun filtre défini : compte unique = conseiller
  return !!email && ADVISOR_ALLOWLIST.includes(email.toLowerCase());
};

const AppContext = createContext<AppContextValue | null>(null);

const emptyState: AppState = { advisor: seedState.advisor, clients: [], currentUserId: null, role: null };

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const demo = !isSupabaseConfigured;
  const [state, setState] = useState<AppState>(() => (demo ? loadLocal() : emptyState));
  const [ready, setReady] = useState<boolean>(demo);
  const [authEmail, setAuthEmail] = useState<string | null>(null);
  const ownerId = useRef<string | null>(null);     // uid connecté
  const supaRole = useRef<'advisor' | 'client' | null>(null);
  const advisorSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // --- Mode démo : persistance locale --------------------------------------
  useEffect(() => {
    if (!demo) return;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch { /* ignore */ }
  }, [state, demo]);

  // --- Mode Supabase : session + chargement --------------------------------
  useEffect(() => {
    if (demo || !supabase) return;
    let active = true;

    const handleSession = async (userId: string | null, email: string | null) => {
      ownerId.current = userId;
      setAuthEmail(email);
      if (!userId) { if (active) setReady(true); return; }

      if (isAllowedAdvisor(email)) {
        // --- Conseiller : profil (workspaces) + clients (table relationnelle)
        supaRole.current = 'advisor';
        const { data: ws } = await supabase!
          .from('workspaces').select('data').eq('owner_id', userId).maybeSingle();
        const advisor = { ...seedState.advisor, email: email ?? '', ...(ws?.data?.advisor ?? {}) };
        if (!ws) {
          await supabase!.from('workspaces').upsert({ owner_id: userId, data: { advisor } });
        }
        const clients = await fetchAdvisorClients(userId);
        if (!active) return;
        setState({ advisor, clients: normalizeClients(clients), role: 'advisor', currentUserId: null });
        setReady(true);
        return;
      }

      // --- Client : relier et charger uniquement sa fiche
      supaRole.current = 'client';
      let mine = await fetchMyClientRow(userId);
      if (!mine) mine = await claimByEmail(); // 1re connexion : liaison par courriel
      if (!active) return;
      if (mine) {
        setState({ advisor: seedState.advisor, clients: normalizeClients([mine]), role: 'client', currentUserId: mine.id });
      } else {
        // Compte non relié (pas invité) : aucun accès
        supaRole.current = null;
        setState(emptyState);
      }
      setReady(true);
    };

    supabase.auth.getSession().then(({ data }) =>
      handleSession(data.session?.user?.id ?? null, data.session?.user?.email ?? null));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) =>
      handleSession(session?.user?.id ?? null, session?.user?.email ?? null));
    return () => { active = false; sub.subscription.unsubscribe(); };
  }, [demo]);

  // --- Mode Supabase : sauvegarde du profil conseiller (anti-rebond) --------
  useEffect(() => {
    if (demo || !supabase || !ownerId.current || !ready || supaRole.current !== 'advisor') return;
    if (advisorSaveTimer.current) clearTimeout(advisorSaveTimer.current);
    advisorSaveTimer.current = setTimeout(() => {
      supabase!.from('workspaces')
        .upsert({ owner_id: ownerId.current, data: { advisor: state.advisor } })
        .then(({ error }) => { if (error) console.error('Sauvegarde profil :', error.message); });
    }, 800);
  }, [state.advisor, demo, ready]);

  const value = useMemo<AppContextValue>(() => {
    const getClient = (id: string) => state.clients.find((c) => c.id === id);
    const supa = !demo && !!supabase;

    return {
      state,
      mode: demo ? 'demo' : 'supabase',
      ready,
      authEmail,
      advisorAllowed: demo ? true : isAllowedAdvisor(authEmail),
      loginAsAdvisor: () => setState((s) => ({ ...s, role: 'advisor', currentUserId: null })),
      loginAsClient: (clientId) => setState((s) => ({ ...s, role: 'client', currentUserId: clientId })),
      logout: () => {
        if (demo) setState((s) => ({ ...s, role: null, currentUserId: null }));
        else { supabase?.auth.signOut(); supaRole.current = null; setState(emptyState); }
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
      updateClient: (id, updater) => {
        const current = state.clients.find((c) => c.id === id);
        const next = current ? updater(current) : null;
        setState((s) => ({ ...s, clients: s.clients.map((c) => (c.id === id ? updater(c) : c)) }));
        if (supa && next) updateClientRow(next);
      },
      addClient: (c) => {
        setState((s) => ({ ...s, clients: [...s.clients, c] }));
        if (supa && ownerId.current) insertClient(ownerId.current, c);
      },
      removeClient: (id) => {
        setState((s) => ({
          ...s,
          clients: s.clients.filter((c) => c.id !== id),
          currentUserId: s.currentUserId === id ? null : s.currentUserId,
        }));
        if (supa) deleteClientRow(id);
      },
      updateAdvisor: (updater) => setState((s) => ({ ...s, advisor: updater(s.advisor) })),
      resetDemo: () => { localStorage.removeItem(STORAGE_KEY); setState({ ...seedState }); },
    };
  }, [state, demo, ready, authEmail]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = (): AppContextValue => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp doit être utilisé dans AppProvider');
  return ctx;
};

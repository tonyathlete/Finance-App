// Accès aux clients dans Supabase (modèle relationnel, phase 2).
// Chaque client = une ligne dans public.clients. La RLS garantit qu'un client
// ne voit que sa propre ligne et que le conseiller ne voit que ses clients.
import type { Client } from '@/types';
import { supabase } from './supabase';
import { nowISO } from './utils';

// Conversion ligne DB -> objet Client de l'app
export const rowToClient = (r: any): Client => ({
  id: r.id,
  firstName: r.first_name ?? '',
  lastName: r.last_name ?? '',
  email: r.email ?? '',
  phone: r.phone ?? '',
  situation: r.situation ?? '',
  isSelfEmployed: r.data?.isSelfEmployed ?? false,
  consentGivenAt: r.data?.consentGivenAt,
  createdAt: r.created_at ?? nowISO(),
  archived: r.data?.archived ?? false,
  incomes: r.data?.incomes ?? [],
  budget: r.data?.budget ?? [],
  goals: r.data?.goals ?? [],
  insurance: r.data?.insurance ?? [],
  checkIns: r.data?.checkIns ?? [],
  followUps: r.data?.followUps ?? [],
  advisorNotes: r.data?.advisorNotes ?? [],
  debts: r.data?.debts ?? [],
  assets: r.data?.assets ?? [],
  retirement: r.data?.retirement,
  referrals: r.data?.referrals ?? [],
});

// Données JSONB (tout sauf les colonnes d'identité)
const toData = (c: Client) => ({
  isSelfEmployed: c.isSelfEmployed,
  consentGivenAt: c.consentGivenAt ?? null,
  archived: c.archived ?? false,
  incomes: c.incomes,
  budget: c.budget,
  goals: c.goals,
  insurance: c.insurance,
  checkIns: c.checkIns,
  followUps: c.followUps,
  advisorNotes: c.advisorNotes,
  debts: c.debts,
  assets: c.assets,
  retirement: c.retirement ?? null,
  referrals: c.referrals,
});

const toColumns = (c: Client) => ({
  first_name: c.firstName,
  last_name: c.lastName,
  email: c.email,
  phone: c.phone,
  situation: c.situation,
  data: toData(c),
});

// --- Lectures --------------------------------------------------------------
export const fetchAdvisorClients = async (advisorId: string): Promise<Client[]> => {
  if (!supabase) return [];
  const { data, error } = await supabase.from('clients').select('*').eq('advisor_id', advisorId);
  if (error) { console.error('Chargement clients :', error.message); return []; }
  return (data ?? []).map(rowToClient);
};

export const fetchMyClientRow = async (userId: string): Promise<Client | null> => {
  if (!supabase) return null;
  const { data } = await supabase.from('clients').select('*').eq('client_user_id', userId).maybeSingle();
  return data ? rowToClient(data) : null;
};

// Tente de relier la fiche dont le courriel correspond au compte connecté
export const claimByEmail = async (): Promise<Client | null> => {
  if (!supabase) return null;
  const { error } = await supabase.rpc('claim_by_email');
  if (error) { console.error('claim_by_email :', error.message); return null; }
  const { data: { user } } = await supabase.auth.getUser();
  return user ? fetchMyClientRow(user.id) : null;
};

// --- Écritures -------------------------------------------------------------
export const insertClient = async (advisorId: string, c: Client): Promise<void> => {
  if (!supabase) return;
  const { error } = await supabase.from('clients').insert({ id: c.id, advisor_id: advisorId, ...toColumns(c) });
  if (error) console.error('Création client :', error.message);
};

export const updateClientRow = async (c: Client): Promise<void> => {
  if (!supabase) return;
  const { error } = await supabase.from('clients').update(toColumns(c)).eq('id', c.id);
  if (error) console.error('Sauvegarde client :', error.message);
};

export const deleteClientRow = async (id: string): Promise<void> => {
  if (!supabase) return;
  const { error } = await supabase.from('clients').delete().eq('id', id);
  if (error) console.error('Suppression client :', error.message);
};

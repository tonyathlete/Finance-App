// Logique du concours de références
import type { Referral } from '@/types';

// Configuration du concours
export const CONTEST = {
  prizeLabel: '2 000 $ en cartes-cadeaux',
  prizeAmount: 2000,
  avgReferrals: 2.5,      // moyenne de références par participant
  superReferrerAt: 10,    // palier « super parrain »
};

// Date du tirage : 15 décembre de l'année courante (ou l'an prochain si passé)
export const drawDate = (now = new Date()): Date => {
  const year = now.getFullYear();
  let d = new Date(year, 11, 15, 12, 0, 0); // 15 déc, midi
  if (d.getTime() < now.getTime()) d = new Date(year + 1, 11, 15, 12, 0, 0);
  return d;
};

export interface Countdown {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
}

export const countdownTo = (target: Date, now = new Date()): Countdown => {
  const total = Math.max(0, target.getTime() - now.getTime());
  const s = Math.floor(total / 1000);
  return {
    total,
    days: Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: s % 60,
  };
};

export interface ContestOdds {
  entries: number;            // = nombre de références
  multiplier: number;         // chances vs participant moyen
  percentMore: number;        // % de chances en plus vs la moyenne
  isSuperReferrer: boolean;
}

export const contestOdds = (referrals: Referral[]): ContestOdds => {
  const entries = referrals.length;
  const multiplier = entries / CONTEST.avgReferrals;
  return {
    entries,
    multiplier,
    percentMore: Math.round((multiplier - 1) * 100),
    isSuperReferrer: entries >= CONTEST.superReferrerAt,
  };
};

// Paliers de motivation
export interface Tier {
  threshold: number;
  label: string;
  icon: string;
}
export const TIERS: Tier[] = [
  { threshold: 1, label: 'Participant', icon: 'fa-ticket' },
  { threshold: 3, label: 'Dans la moyenne', icon: 'fa-user-group' },
  { threshold: 5, label: 'Ambassadeur', icon: 'fa-star' },
  { threshold: 10, label: 'Super parrain', icon: 'fa-crown' },
];

export const currentTier = (entries: number): Tier | null => {
  let t: Tier | null = null;
  for (const tier of TIERS) if (entries >= tier.threshold) t = tier;
  return t;
};
export const nextTier = (entries: number): Tier | null =>
  TIERS.find((t) => entries < t.threshold) || null;

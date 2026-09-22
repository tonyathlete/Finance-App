// Utilitaires généraux

export const uid = (prefix = 'id'): string =>
  `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;

export const nowISO = (): string => new Date().toISOString();

// Format monétaire canadien-français
export const money = (n: number | undefined | null): string => {
  const v = typeof n === 'number' && isFinite(n) ? n : 0;
  return new Intl.NumberFormat('fr-CA', {
    style: 'currency',
    currency: 'CAD',
    maximumFractionDigits: 0,
  }).format(v);
};

export const money2 = (n: number | undefined | null): string => {
  const v = typeof n === 'number' && isFinite(n) ? n : 0;
  return new Intl.NumberFormat('fr-CA', {
    style: 'currency',
    currency: 'CAD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(v);
};

export const pct = (n: number): string => `${Math.round(n)} %`;

export const clamp = (n: number, min = 0, max = 100): number =>
  Math.max(min, Math.min(max, n));

// Dates
export const formatDate = (iso?: string): string => {
  if (!iso) return '—';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '—';
  return new Intl.DateTimeFormat('fr-CA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(d);
};

export const formatDateShort = (iso?: string): string => {
  if (!iso) return '—';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '—';
  return new Intl.DateTimeFormat('fr-CA', {
    month: 'short',
    day: 'numeric',
  }).format(d);
};

// Lundi de la semaine courante (ISO)
export const mondayOf = (date = new Date()): string => {
  const d = new Date(date);
  const day = (d.getDay() + 6) % 7; // 0 = lundi
  d.setDate(d.getDate() - day);
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
};

export const monthsUntil = (iso?: string): number => {
  if (!iso) return 0;
  const target = new Date(iso);
  const now = new Date();
  const months =
    (target.getFullYear() - now.getFullYear()) * 12 +
    (target.getMonth() - now.getMonth());
  return Math.max(0, months);
};

export const daysUntil = (iso?: string): number => {
  if (!iso) return Infinity;
  const target = new Date(iso).getTime();
  const now = Date.now();
  return Math.ceil((target - now) / (1000 * 60 * 60 * 24));
};

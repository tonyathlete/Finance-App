import React, { type ReactNode } from 'react';
import { clamp } from '@/lib/utils';

// ============================================================================
// Bibliothèque de composants UI — thème forêt / or / papier
// ============================================================================

export const Card: React.FC<{
  children: ReactNode;
  className?: string;
  as?: keyof React.JSX.IntrinsicElements;
}> = ({ children, className = '', as: Tag = 'div' }) => (
  <Tag
    className={`bg-white rounded-2xl border border-paper-200 shadow-card ${className}`}
  >
    {children}
  </Tag>
);

// En-tête de page avec dégradé forêt (héro)
export const PageHeader: React.FC<{
  eyebrow?: string;
  title: string;
  subtitle?: string;
  icon?: string;
  action?: ReactNode;
}> = ({ eyebrow, title, subtitle, icon, action }) => (
  <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-forest-700 via-forest-800 to-forest-900 text-paper-50 p-6 sm:p-8 shadow-card">
    <div className="absolute -right-8 -top-10 w-44 h-44 rounded-full bg-gold-400/10 blur-2xl" />
    <div className="absolute right-16 bottom-0 w-24 h-24 rounded-full bg-forest-400/10 blur-xl" />
    <div className="relative flex items-start justify-between gap-4 flex-wrap">
      <div className="flex items-start gap-4">
        {icon && (
          <span className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur flex items-center justify-center text-gold-300 flex-shrink-0">
            <i className={`fas ${icon} text-lg`} />
          </span>
        )}
        <div>
          {eyebrow && (
            <p className="text-xs font-semibold uppercase tracking-widest text-gold-300/90">{eyebrow}</p>
          )}
          <h1 className="font-display text-2xl sm:text-3xl font-semibold leading-tight">{title}</h1>
          {subtitle && <p className="text-forest-100/80 mt-1 max-w-xl">{subtitle}</p>}
        </div>
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  </div>
);

export const SectionTitle: React.FC<{
  icon?: string;
  title: string;
  subtitle?: string;
  action?: ReactNode;
}> = ({ icon, title, subtitle, action }) => (
  <div className="flex items-start justify-between gap-4 mb-4">
    <div className="flex items-center gap-3">
      {icon && (
        <span className="w-9 h-9 rounded-xl bg-forest-50 text-forest-600 flex items-center justify-center">
          <i className={`fas ${icon}`} />
        </span>
      )}
      <div>
        <h2 className="font-display text-xl font-semibold text-forest-900">{title}</h2>
        {subtitle && <p className="text-sm text-forest-500">{subtitle}</p>}
      </div>
    </div>
    {action}
  </div>
);

type ButtonVariant = 'primary' | 'gold' | 'ghost' | 'outline' | 'danger';

export const Button: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: ButtonVariant;
    icon?: string;
    size?: 'sm' | 'md';
  }
> = ({ variant = 'primary', icon, size = 'md', className = '', children, ...rest }) => {
  const base =
    'inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed';
  const sizes = size === 'sm' ? 'text-sm px-3 py-1.5' : 'px-4 py-2.5';
  const variants: Record<ButtonVariant, string> = {
    primary: 'bg-forest-600 text-white hover:bg-forest-700 shadow-sm',
    gold: 'bg-gold-400 text-forest-900 hover:bg-gold-500 shadow-sm',
    ghost: 'text-forest-600 hover:bg-forest-50',
    outline: 'border border-paper-300 text-forest-700 hover:bg-paper-50',
    danger: 'text-rose-600 hover:bg-rose-50 border border-rose-200',
  };
  return (
    <button className={`${base} ${sizes} ${variants[variant]} ${className}`} {...rest}>
      {icon && <i className={`fas ${icon}`} />}
      {children}
    </button>
  );
};

export const Badge: React.FC<{
  children: ReactNode;
  tone?: 'forest' | 'gold' | 'gray' | 'green' | 'amber' | 'rose';
  className?: string;
}> = ({ children, tone = 'gray', className = '' }) => {
  const tones = {
    forest: 'bg-forest-50 text-forest-700',
    gold: 'bg-gold-100 text-gold-700',
    gray: 'bg-paper-100 text-forest-600',
    green: 'bg-emerald-50 text-emerald-700',
    amber: 'bg-amber-50 text-amber-700',
    rose: 'bg-rose-50 text-rose-700',
  } as const;
  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  );
};

export const ProgressBar: React.FC<{
  value: number; // 0-100
  tone?: 'forest' | 'gold';
  className?: string;
}> = ({ value, tone = 'forest', className = '' }) => {
  const v = clamp(value);
  const bg = tone === 'gold' ? 'bg-gold-400' : 'bg-forest-500';
  return (
    <div className={`h-2.5 w-full rounded-full bg-paper-200 overflow-hidden ${className}`}>
      <div
        className={`h-full rounded-full ${bg} transition-all duration-500`}
        style={{ width: `${v}%` }}
      />
    </div>
  );
};

export const Stat: React.FC<{
  label: string;
  value: ReactNode;
  icon?: string;
  tone?: 'forest' | 'gold' | 'rose' | 'emerald';
  hint?: string;
}> = ({ label, value, icon, tone = 'forest', hint }) => {
  const tones = {
    forest: 'text-forest-600 bg-forest-50',
    gold: 'text-gold-600 bg-gold-100',
    rose: 'text-rose-600 bg-rose-50',
    emerald: 'text-emerald-600 bg-emerald-50',
  } as const;
  return (
    <Card className="p-5 card-hover">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wide text-forest-400">{label}</p>
        {icon && (
          <span className={`w-8 h-8 rounded-lg flex items-center justify-center ${tones[tone]}`}>
            <i className={`fas ${icon} text-sm`} />
          </span>
        )}
      </div>
      <p className="mt-2 text-2xl font-bold text-forest-900 font-display tabular-nums">{value}</p>
      {hint && <p className="mt-1 text-xs text-forest-400">{hint}</p>}
    </Card>
  );
};

// Champ de formulaire
export const Field: React.FC<{
  label: string;
  children: ReactNode;
  hint?: string;
}> = ({ label, children, hint }) => (
  <label className="block">
    <span className="block text-sm font-medium text-forest-700 mb-1">{label}</span>
    {children}
    {hint && <span className="block text-xs text-forest-400 mt-1">{hint}</span>}
  </label>
);

export const inputClass =
  'w-full rounded-xl border border-paper-300 bg-paper-50 px-3 py-2 text-forest-900 focus:outline-none focus:ring-2 focus:ring-forest-400 focus:border-forest-400 transition';

export const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = ({
  className = '',
  ...rest
}) => <input className={`${inputClass} ${className}`} {...rest} />;

export const Select: React.FC<React.SelectHTMLAttributes<HTMLSelectElement>> = ({
  className = '',
  children,
  ...rest
}) => (
  <select className={`${inputClass} ${className}`} {...rest}>
    {children}
  </select>
);

export const Textarea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = ({
  className = '',
  ...rest
}) => <textarea className={`${inputClass} ${className}`} {...rest} />;

// Modale simple
export const Modal: React.FC<{
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
}> = ({ open, onClose, title, children, footer }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-forest-950/40 backdrop-blur-sm" onClick={onClose} />
      <Card className="relative w-full max-w-lg p-6 animate-fadeIn max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display text-lg font-semibold text-forest-900">{title}</h3>
          <button onClick={onClose} className="text-forest-400 hover:text-forest-700">
            <i className="fas fa-times" />
          </button>
        </div>
        {children}
        {footer && <div className="mt-6 flex justify-end gap-2">{footer}</div>}
      </Card>
    </div>
  );
};

export const EmptyState: React.FC<{ icon: string; title: string; hint?: string; action?: ReactNode }> = ({
  icon,
  title,
  hint,
  action,
}) => (
  <div className="text-center py-12 px-4">
    <div className="w-14 h-14 mx-auto rounded-2xl bg-paper-100 text-forest-300 flex items-center justify-center mb-3">
      <i className={`fas ${icon} text-xl`} />
    </div>
    <p className="font-medium text-forest-700">{title}</p>
    {hint && <p className="text-sm text-forest-400 mt-1 max-w-sm mx-auto">{hint}</p>}
    {action && <div className="mt-4">{action}</div>}
  </div>
);

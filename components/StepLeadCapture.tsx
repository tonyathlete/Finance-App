import React, { useState } from 'react';
import { LeadInfo } from '../types';

interface Props {
  onSubmit: (lead: LeadInfo) => void;
  onBack: () => void;
  loading: boolean;
  potentialYearly: number;
}

const fmt = (v: number) =>
  new Intl.NumberFormat('fr-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 }).format(v);

export default function StepLeadCapture({ onSubmit, onBack, loading, potentialYearly }: Props) {
  const [form, setForm] = useState<LeadInfo>({ firstName: '', lastName: '', email: '', phone: '' });
  const [errors, setErrors] = useState<Partial<LeadInfo>>({});

  const validate = (): boolean => {
    const e: Partial<LeadInfo> = {};
    if (!form.firstName.trim()) e.firstName = 'Requis';
    if (!form.lastName.trim()) e.lastName = 'Requis';
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = 'Courriel invalide';
    if (!form.phone.replace(/\D/g, '').match(/^\d{10,11}$/)) e.phone = 'Téléphone invalide (10 chiffres)';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) onSubmit(form);
  };

  const field = (id: keyof LeadInfo, label: string, type: string, placeholder: string) => (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-semibold text-blue-900">
        {label} <span className="text-blue-400">*</span>
      </label>
      <input
        id={id} type={type} value={form[id]}
        onChange={(e) => setForm({ ...form, [id]: e.target.value })}
        placeholder={placeholder}
        className={`w-full px-4 py-3 rounded-xl border ${
          errors[id] ? 'border-red-400 bg-red-50' : 'border-blue-200 bg-white'
        } focus:outline-none focus:ring-2 focus:ring-blue-400 text-blue-900 placeholder-blue-300 transition`}
      />
      {errors[id] && <p className="text-xs text-red-500">{errors[id]}</p>}
    </div>
  );

  return (
    <div className="animate-fadeIn max-w-xl mx-auto px-4 py-10">
      {/* Curiosity hook */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white text-center mb-5 shadow-xl">
        <div className="text-4xl mb-3">🚀</div>
        <h2 className="font-display text-2xl font-black mb-3 leading-tight">
          Et ça, c'est juste avec quelques astuces de base.
        </h2>
        {potentialYearly > 0 && (
          <div className="bg-white/10 rounded-xl px-4 py-3 mb-3 inline-block">
            <p className="text-blue-100 text-xs uppercase tracking-wide font-semibold">Déjà détecté</p>
            <p className="text-3xl font-black">{fmt(potentialYearly)}<span className="text-base font-semibold text-blue-200"> /an</span></p>
          </div>
        )}
        <p className="text-blue-100 text-base leading-relaxed">
          Imagine à quel point tu pourrais épargner <strong className="text-white">encore plus</strong> avec
          un vrai conseiller qui regarde ta situation au complet.
        </p>
      </div>

      {/* The offer */}
      <div className="bg-white rounded-2xl border border-blue-100 card-elevated p-6 mb-4">
        <div className="flex items-start gap-3 mb-5">
          <div className="text-3xl">📞</div>
          <div>
            <p className="font-display font-bold text-blue-900 text-lg leading-snug">
              Laisse-moi tes coordonnées et je t'appelle personnellement.
            </p>
            <p className="text-blue-500 text-sm mt-1">
              Dans les prochaines <strong className="text-blue-700">24 heures</strong> · une courte discussion
              de <strong className="text-blue-700">10 minutes</strong> · sans engagement.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {field('firstName', 'Prénom', 'text', 'Jean')}
            {field('lastName', 'Nom', 'text', 'Tremblay')}
          </div>
          {field('email', 'Courriel', 'email', 'jean@exemple.com')}
          {field('phone', 'Téléphone', 'tel', '514-555-0123')}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 mt-2 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-black text-lg shadow-lg shadow-blue-200 disabled:opacity-50 transition hover:scale-105 active:scale-95"
          >
            {loading ? '⏳ Un instant...' : '📞 Oui, appelle-moi →'}
          </button>

          <p className="text-xs text-center text-blue-500">
            🔒 Confidentiel · Aucun spam · Tu peux dire non à tout moment
          </p>
        </form>
      </div>

      <button onClick={onBack} className="w-full py-2 text-blue-500 text-sm font-medium hover:underline">
        ← Revoir les astuces
      </button>
    </div>
  );
}

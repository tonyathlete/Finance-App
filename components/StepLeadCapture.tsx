import React, { useState } from 'react';
import { LeadInfo } from '../types';
import ProgressBar from './ProgressBar';

interface Props {
  onSubmit: (lead: LeadInfo) => void;
  onBack: () => void;
  loading: boolean;
}

const TEASER_ITEMS = [
  { icon: '📊', label: 'Score financier',           value: '?? / 100'         },
  { icon: '🏠', label: 'Logement vs moyenne QC',    value: 'X% revenus'       },
  { icon: '💡', label: 'Recommandations perso',     value: '3 insights'       },
  { icon: '🎯', label: 'Défis & économies calculés',value: 'Jusqu\'à X$/an'   },
];

export default function StepLeadCapture({ onSubmit, onBack, loading }: Props) {
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
    <div className="animate-fadeIn max-w-xl mx-auto px-4 py-8">
      <ProgressBar step={6} total={6} />

      {/* Lock banner */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-5 text-white text-center mb-5 shadow-lg">
        <div className="text-4xl mb-2">🔐</div>
        <h2 className="text-xl font-black mb-1">Ton analyse est prête — mais verrouillée!</h2>
        <p className="text-blue-100 text-sm">Entre tes coordonnées pour tout débloquer gratuitement.</p>

        {/* Teaser grid */}
        <div className="grid grid-cols-2 gap-2 mt-4">
          {TEASER_ITEMS.map((item, i) => (
            <div key={i} className="bg-white/10 rounded-xl px-3 py-2 flex items-center gap-2 text-left">
              <span className="text-lg">{item.icon}</span>
              <div>
                <p className="text-xs font-semibold text-white leading-tight">{item.label}</p>
                <p className="text-xs text-blue-200 blur-sm select-none font-bold">{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-2xl border border-blue-100 card-elevated p-6 mb-4">
        <p className="text-sm font-black text-blue-900 mb-4">✍️ Tes informations</p>
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
            {loading ? '⏳ Génération en cours...' : '🔓 Révéler mon analyse →'}
          </button>

          <p className="text-xs text-center text-blue-500">
            🔒 Confidentiel · Aucun spam · Conseiller disponible sous 24h
          </p>
        </form>
      </div>

      {/* What you get — below form */}
      <div className="bg-blue-50 rounded-2xl border border-blue-100 px-4 py-4 mb-4">
        <p className="text-xs font-black text-blue-700 uppercase tracking-wide mb-3">🎁 Ce que tu reçois gratuitement</p>
        <ul className="space-y-2">
          {[
            ['📊', 'Score financier détaillé avec explication'],
            ['💡', 'Recommandations personnalisées selon ton profil'],
            ['🎯', '3 défis concrets avec économies calculées'],
            ['📞', 'Consultation gratuite avec un conseiller (30 min)'],
          ].map(([icon, text], i) => (
            <li key={i} className="flex items-center gap-2 text-xs text-blue-800">
              <span className="w-5 h-5 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs flex-shrink-0">✓</span>
              <span><strong>{icon}</strong> {text}</span>
            </li>
          ))}
        </ul>
      </div>

      <button onClick={onBack} className="w-full py-2 text-blue-500 text-sm font-medium hover:underline">
        ← Modifier mes réponses
      </button>
    </div>
  );
}

import React, { useState } from 'react';
import { LeadInfo, AvatarId } from '../types';
import ProgressBar from './ProgressBar';
import { AvatarBubble } from './Avatar';

interface Props {
  onSubmit: (lead: LeadInfo) => void;
  onBack: () => void;
  loading: boolean;
  avatar: AvatarId;
}

// Blurred teaser items — fake preview of what's locked behind the form
const TEASER_ITEMS = [
  { icon: '📊', label: 'Ton score financier sur 100', value: '??  / 100' },
  { icon: '🏠', label: 'Logement vs moyenne québécoise', value: 'X% de tes revenus' },
  { icon: '💡', label: 'Observations personnalisées', value: '3 recommandations' },
  { icon: '🎯', label: 'Tes 3 défis pour économiser', value: 'Jusqu\'à X$/an' },
  { icon: '📈', label: 'Opportunités d\'épargne détectées', value: 'Plan d\'action' },
];

export default function StepLeadCapture({ onSubmit, onBack, loading, avatar }: Props) {
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
        id={id}
        type={type}
        value={form[id]}
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
      <ProgressBar step={6} total={6} />

      {/* Header */}
      <div className="text-center mb-5">
        <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 text-xs font-bold px-3 py-1.5 rounded-full border border-green-200 mb-3">
          ✅ Analyse complétée — résultats prêts!
        </div>
        <h2 className="text-2xl font-black text-blue-900 mb-2">
          🔐 Déverrouille ton portrait financier
        </h2>
        <p className="text-blue-600 text-sm">
          Tu as rempli toutes les étapes. Entre tes coordonnées pour révéler ton analyse.
        </p>
      </div>

      {/* Avatar bubble */}
      <div className="mb-5">
        <AvatarBubble avatar={avatar} messageKey="lead" />
      </div>

      {/* Blurred teaser — FOMO section */}
      <div className="bg-white rounded-2xl border border-blue-100 shadow-sm overflow-hidden mb-5">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-3 flex items-center justify-between">
          <p className="text-white font-black text-sm">👀 Aperçu de ton analyse</p>
          <span className="bg-white/20 text-white text-xs font-bold px-2 py-0.5 rounded-full">🔒 Verrouillé</span>
        </div>
        <div className="relative">
          {/* Blurred items */}
          <div className="divide-y divide-blue-50">
            {TEASER_ITEMS.map((item, i) => (
              <div key={i} className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{item.icon}</span>
                  <span className="text-sm text-blue-800 font-medium">{item.label}</span>
                </div>
                <span className="text-sm font-black text-blue-300 blur-sm select-none">{item.value}</span>
              </div>
            ))}
          </div>
          {/* Overlay lock */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/60 to-white flex items-end justify-center pb-4">
            <div className="flex items-center gap-2 bg-blue-600 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg">
              🔓 Entre tes infos pour tout voir
            </div>
          </div>
        </div>
      </div>

      {/* What you get list */}
      <div className="bg-blue-50 rounded-2xl border border-blue-100 px-4 py-3 mb-5">
        <p className="text-xs font-black text-blue-700 uppercase tracking-wide mb-2">Ce que tu reçois gratuitement</p>
        <ul className="space-y-1.5">
          {[
            '📊 Score financier détaillé avec explication',
            '💡 Recommandations personnalisées selon ton profil',
            '🎯 3 défis concrets avec économies calculées',
            '📞 Appel avec un conseiller financier (30 min)',
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-xs text-blue-800">
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Form */}
      <div className="bg-white rounded-2xl shadow-sm border border-blue-100 p-6">
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
            {loading ? '⏳ Génération en cours...' : '🔓 Révéler mon analyse complète →'}
          </button>

          <p className="text-xs text-center text-blue-500">
            🔒 Confidentiel · Aucun spam · Un conseiller vous contacte sous 24h
          </p>
        </form>
      </div>

      <button onClick={onBack} className="mt-4 w-full py-3 text-blue-500 text-sm font-medium hover:underline">
        ← Modifier mes réponses
      </button>
    </div>
  );
}

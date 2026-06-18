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
      <label htmlFor={id} className="text-sm font-semibold text-[#142420]">
        {label} <span className="text-[#C75D3D]">*</span>
      </label>
      <input
        id={id} type={type} value={form[id]}
        onChange={(e) => setForm({ ...form, [id]: e.target.value })}
        placeholder={placeholder}
        className={`w-full px-4 py-3 rounded-sm border ${
          errors[id] ? 'border-[#C75D3D] bg-[#FBFBF9]' : 'border-[#D8DCD3] bg-[#FBFBF9]'
        } focus:outline-none focus:ring-1 focus:ring-[#1B4332] focus:border-[#1B4332] text-[#142420] placeholder-[#142420]/30 transition`}
      />
      {errors[id] && <p className="text-xs text-[#C75D3D]">{errors[id]}</p>}
    </div>
  );

  return (
    <div className="animate-fadeIn max-w-xl mx-auto px-4 py-8">
      <ProgressBar step={6} total={6} />

      {/* Lock banner */}
      <div className="bg-[#1B4332] rounded-md p-5 text-[#FBFBF9] text-center mb-5 border border-[#142420]">
        <div className="text-4xl mb-2">🔐</div>
        <h2 className="font-display text-xl font-black mb-1">Ton analyse est prête — mais verrouillée!</h2>
        <p className="text-[#FBFBF9]/70 text-sm">Entre tes coordonnées pour tout débloquer gratuitement.</p>

        {/* Teaser grid */}
        <div className="grid grid-cols-2 gap-2 mt-4">
          {TEASER_ITEMS.map((item, i) => (
            <div key={i} className="bg-[#FBFBF9]/10 border border-[#FBFBF9]/20 rounded-sm px-3 py-2 flex items-center gap-2 text-left">
              <span className="text-lg">{item.icon}</span>
              <div>
                <p className="text-xs font-semibold text-[#FBFBF9] leading-tight">{item.label}</p>
                <p className="text-xs text-[#FBFBF9]/60 blur-sm select-none font-mono-data font-bold">{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Form */}
      <div className="bg-[#FBFBF9] rounded-md border border-[#D8DCD3] p-6 mb-4">
        <p className="text-sm font-black text-[#142420] mb-4">✍️ Tes informations</p>
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
            className="w-full py-4 mt-2 rounded-sm bg-[#1B4332] hover:bg-[#142420] text-[#FBFBF9] font-black text-lg disabled:opacity-50 transition"
          >
            {loading ? '⏳ Génération en cours...' : '🔓 Révéler mon analyse →'}
          </button>

          <p className="text-xs text-center text-[#142420]/50">
            🔒 Confidentiel · Aucun spam · Conseiller disponible sous 24h
          </p>
        </form>
      </div>

      {/* What you get — below form */}
      <div className="bg-[#EEF1EC] rounded-md border border-[#D8DCD3] px-4 py-4 mb-4">
        <p className="text-xs font-black text-[#1B4332] uppercase tracking-wide mb-3">🎁 Ce que tu reçois gratuitement</p>
        <ul className="space-y-2">
          {[
            ['📊', 'Score financier détaillé avec explication'],
            ['💡', 'Recommandations personnalisées selon ton profil'],
            ['🎯', '3 défis concrets avec économies calculées'],
            ['📞', 'Consultation gratuite avec un conseiller (30 min)'],
          ].map(([icon, text], i) => (
            <li key={i} className="flex items-center gap-2 text-xs text-[#142420]">
              <span className="w-5 h-5 bg-[#1B4332] text-[#FBFBF9] rounded-full flex items-center justify-center text-xs flex-shrink-0">✓</span>
              <span><strong>{icon}</strong> {text}</span>
            </li>
          ))}
        </ul>
      </div>

      <button onClick={onBack} className="w-full py-2 text-[#142420]/60 text-sm font-medium hover:underline">
        ← Modifier mes réponses
      </button>
    </div>
  );
}

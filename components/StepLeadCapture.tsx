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

  const field = (
    id: keyof LeadInfo,
    label: string,
    type: string,
    placeholder: string,
  ) => (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-semibold text-blue-900">{label} <span className="text-blue-500">*</span></label>
      <input
        id={id}
        type={type}
        value={form[id]}
        onChange={(e) => setForm({ ...form, [id]: e.target.value })}
        placeholder={placeholder}
        className={`w-full px-4 py-3 rounded-xl border ${errors[id] ? 'border-red-400 bg-red-50' : 'border-blue-200 bg-white'} focus:outline-none focus:ring-2 focus:ring-blue-400 text-blue-900 placeholder-blue-300 transition`}
      />
      {errors[id] && <p className="text-xs text-red-500">{errors[id]}</p>}
    </div>
  );

  return (
    <div className="animate-fadeIn max-w-xl mx-auto px-4 py-10">
      <ProgressBar step={6} total={6} />

      <div className="text-center mb-6">
        <span className="text-4xl">🎉</span>
        <h2 className="text-2xl font-black text-blue-900 mt-3 mb-2">Votre analyse est prête !</h2>
        <p className="text-blue-700 text-sm max-w-sm mx-auto">
          Entrez vos coordonnées pour recevoir votre rapport personnalisé et être contacté par un spécialiste.
        </p>
      </div>

      <div className="mb-6">
        <AvatarBubble avatar={avatar} messageKey="lead" />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-blue-100 p-6">
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
            className="w-full py-4 mt-2 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold text-lg shadow-lg shadow-blue-200 disabled:opacity-50 transition hover:scale-105 active:scale-95"
          >
            {loading ? 'Génération en cours...' : 'Voir mon analyse complète →'}
          </button>

          <p className="text-xs text-center text-blue-600">
            🔒 Vos informations sont confidentielles. Un conseiller vous contactera sous 24h.
          </p>
        </form>
      </div>

      <button
        onClick={onBack}
        className="mt-4 w-full py-3 text-blue-600 text-sm font-medium hover:underline"
      >
        ← Modifier mes dépenses
      </button>
    </div>
  );
}

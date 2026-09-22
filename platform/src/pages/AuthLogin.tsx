import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { useRouter } from '@/lib/router';
import { BrandLockup } from '@/components/Brand';
import { Button, Field, Input } from '@/components/ui';

// Écran de connexion réel (mode Supabase). Le conseiller se connecte ici.
export const AuthLogin: React.FC = () => {
  const { signIn, signUp } = useApp();
  const { navigate } = useRouter();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    setError(null); setMsg(null); setBusy(true);
    const fn = mode === 'signin' ? signIn : signUp;
    const { error } = await fn(email.trim(), password);
    setBusy(false);
    if (error) { setError(error); return; }
    if (mode === 'signup') {
      setMsg('Compte créé. Vérifiez vos courriels si une confirmation est requise, puis connectez-vous.');
      setMode('signin');
    }
    // en cas de succès de connexion, le contexte charge l'espace et redirige via App
  };

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-2">
      <div className="relative bg-gradient-to-br from-forest-700 via-forest-800 to-forest-950 text-paper-50 px-6 sm:px-10 py-10 lg:py-16 flex flex-col overflow-hidden">
        <div className="absolute -right-16 -top-16 w-72 h-72 rounded-full bg-gold-400/10 blur-3xl" />
        <BrandLockup tone="light" />
        <div className="relative flex-1 flex flex-col justify-center max-w-md mt-10 lg:mt-0">
          <h1 className="font-display text-4xl font-semibold leading-tight">Espace conseiller</h1>
          <p className="text-forest-100/80 mt-4 text-lg">
            Connectez-vous pour accéder à vos clients, budgets, objectifs et suivis — synchronisés
            en toute sécurité.
          </p>
        </div>
        <div className="relative mt-10 text-xs text-forest-100/50">
          Données protégées · Conforme aux attentes de l'AMF et à la Loi 25
        </div>
      </div>

      <div className="px-6 sm:px-10 py-10 lg:py-16 flex flex-col justify-center">
        <div className="max-w-sm w-full mx-auto space-y-5">
          <h2 className="font-display text-2xl font-semibold text-forest-900">
            {mode === 'signin' ? 'Connexion' : 'Créer un compte'}
          </h2>

          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-xl p-3">{error}</div>
          )}
          {msg && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm rounded-xl p-3">{msg}</div>
          )}

          <Field label="Courriel">
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="vous@exemple.com" autoComplete="email" />
          </Field>
          <Field label="Mot de passe">
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" autoComplete={mode === 'signin' ? 'current-password' : 'new-password'} />
          </Field>

          <Button className="w-full" onClick={submit} disabled={busy || !email || !password}>
            {busy ? 'Un instant…' : mode === 'signin' ? 'Se connecter' : 'Créer mon compte'}
          </Button>

          <p className="text-sm text-forest-500 text-center">
            {mode === 'signin' ? 'Pas encore de compte ? ' : 'Déjà un compte ? '}
            <button className="text-forest-700 font-medium underline" onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setError(null); setMsg(null); }}>
              {mode === 'signin' ? 'Créer un compte' : 'Se connecter'}
            </button>
          </p>

          <div className="pt-2 text-center">
            <button onClick={() => navigate('/mentions')} className="text-xs text-forest-400 underline hover:text-forest-700">
              Mentions légales
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

'use client'
import Link from 'next/link'

export default function WelcomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="py-6 px-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-xl bg-gradient-blue shadow-stamp-sm shrink-0" />
            <div>
              <h1 className="text-xl font-display font-bold tracking-tight text-encre">Finance 2026</h1>
              <p className="text-encre/45 text-xs font-ledger tracking-wide">RENCONTRE — CONSEILLER &amp; CLIENT</p>
            </div>
          </div>
          <a href="/dashboard" className="btn-secondary !px-4 !py-2 text-sm">
            Dashboard →
          </a>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 flex items-center justify-center px-4 py-14">
        <div className="max-w-2xl w-full text-center">
          <div className="card !py-14 !px-8 animate-stamp-in">
            <span className="inline-flex w-16 h-16 rounded-2xl bg-gradient-blue shadow-stamp items-center justify-center text-2xl text-white mb-7">
              ✦
            </span>
            <p className="font-ledger text-xs tracking-[0.25em] text-brand-500 font-bold mb-4">PROJET</p>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-encre mb-5 leading-tight">
              Bienvenue au projet<br />Finance 2026
            </h2>
            <p className="text-encre/60 text-base font-body max-w-md mx-auto mb-9">
              Prenons quelques minutes ensemble pour faire le point sur votre situation
              et bâtir un plan clair, adapté à vos objectifs.
            </p>
            <Link href="/objectifs" className="btn-primary !px-8 !py-3.5 text-base inline-flex">
              Commencer →
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}

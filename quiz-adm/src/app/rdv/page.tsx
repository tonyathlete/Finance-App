import type { Metadata } from 'next'
import { vslConfig as c } from '@/lib/vsl-config'
import VideoPlayer from '@/components/vsl/VideoPlayer'
import StickyCta from '@/components/vsl/StickyCta'

export const metadata: Metadata = {
  title: `${c.nom} · Réserve ton appel`,
  description: c.sousTitre,
  openGraph: {
    title: `${c.nom} · ${c.titre}`,
    description: c.titrePrincipal,
    type: 'website',
  },
}

function calendlyEmbedUrl(url: string, utmSource: string) {
  if (!url) return ''
  const u = new URL(url)
  u.searchParams.set('hide_gdpr_banner', '1')
  u.searchParams.set('background_color', '0a2219')
  u.searchParams.set('text_color', 'f8fafc')
  u.searchParams.set('primary_color', 'd4ad55')
  if (utmSource) u.searchParams.set('utm_source', utmSource)
  return u.toString()
}

function calendlyDirectUrl(url: string, utmSource: string) {
  if (!url) return ''
  const u = new URL(url)
  if (utmSource) u.searchParams.set('utm_source', utmSource)
  return u.toString()
}

function initials(nom: string) {
  return nom
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

function Cta({ className = '' }: { className?: string }) {
  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      <a href="#rdv" className="vsl-cta w-full sm:w-auto">
        {c.cta} →
      </a>
      <p className="text-xs text-white/50">{c.ctaSousTexte}</p>
    </div>
  )
}

function SectionTitle({ kicker, children }: { kicker: string; children: React.ReactNode }) {
  return (
    <div className="mb-8 text-center">
      <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-gold-400">{kicker}</p>
      <h2 className="text-2xl font-extrabold leading-tight text-white sm:text-3xl">{children}</h2>
    </div>
  )
}

export default function VslPage() {
  const embedUrl = calendlyEmbedUrl(c.calendlyUrl, c.utmSource)
  const directUrl = calendlyDirectUrl(c.calendlyUrl, c.utmSource)

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-forest-950 text-white antialiased selection:bg-gold-400 selection:text-forest-950">
      {/* Halo + hexagones décoratifs (rappel de l'image de marque) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[700px] bg-[radial-gradient(ellipse_at_top,rgba(31,106,77,0.55),transparent_65%)]"
      />
      <HexPattern />

      <main className="relative mx-auto max-w-3xl px-4 pb-32 sm:px-6">
        {/* ── HERO ─────────────────────────────────────────── */}
        <header className="flex items-center justify-center gap-3 pt-6">
          <Avatar size="sm" />
          <div className="text-left leading-tight">
            <p className="text-sm font-bold text-white">{c.nom}</p>
            <p className="text-xs text-white/50">{c.titre}</p>
          </div>
        </header>

        <section className="pt-8 text-center">
          <span className="inline-block rounded-full border border-gold-400/30 bg-gold-400/10 px-4 py-1.5 text-xs font-semibold text-gold-300">
            {c.surtitre}
          </span>
          <h1 className="mx-auto mt-5 max-w-2xl text-3xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-5xl">
            {c.titrePrincipal}
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base text-white/70 sm:text-lg">{c.sousTitre}</p>
        </section>

        <section className="mt-8">
          <VideoPlayer url={c.youtubeUrl} />
          <Cta className="mt-6" />
        </section>

        {/* ── POUR QUI ─────────────────────────────────────── */}
        <section className="mt-24">
          <SectionTitle kicker="Pour qui">Cet appel est fait pour toi si…</SectionTitle>
          <ul className="space-y-3">
            {c.pourToiSi.map((item) => (
              <li
                key={item}
                className="flex gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-4 text-white/85"
              >
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-400/15 text-xs text-emerald-400">
                  ✓
                </span>
                {item}
              </li>
            ))}
          </ul>
          {c.pasPourToiSi.length > 0 && (
            <div className="mt-6 rounded-xl border border-white/5 p-4">
              <p className="mb-2 text-sm font-semibold text-white/60">Par contre, ce n&apos;est pas pour toi si…</p>
              <ul className="space-y-1.5">
                {c.pasPourToiSi.map((item) => (
                  <li key={item} className="flex gap-3 text-sm text-white/50">
                    <span className="text-rose-400/80">✕</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>

        {/* ── DÉROULEMENT ─────────────────────────────────── */}
        <section className="mt-24">
          <SectionTitle kicker="Comment ça marche">Simple, rapide, sans pression</SectionTitle>
          <ol className="grid gap-4 sm:grid-cols-3">
            {c.etapes.map((e, i) => (
              <li key={e.titre} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gold-400 text-sm font-extrabold text-forest-950">
                  {i + 1}
                </span>
                <h3 className="mt-4 font-bold text-white">{e.titre}</h3>
                <p className="mt-1.5 text-sm text-white/60">{e.texte}</p>
              </li>
            ))}
          </ol>
          <Cta className="mt-8" />
        </section>

        {/* ── À PROPOS ────────────────────────────────────── */}
        <section className="mt-24">
          <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.01] p-6 sm:p-10">
            <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:items-start sm:text-left">
              <Avatar size="lg" />
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold-400">Qui suis-je</p>
                <h2 className="mt-1 text-2xl font-extrabold text-white">{c.nom}</h2>
                <p className="text-sm text-white/50">{c.titre}</p>
                <div className="mt-4 space-y-3 text-white/75">
                  {c.aPropos.map((p) => (
                    <p key={p}>{p}</p>
                  ))}
                </div>
                {c.credentials.length > 0 && (
                  <div className="mt-5 flex flex-wrap justify-center gap-2 sm:justify-start">
                    {c.credentials.map((cr) => (
                      <span
                        key={cr}
                        className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70"
                      >
                        {cr}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ── OUTILS ──────────────────────────────────────── */}
        {c.outils.length > 0 && (
          <section className="mt-24">
            <SectionTitle kicker="Outils gratuits">Des outils que j&apos;ai bâtis pour toi</SectionTitle>
            <div className="grid gap-4 sm:grid-cols-2">
              {c.outils.map((o) => {
                const external = /^https?:\/\//.test(o.url)
                return (
                  <a
                    key={o.nom}
                    href={o.url}
                    {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    className="group flex gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:-translate-y-0.5 hover:border-gold-400/40 hover:bg-white/[0.06]"
                  >
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/5 text-2xl">
                      {o.emoji}
                    </span>
                    <span>
                      <span className="flex items-center gap-1.5 font-bold text-white">
                        {o.nom}
                        <span className="text-gold-400 transition-transform group-hover:translate-x-1">→</span>
                      </span>
                      <span className="mt-1 block text-sm text-white/60">{o.description}</span>
                    </span>
                  </a>
                )
              })}
            </div>
          </section>
        )}

        {/* ── TÉMOIGNAGES ─────────────────────────────────── */}
        {c.temoignages.length > 0 && (
          <section className="mt-24">
            <SectionTitle kicker="Ils en parlent">Ce que disent mes clients</SectionTitle>
            <div className="grid gap-4 sm:grid-cols-2">
              {c.temoignages.map((t) => (
                <figure key={t.nom} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                  <blockquote className="text-white/80">« {t.texte} »</blockquote>
                  <figcaption className="mt-3 text-sm">
                    <span className="font-bold text-white">{t.nom}</span>
                    {t.detail && <span className="text-white/50"> · {t.detail}</span>}
                  </figcaption>
                </figure>
              ))}
            </div>
          </section>
        )}

        {/* ── FAQ ─────────────────────────────────────────── */}
        {c.faq.length > 0 && (
          <section className="mt-24">
            <SectionTitle kicker="Questions fréquentes">Avant de réserver</SectionTitle>
            <div className="space-y-3">
              {c.faq.map((f) => (
                <details
                  key={f.q}
                  className="group rounded-xl border border-white/10 bg-white/[0.03] p-4 open:bg-white/[0.06]"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-white">
                    {f.q}
                    <span className="text-gold-400 transition-transform group-open:rotate-45">+</span>
                  </summary>
                  <p className="mt-3 text-sm text-white/65">{f.r}</p>
                </details>
              ))}
            </div>
          </section>
        )}

        {/* ── CALENDRIER ──────────────────────────────────── */}
        <section id="rdv" className="mt-24 scroll-mt-6">
          <SectionTitle kicker="Dernière étape">Choisis ton moment</SectionTitle>
          <p className="-mt-4 mb-6 text-center text-sm text-white/60">{c.ctaSousTexte}</p>
          {embedUrl ? (
            <>
              <div className="overflow-hidden rounded-2xl border border-white/10 bg-forest-900">
                <iframe
                  src={embedUrl}
                  title="Réserver un appel"
                  className="h-[720px] w-full sm:h-[680px]"
                  loading="lazy"
                />
              </div>
              <p className="mt-4 text-center text-sm text-white/50">
                Le calendrier ne s&apos;affiche pas?{' '}
                <a href={directUrl} target="_blank" rel="noopener noreferrer" className="font-semibold text-gold-400 underline">
                  Ouvre-le ici
                </a>
              </p>
            </>
          ) : (
            <div className="rounded-2xl border border-dashed border-white/20 bg-white/5 p-10 text-center text-sm text-white/70">
              📅 Ajoute ton lien Calendly dans <code className="text-gold-300">src/lib/vsl-config.ts</code>
            </div>
          )}
        </section>

        {/* ── PIED DE PAGE ────────────────────────────────── */}
        <footer className="mt-20 border-t border-white/10 pt-8 text-center text-xs text-white/40">
          <p>
            © {new Date().getFullYear()} {c.nom} · {c.titre}
          </p>
          {(c.certificatAmf || c.cabinet) && (
            <p className="mt-1">
              {c.cabinet}
              {c.cabinet && c.certificatAmf && ' · '}
              {c.certificatAmf && `No de certificat AMF : ${c.certificatAmf}`}
            </p>
          )}
          {c.instagram && (
            <a href={c.instagram} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block hover:text-white/70">
              Instagram
            </a>
          )}
          <p className="mx-auto mt-4 max-w-lg">{c.mentionLegale}</p>
        </footer>
      </main>

      <StickyCta label={c.cta} />
    </div>
  )
}

function Avatar({ size }: { size: 'sm' | 'lg' }) {
  const dims = size === 'sm' ? 'h-10 w-10 text-sm' : 'h-24 w-24 text-2xl'
  if (c.photoUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={c.photoUrl} alt={c.nom} className={`${dims} shrink-0 rounded-full object-cover ring-2 ring-gold-400/60`} />
    )
  }
  return (
    <span
      className={`${dims} flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-gold-300 to-gold-500 font-extrabold text-forest-950 ring-2 ring-gold-400/30`}
    >
      {initials(c.nom)}
    </span>
  )
}

function HexPattern() {
  // Hexagones pointus, contour or, qui s'estompent vers le bas
  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute inset-x-0 top-0 h-[520px] w-full opacity-[0.12] [mask-image:linear-gradient(to_bottom,black,transparent)]"
    >
      <defs>
        <pattern id="hex" width="56" height="97" patternUnits="userSpaceOnUse" patternTransform="scale(1.1)">
          <path
            d="M28 0 L56 16.2 L56 48.5 L28 64.7 L0 48.5 L0 16.2 Z M28 64.7 L28 97"
            fill="none"
            stroke="#d4ad55"
            strokeWidth="1"
          />
          <path d="M0 48.5 L0 97 M56 48.5 L56 97" fill="none" stroke="#d4ad55" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#hex)" />
    </svg>
  )
}

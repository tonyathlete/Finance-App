'use client'
import { useState } from 'react'

export function getYoutubeId(url: string): string | null {
  if (!url) return null
  const m = url.match(/(?:youtu\.be\/|v=|\/embed\/|\/shorts\/|\/live\/)([A-Za-z0-9_-]{11})/)
  return m ? m[1] : null
}

export default function VideoPlayer({ url }: { url: string }) {
  const [playing, setPlaying] = useState(false)
  const id = getYoutubeId(url)

  if (!id) {
    return (
      <div className="aspect-video w-full rounded-2xl border border-dashed border-white/20 bg-white/5 flex flex-col items-center justify-center text-center p-6">
        <div className="text-4xl mb-3">🎬</div>
        <p className="text-white/70 text-sm">
          Ajoute ton lien YouTube dans <code className="text-amber-300">src/lib/vsl-config.ts</code>
        </p>
      </div>
    )
  }

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-black shadow-2xl shadow-black/60 ring-1 ring-white/10">
      {playing ? (
        <iframe
          className="absolute inset-0 h-full w-full"
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
          title="Vidéo de présentation"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          className="group absolute inset-0 h-full w-full"
          aria-label="Lire la vidéo"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`}
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-80 transition-opacity group-hover:opacity-100"
          />
          <span className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex h-20 w-20 items-center justify-center rounded-full bg-amber-400 text-slate-950 shadow-xl shadow-amber-500/40 transition-transform group-hover:scale-110">
            <span className="absolute inset-0 rounded-full bg-amber-400 animate-ping opacity-30" />
            <svg viewBox="0 0 24 24" className="relative ml-1 h-8 w-8 fill-current">
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
          <span className="absolute bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-black/60 px-4 py-1.5 text-xs font-semibold text-white backdrop-blur">
            ▶ Clique pour regarder
          </span>
        </button>
      )}
    </div>
  )
}

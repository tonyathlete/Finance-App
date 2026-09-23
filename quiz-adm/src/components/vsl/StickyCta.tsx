'use client'
import { useEffect, useState } from 'react'

// Barre fixe en bas de l'écran (mobile) qui apparaît après la vidéo
// et disparaît quand le calendrier est visible.
export default function StickyCta({ label }: { label: string }) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      const rdv = document.getElementById('rdv')
      const pastHero = window.scrollY > window.innerHeight * 0.8
      const atCalendar = rdv ? rdv.getBoundingClientRect().top < window.innerHeight * 0.9 : false
      setShow(pastHero && !atCalendar)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-50 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] bg-slate-950/90 backdrop-blur border-t border-white/10 transition-transform duration-300 md:hidden ${
        show ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <a href="#rdv" className="vsl-cta w-full">
        {label} →
      </a>
    </div>
  )
}

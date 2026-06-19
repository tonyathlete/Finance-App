import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { createClient } from '@supabase/supabase-js'
import { genererBilan } from '@/lib/recommendations'
import { Submission } from '@/lib/types'

const PRIORITE_LABELS: Record<string, string> = {
  haute: '🔴 Priorité haute',
  moyenne: '🟠 À considérer',
  info: '💡 Bon à savoir',
}

export async function POST(req: Request) {
  const { id, email } = await req.json()
  if (!id || !email) {
    return NextResponse.json({ error: 'id et email requis' }, { status: 400 })
  }

  const resendApiKey = process.env.RESEND_API_KEY
  if (!resendApiKey) {
    return NextResponse.json({ error: 'RESEND_API_KEY non configurée' }, { status: 500 })
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json({ error: 'Configuration Supabase manquante' }, { status: 500 })
  }

  const supabase = createClient(supabaseUrl, supabaseKey)
  const { data: submission, error } = await supabase
    .from('submissions').select('*').eq('id', id).single()

  if (error || !submission) {
    return NextResponse.json({ error: 'Client introuvable' }, { status: 404 })
  }

  const d = (submission as Submission).data
  const bilan = genererBilan(d)

  const recommandationsHtml = bilan.recommandations.map(r => `
    <div style="margin-bottom:16px;padding:12px;border-left:4px solid #6366f1;background:#f8fafc;">
      <p style="margin:0 0 4px;font-size:12px;font-weight:600;color:#6366f1;">${PRIORITE_LABELS[r.priorite] || r.priorite}</p>
      <p style="margin:0 0 4px;font-weight:600;">${r.titre}</p>
      <p style="margin:0;font-size:13px;color:#475569;">${r.description}</p>
    </div>
  `).join('')

  const notesHtml = Object.entries(d.notes || {}).filter(([, n]) => n).map(([section, n]) => `
    <p style="margin:0 0 4px;font-size:12px;font-weight:600;color:#64748b;">${section}</p>
    <p style="margin:0 0 12px;font-size:13px;">${n}</p>
  `).join('')

  const html = `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
      <h1 style="color:#1e3a8a;">Rapport financier — ${d.prenom} ${d.nom}</h1>
      <p style="font-size:18px;font-weight:bold;">Score: ${bilan.score}/100</p>
      <h2>Recommandations</h2>
      ${recommandationsHtml}
      ${notesHtml ? `<h2>Notes</h2>${notesHtml}` : ''}
    </div>
  `

  const resend = new Resend(resendApiKey)
  const { error: sendError } = await resend.emails.send({
    from: 'Quiz ADM <onboarding@resend.dev>',
    to: email,
    subject: `Rapport financier — ${d.prenom} ${d.nom}`,
    html,
  })

  if (sendError) {
    return NextResponse.json({ error: sendError.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}

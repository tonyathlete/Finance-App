'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Submission } from '@/lib/types'

export default function DashboardPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    supabase
      .from('submissions')
      .select('id, created_at, data')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setSubmissions((data as Submission[]) || [])
        setLoading(false)
      })
  }, [])

  const filtered = submissions.filter(s => {
    const name = `${s.data.prenom} ${s.data.nom}`.toLowerCase()
    return name.includes(search.toLowerCase()) || s.data.courriel?.toLowerCase().includes(search.toLowerCase())
  })

  return (
    <div className="min-h-screen">
      <header className="bg-encre text-papier-card py-6 px-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-display font-semibold tracking-tight">Tableau de bord</h1>
            <p className="text-papier-card/55 text-xs font-ledger tracking-wide">QUIZ ADM — TOUS LES DOSSIERS</p>
          </div>
          <Link href="/" className="bg-sceau hover:bg-sceau/90 text-papier-card font-semibold px-4 py-2.5 shadow-stamp-sm hover:translate-x-[1px] hover:translate-y-[1px] transition-all text-sm">
            + Nouveau client
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <input
            className="input max-w-sm"
            placeholder="Rechercher par nom ou courriel..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="text-center text-encre/40 py-20">Chargement...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center text-encre/40 py-20">
            {search ? 'Aucun résultat trouvé.' : 'Aucun client pour le moment.'}
          </div>
        ) : (
          <div className="bg-papier-card border border-encre/15 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="border-b border-encre/15 text-encre">
                <tr>
                  <th className="text-left px-4 py-3 font-ledger text-xs tracking-wide font-medium">Client</th>
                  <th className="text-left px-4 py-3 font-ledger text-xs tracking-wide font-medium hidden sm:table-cell">Type</th>
                  <th className="text-left px-4 py-3 font-ledger text-xs tracking-wide font-medium hidden md:table-cell">Statut civil</th>
                  <th className="text-left px-4 py-3 font-ledger text-xs tracking-wide font-medium hidden lg:table-cell">Date</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-encre/10">
                {filtered.map(s => (
                  <tr key={s.id} className="hover:bg-encre/5 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-medium text-encre">
                        {s.data.prenom} {s.data.nom}
                      </div>
                      <div className="text-encre/45 text-xs">{s.data.courriel}</div>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell text-encre/70 capitalize">
                      {s.data.typeClient || '—'}
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell text-encre/70">
                      {s.data.statutCivil || '—'}
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell text-encre/45 text-xs font-ledger">
                      {new Date(s.created_at).toLocaleDateString('fr-CA')}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link href={`/dashboard/${s.id}`} className="inline-flex items-center gap-1 text-encre hover:text-sceau font-semibold text-xs px-3 py-1.5 transition-colors">
                        Voir →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <p className="text-xs text-encre/40 mt-4 font-ledger">{filtered.length} client(s) affiché(s)</p>
      </main>
    </div>
  )
}

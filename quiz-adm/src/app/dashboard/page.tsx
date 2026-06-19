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
      <header className="bg-gradient-hero text-white py-6 px-6 shadow-glow relative overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="max-w-4xl mx-auto flex items-center justify-between relative">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-white/15 backdrop-blur-sm rounded-xl flex items-center justify-center text-xl border border-white/20">📊</div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">Tableau de bord</h1>
              <p className="text-blue-200 text-xs">Quiz ADM, tous les clients</p>
            </div>
          </div>
          <Link href="/" className="bg-accent-500 hover:bg-accent-600 text-white font-semibold px-4 py-2.5 rounded-xl shadow-lg transition-all hover:-translate-y-0.5 text-sm">
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
          <div className="text-center text-gray-400 py-20">Chargement...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center text-gray-400 py-20">
            {search ? 'Aucun résultat trouvé.' : 'Aucun client pour le moment.'}
          </div>
        ) : (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-card border border-white overflow-hidden animate-slide-up">
            <table className="w-full text-sm">
              <thead className="bg-gradient-to-r from-brand-50 to-brand-100 text-brand-900">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold">Client</th>
                  <th className="text-left px-4 py-3 font-semibold hidden sm:table-cell">Type</th>
                  <th className="text-left px-4 py-3 font-semibold hidden md:table-cell">Statut civil</th>
                  <th className="text-left px-4 py-3 font-semibold hidden lg:table-cell">Date</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map(s => (
                  <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">
                        {s.data.prenom} {s.data.nom}
                      </div>
                      <div className="text-gray-400 text-xs">{s.data.courriel}</div>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell text-gray-600 capitalize">
                      {s.data.typeClient || '—'}
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell text-gray-600">
                      {s.data.statutCivil || '—'}
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell text-gray-400 text-xs">
                      {new Date(s.created_at).toLocaleDateString('fr-CA')}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link href={`/dashboard/${s.id}`} className="inline-flex items-center gap-1 bg-brand-50 text-brand-700 hover:bg-brand-100 font-semibold text-xs px-3 py-1.5 rounded-lg transition-colors">
                        Voir →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <p className="text-xs text-gray-400 mt-4">{filtered.length} client(s) affiché(s)</p>
      </main>
    </div>
  )
}

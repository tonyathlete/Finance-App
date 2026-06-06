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
      <header className="bg-ia-blue text-white py-4 px-6 shadow-md">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">Tableau de bord</h1>
            <p className="text-blue-200 text-xs">Quiz ADM — Tous les clients</p>
          </div>
          <Link href="/" className="btn-secondary bg-transparent text-white border-white hover:bg-blue-800">
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
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-ia-lightblue text-ia-blue">
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
                      <Link href={`/dashboard/${s.id}`} className="text-ia-blue hover:underline font-medium text-xs">
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

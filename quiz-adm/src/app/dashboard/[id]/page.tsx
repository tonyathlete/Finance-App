'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Submission } from '@/lib/types'
import Bilan from '@/components/quiz/Bilan'

function Row({ label, value }: { label: string; value?: string | string[] | null }) {
  if (!value || (Array.isArray(value) && value.length === 0)) return null
  return (
    <div className="flex gap-3 py-2 border-b border-gray-100 last:border-0">
      <span className="text-gray-500 text-sm w-48 shrink-0">{label}</span>
      <span className="text-sm text-gray-900 font-medium">
        {Array.isArray(value) ? value.join(', ') : value}
      </span>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-card border border-white mb-5 overflow-hidden animate-slide-up">
      <div className="bg-gradient-to-r from-brand-700 to-brand-500 text-white font-semibold px-5 py-3 text-sm flex items-center gap-2">
        <span className="w-1.5 h-5 bg-accent-500 rounded-full" />
        {title}
      </div>
      <div className="px-5 py-3">{children}</div>
    </div>
  )
}

const TYPE_LABELS: Record<string, string> = {
  salarie: 'Salarié',
  autonome: 'Travailleur autonome',
  entrepreneur: 'Entrepreneur',
}

export default function ClientDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [submission, setSubmission] = useState<Submission | null>(null)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    supabase.from('submissions').select('*').eq('id', params.id).single()
      .then(({ data }) => { setSubmission(data as Submission); setLoading(false) })
  }, [params.id])

  const handleDelete = async () => {
    if (!confirm('Supprimer définitivement ce client? Cette action est irréversible.')) return
    setDeleting(true)
    const { error } = await supabase.from('submissions').delete().eq('id', params.id)
    if (error) {
      alert('Erreur lors de la suppression.')
      setDeleting(false)
    } else {
      router.push('/dashboard')
    }
  }

  if (loading) return <div className="text-center py-20 text-gray-400">Chargement...</div>
  if (!submission) return <div className="text-center py-20 text-gray-400">Client introuvable.</div>

  const d = submission.data

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gradient-hero text-white py-6 px-6 shadow-glow relative overflow-hidden print:hidden">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="max-w-3xl mx-auto flex items-center gap-4 relative">
          <Link href="/dashboard" className="text-white/90 hover:text-white text-sm bg-white/10 hover:bg-white/20 backdrop-blur-sm px-3 py-2 rounded-xl transition-all border border-white/20">
            ← Retour
          </Link>
          <div className="w-12 h-12 bg-white/15 backdrop-blur-sm rounded-xl flex items-center justify-center text-lg font-bold border border-white/20">
            {(d.prenom?.[0] || '?') + (d.nom?.[0] || '')}
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-bold tracking-tight">
              {d.prenom} {d.nom}
              {d.typeClient && (
                <span className="ml-2 align-middle text-xs font-semibold bg-white/20 px-2 py-0.5 rounded-full">
                  {TYPE_LABELS[d.typeClient] || d.typeClient}
                </span>
              )}
            </h1>
            <p className="text-blue-200 text-xs">{new Date(submission.created_at).toLocaleDateString('fr-CA', { dateStyle: 'long' })}</p>
          </div>
          <button onClick={() => window.print()}
            className="text-white/90 hover:text-white text-sm bg-white/10 hover:bg-white/20 backdrop-blur-sm px-3 py-2 rounded-xl transition-all border border-white/20">
            🖨️ Imprimer
          </button>
          <button onClick={handleDelete} disabled={deleting}
            className="text-white/90 hover:text-white text-sm bg-red-500/30 hover:bg-red-500/50 backdrop-blur-sm px-3 py-2 rounded-xl transition-all border border-red-300/30 disabled:opacity-50">
            {deleting ? '...' : '🗑️ Supprimer'}
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-card border border-white mb-5 p-6">
          <Bilan data={d} />
        </div>

        <Section title="Sentiment économique">
          <Row label="Vis-à-vis l'économie du Canada" value={d.sentimentEconomieCanada} />
          <Row label="Stress face à l'avenir financier" value={d.stressAvenirFinancier} />
          <Row label="Impact de l'inflation ressenti" value={d.inflationImpact} />
          <Row label="Confiance envers le marché boursier" value={d.confianceMarcheBoursier} />
          <Row label="Craint une récession" value={d.craintRecession} />
          <Row label="Principales préoccupations" value={d.principalesInquietudes} />
        </Section>

        <Section title="Connaissances financières">
          <Row label="Marché boursier" value={d.connaissanceBourse} />
          <Row label="Fonds de placements" value={d.connaissancePlacements} />
          <Row label="Produits déjà possédés" value={d.produitsPlacements} />
          <Row label="Assurances" value={d.connaissanceAssurances} />
          <Row label="A assurance maladie grave" value={d.aAssuranceMaladieGrave} />
          <Row label="A assurance invalidité" value={d.aAssuranceInvalidite} />
          <Row label="A assurance vie" value={d.aAssuranceVie} />
          <Row label="Couverture vie actuelle" value={d.capitalCouvertureActuelle ? d.capitalCouvertureActuelle + ' $' : ''} />
          <Row label="Dettes totales déclarées" value={d.capitalDettes ? d.capitalDettes + ' $' : ''} />
          <Row label="Revenu annuel (calcul capital)" value={d.capitalRevenuAnnuel ? d.capitalRevenuAnnuel + ' $' : ''} />
        </Section>

        <Section title="Informations personnelles">
          <Row label="Type de client" value={d.typeClient} />
          <Row label="Téléphone" value={d.telephone} />
          <Row label="Courriel" value={d.courriel} />
          <Row label="Adresse" value={d.adresse} />
          <Row label="Statut civil" value={d.statutCivil} />
          <Row label="Âge" value={d.age} />
          {d.conjointNom && <Row label="Conjoint(e)" value={`${d.conjointNom}, ${d.conjointAge} ans, ${d.conjointEmploi}`} />}
          {d.enfants.length > 0 && (
            <Row label="Enfants" value={d.enfants.map(e => `${e.nom} (${e.age} ans)`)} />
          )}
        </Section>

        {d.typeClient === 'salarie' && (
          <Section title="Profil — Salarié">
            <Row label="REER collectif (employeur)" value={d.reerCollectif} />
            <Row label="Employeur contribue" value={d.employeurContribue} />
            <Row label="Assurances collectives" value={d.assurancesCollectives} />
            <Row label="A un véhicule" value={d.aVehicule} />
            <Row label="Mode financement auto" value={d.typeFinancementAuto} />
            <Row label="Utilise apps d'économies" value={d.utilisationAppEconomies} />
          </Section>
        )}

        {d.typeClient === 'autonome' && (
          <Section title="Profil — Travailleur autonome">
            <Row label="A un comptable" value={d.aComptable} />
            <Row label="Est incorporé" value={d.estIncorpore} />
            <Row label="Fonds d'urgence" value={d.fondsUrgence} />
            <Row label="Défis actuels" value={d.defisActuels} />
            <Row label="Assurance invalidité perso" value={d.assuranceInvaliditePerso} />
          </Section>
        )}

        {d.typeClient === 'entrepreneur' && (
          <Section title="Profil — Entrepreneur">
            <Row label="Chiffre d'affaires annuel" value={d.chiffreAffaires} />
            <Row label="Structure corporative (holding)" value={d.structureCorporative} />
            <Row label="A des associés" value={d.aAssocies} />
            <Row label="Convention d'actionnaires" value={d.conventionActionnaires} />
            <Row label="Assurance clé-homme" value={d.assuranceCleHomme} />
            <Row label="Mode de rémunération" value={d.typeRemunerationEntrepreneur} />
          </Section>
        )}

        <Section title="Autonomie financière">
          <Row label="Signification autonomie" value={d.significationAutonomie} />
          <Row label="Revenu conjoint nécessaire" value={d.revenuConjointNecessaire} />
          <Row label="Événement perturbateur" value={d.evenementPerturbateur} />
          <Row label="Régimes" value={[...d.regimes, d.autresRegimes].filter(Boolean)} />
        </Section>

        <Section title="Invalidité">
          <Row label="Revenu mensuel (client)" value={d.revenuMensuel1 ? d.revenuMensuel1 + ' $' : ''} />
          <Row label="Revenu mensuel (conjoint)" value={d.revenuMensuel2 ? d.revenuMensuel2 + ' $' : ''} />
          <Row label="Dépenses mensuelles" value={d.depensesMensuelles ? d.depensesMensuelles + ' $' : ''} />
          <Row label="Protection invalidité" value={d.protectionInvalidite} />
          <Row label="% salaire couvert" value={d.pourcentageSalaireConvert} />
          <Row label="Temps pour assumer" value={d.tempsPourAssumer} />
          <Row label="Calcul coût de vie fait" value={d.calculCoutVie} />
          <Row label="Comment établi" value={d.commentEtabli} />
        </Section>

        <Section title="Épargne">
          <Row label="Important d'épargner" value={d.importantEpargner} />
          <Row label="But" value={d.butEpargne} />
          <Row label="Planifier retraite sans aide" value={d.planifierRetraite} />
          <Row label="Âge retraite prévu" value={d.ageRetraite} />
          <Row label="Stratégie en place" value={d.strategieEnPlace} />
          <Row label="Certain à 100%" value={d.certainStrategieRetraite} />
          <Row label="Comment évalué" value={d.commentEvalue} />
          <Row label="Retraite visée à" value={d.retraiteAgeVise ? d.retraiteAgeVise + ' ans' : ''} />
          <Row label="Épargne accumulée" value={d.retraiteEpargneActuelle ? d.retraiteEpargneActuelle + ' $' : ''} />
          <Row label="Épargne mensuelle" value={d.retraiteEpargneMensuelle ? d.retraiteEpargneMensuelle + ' $' : ''} />
          <Row label="Revenu visé à la retraite" value={d.retraiteRevenuVise ? d.retraiteRevenuVise + ' $/an' : ''} />
        </Section>

        <Section title="Éducation">
          <Row label="École de pensée" value={d.ecolesPensee.map(e =>
            e === 'ecole1' ? 'Responsabilité entière de l\'enfant' :
            e === 'ecole2' ? 'Financement partiel partagé' :
            'Financement total par les parents'
          )} />
          <Row label="Stratégie éducation" value={d.strategieEducation} />
          <Row label="Certain à 100%" value={d.certainStrategieEducation} />
        </Section>

        <Section title="Protection des biens">
          <Row label="Assurance auto" value={d.assuranceAuto} />
          <Row label="Assurance habitation" value={d.assuranceHabitation} />
          <Row label="Renouvellement auto" value={d.renouvellementAuto} />
          <Row label="Renouvellement habitation" value={d.renouvellementHabitation} />
          <Row label="Fréquence magasinage" value={d.frequenceMagasinage} />
          <Row label="Mode magasinage" value={d.modeMagasinage} />
        </Section>

        <Section title="Lieu d'habitation">
          <Row label="Statut" value={d.statutHabitation} />
          <Row label={d.statutHabitation === 'proprietaire' ? 'Hypothèque mensuelle' : 'Loyer mensuel'}
            value={d.coutLogementMensuel ? d.coutLogementMensuel + ' $' : ''} />
          {d.statutHabitation === 'proprietaire' && <>
            <Row label="Prêt hypothécaire" value={d.pretHypothecaire} />
            <Row label="Institution financière" value={d.institutionFinanciere} />
            <Row label="Protection décès/invalidité" value={d.protectionDeces} />
            <Row label="Connaissance avantages assureur privé" value={d.connaissanceAvantages} />
          <Row label="Connaissance diff. assurance vie vs hypothèque" value={d.connaissanceDiffAssurances} />
          </>}
          {d.statutHabitation === 'locataire' && <>
            <Row label="Projet achat" value={d.projetAchat} />
            <Row label="Quand/comment" value={d.quandCommentAchat} />
            <Row label="Loyer couvert" value={d.loyerCouvert} />
          </>}
        </Section>

        <Section title="Testament et mandat">
          <Row label="Testament + mandat (Qc)" value={d.testamentMandat} />
          <Row label="Enregistré notaire/avocat" value={d.enregistreNotaire} />
          <Row label="Testament + procuration (hors Qc)" value={d.testamentProcuration} />
          <Row label="Connaît conséquences sans testament" value={d.connaissanceConsequences} />
        </Section>

        {d.references.some(r => r.nom) && (
          <Section title="Références">
            <div className="space-y-4">
              {d.references.filter(r => r.nom).map((r, i) => (
                <div key={i} className="border border-gray-100 rounded-lg p-3">
                  <p className="font-medium text-gray-900 mb-1">{r.nom}</p>
                  <div className="grid grid-cols-2 gap-1 text-xs text-gray-500">
                    {r.telDom && <span>Tél: {r.telDom}</span>}
                    {r.cell && <span>Cell: {r.cell}</span>}
                    {r.lien && <span>Lien: {r.lien}</span>}
                    {r.emploi && <span>Emploi: {r.emploi}</span>}
                    {r.nbreEnfants && <span>Enfants: {r.nbreEnfants}</span>}
                    {r.statut && <span>{r.statut === 'proprietaire' ? 'Propriétaire' : 'Locataire'}</span>}
                    {r.statutCivil && <span>{r.statutCivil}</span>}
                  </div>
                </div>
              ))}
            </div>
          </Section>
        )}
      </main>
    </div>
  )
}

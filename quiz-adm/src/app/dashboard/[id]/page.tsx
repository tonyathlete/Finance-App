'use client'
import { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Submission } from '@/lib/types'
import Bilan from '@/components/quiz/Bilan'

const ReportEditContext = createContext<{
  editMode: boolean
  overrides: Record<string, string>
  setOverride: (label: string, value: string) => void
}>({ editMode: false, overrides: {}, setOverride: () => {} })

function Row({ label, value }: { label: string; value?: string | string[] | null }) {
  const { editMode, overrides, setOverride } = useContext(ReportEditContext)
  const base = Array.isArray(value) ? value.join(', ') : (value || '')
  const override = overrides[label]
  const display = override !== undefined ? override : base
  if (!editMode && !display) return null
  return (
    <div className="flex gap-3 py-2 border-b border-encre/8 last:border-0">
      <span className="text-encre/50 text-sm w-48 shrink-0 font-ledger text-xs pt-0.5">{label}</span>
      {editMode ? (
        <input
          className="text-sm text-encre font-medium flex-1 rounded-lg border border-encre/15 px-2 py-1 bg-white/80"
          value={display}
          onChange={e => setOverride(label, e.target.value)}
        />
      ) : (
        <span className="text-sm text-encre font-medium">{display}</span>
      )}
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="card !p-0 mb-5 overflow-hidden">
      <div className="bg-gradient-blue text-white font-display font-semibold px-5 py-3 text-sm">
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
  const [editMode, setEditMode] = useState(false)
  const [saving, setSaving] = useState(false)
  const [overrides, setOverrides] = useState<Record<string, string>>({})
  const [email, setEmail] = useState('')
  const [sending, setSending] = useState(false)
  const [sendStatus, setSendStatus] = useState<'idle' | 'sent' | 'error'>('idle')

  useEffect(() => {
    supabase.from('submissions').select('*').eq('id', params.id).single()
      .then(({ data }) => {
        const sub = data as Submission
        setSubmission(sub)
        setOverrides(sub?.data?.reportOverrides || {})
        setEmail(sub?.data?.courriel || '')
        setLoading(false)
      })
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

  const setOverride = (label: string, value: string) => setOverrides(prev => ({ ...prev, [label]: value }))

  const handleSave = async () => {
    if (!submission) return
    setSaving(true)
    const updatedData = { ...submission.data, reportOverrides: overrides }
    const { error } = await supabase.from('submissions').update({ data: updatedData }).eq('id', params.id)
    setSaving(false)
    if (error) {
      alert('Erreur lors de l\'enregistrement.')
    } else {
      setSubmission({ ...submission, data: updatedData })
      setEditMode(false)
    }
  }

  const handleSend = async () => {
    if (!email) return
    setSending(true)
    setSendStatus('idle')
    try {
      const res = await fetch('/api/send-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: params.id, email }),
      })
      setSendStatus(res.ok ? 'sent' : 'error')
    } catch {
      setSendStatus('error')
    }
    setSending(false)
  }

  if (loading) return <div className="text-center py-20 text-gray-400">Chargement...</div>
  if (!submission) return <div className="text-center py-20 text-gray-400">Client introuvable.</div>

  const d = submission.data
  const notes = d.notes || {}

  return (
    <div className="min-h-screen bg-papier">
      <header className="py-6 px-6 print:hidden">
        <div className="max-w-3xl mx-auto card !p-4 flex items-center gap-4">
          <Link href="/dashboard" className="btn-secondary !px-3 !py-2 text-sm">
            ← Retour
          </Link>
          <div className="w-11 h-11 rounded-xl bg-gradient-blue text-white flex items-center justify-center text-base font-display font-semibold shadow-stamp-sm">
            {(d.prenom?.[0] || '?') + (d.nom?.[0] || '')}
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-display font-semibold tracking-tight text-encre">
              {d.prenom} {d.nom}
              {d.typeClient && (
                <span className="ml-2 align-middle text-xs font-ledger rounded-full bg-brand-50 text-brand-600 px-2.5 py-0.5">
                  {TYPE_LABELS[d.typeClient] || d.typeClient}
                </span>
              )}
            </h1>
            <p className="text-encre/45 text-xs font-ledger">{new Date(submission.created_at).toLocaleDateString('fr-CA', { dateStyle: 'long' })}</p>
          </div>
          {editMode ? (
            <button onClick={handleSave} disabled={saving} className="btn-primary !px-3 !py-2 text-sm disabled:opacity-50">
              {saving ? '...' : 'Enregistrer'}
            </button>
          ) : (
            <button onClick={() => setEditMode(true)} className="btn-secondary !px-3 !py-2 text-sm">
              Modifier
            </button>
          )}
          <button onClick={() => window.print()} className="btn-secondary !px-3 !py-2 text-sm">
            Imprimer
          </button>
          <button onClick={handleDelete} disabled={deleting}
            className="text-encre/50 hover:text-sceau text-sm rounded-full border border-encre/15 hover:border-sceau/40 px-3 py-2 transition-colors disabled:opacity-50">
            {deleting ? '...' : 'Supprimer'}
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        <div className="card mb-5 print:hidden">
          <p className="field-label">Envoyer le rapport par courriel</p>
          <div className="flex gap-2 mt-2">
            <input type="email" className="input" placeholder="courriel@exemple.com"
              value={email} onChange={e => setEmail(e.target.value)} />
            <button className="btn-primary shrink-0" onClick={handleSend} disabled={sending || !email}>
              {sending ? 'Envoi...' : 'Envoyer'}
            </button>
          </div>
          {sendStatus === 'sent' && <p className="text-sauge text-sm mt-2">Rapport envoyé avec succès.</p>}
          {sendStatus === 'error' && <p className="text-sceau text-sm mt-2">L&apos;envoi a échoué. Vérifiez la configuration du service de courriel.</p>}
        </div>

        <div className="card mb-5">
          <Bilan data={d} />
        </div>

        <ReportEditContext.Provider value={{ editMode, overrides, setOverride }}>

        {((d.objectifs && d.objectifs.length > 0) || d.objectifAutre) && (
          <Section title="Objectifs du client">
            <Row
              label="Objectifs visés"
              value={[
                ...(d.objectifs || []).filter(o => o !== 'Autre'),
                d.objectifAutre ? `Autre : ${d.objectifAutre}` : '',
              ].filter(Boolean)}
            />
            {d.objectifMaisonEcheance && (
              <Row label="Horizon d'achat (maison)" value={d.objectifMaisonEcheance} />
            )}
          </Section>
        )}

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
          <Section title="Profil: Salarié">
            <Row label="REER collectif (employeur)" value={d.reerCollectif} />
            <Row label="Employeur contribue" value={d.employeurContribue} />
            <Row label="Assurances collectives" value={d.assurancesCollectives} />
            <Row label="A un véhicule" value={d.aVehicule} />
            <Row label="Mode financement auto" value={d.typeFinancementAuto} />
            <Row label="Utilise apps d'économies" value={d.utilisationAppEconomies} />
          </Section>
        )}

        {d.typeClient === 'autonome' && (
          <Section title="Profil: Travailleur autonome">
            <Row label="A un comptable" value={d.aComptable} />
            <Row label="Est incorporé" value={d.estIncorpore} />
            <Row label="Fonds d'urgence" value={d.fondsUrgence} />
            <Row label="Défis actuels" value={d.defisActuels} />
            <Row label="Assurance invalidité perso" value={d.assuranceInvaliditePerso} />
          </Section>
        )}

        {d.typeClient === 'entrepreneur' && (
          <Section title="Profil: Entrepreneur">
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
                <div key={i} className="rounded-xl bg-brand-50/50 border border-encre/8 p-3">
                  <p className="font-medium text-encre mb-1">{r.nom}</p>
                  <div className="grid grid-cols-2 gap-1 text-xs text-encre/50">
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

        </ReportEditContext.Provider>

        {Object.values(notes).some(n => n) && (
          <Section title="Notes du conseiller">
            <div className="space-y-3">
              {Object.entries(notes).filter(([, n]) => n).map(([section, n]) => (
                <div key={section}>
                  <p className="text-xs font-semibold text-encre/45 mb-1">{section}</p>
                  <p className="text-sm text-encre/80 whitespace-pre-wrap">{n}</p>
                </div>
              ))}
            </div>
          </Section>
        )}
      </main>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
//  CONFIGURATION DE LA PAGE VSL  (/rdv)
//
//  C'est le SEUL fichier à modifier pour changer le contenu de la page.
//  Modifie les textes entre guillemets, sauvegarde, pousse sur GitHub :
//  Netlify redéploie automatiquement.
// ─────────────────────────────────────────────────────────────

export const vslConfig = {
  // ── Qui tu es ──────────────────────────────────────────────
  nom: 'Anthony Goulet',
  titre: 'Conseiller en sécurité financière',
  photoUrl: '/anthony.jpg', // image dans quiz-adm/public/ ou lien https://…  (vide = initiales)
  cabinet: 'Services financiers Christine Bourassa',
  certificatAmf: '269559',
  instagram: '', // ex: 'https://instagram.com/tonprofil'

  // ── Liens principaux ───────────────────────────────────────
  // N'importe quel format YouTube marche : watch?v=, youtu.be/, shorts/
  youtubeUrl: '',
  // Ton lien Calendly complet, ex: 'https://calendly.com/anthony-goulet/30min'
  calendlyUrl: '',
  // Source ajoutée au lien Calendly pour savoir d'où viennent les rendez-vous
  utmSource: 'instagram',

  // ── Accroche (haut de page) ────────────────────────────────
  surtitre: 'Pour les entrepreneurs incorporés au Québec',
  titrePrincipal: 'Ton entreprise te paie bien. Est-ce que ton argent travaille aussi fort que toi?',
  sousTitre:
    "Regarde la vidéo (moins de 5 minutes), puis réserve un appel de 30 minutes pour voir où tu laisses de l'argent sur la table.",

  // ── Bouton d'appel à l'action ──────────────────────────────
  cta: 'Réserver mon appel gratuit',
  ctaSousTexte: '30 minutes · Gratuit · Sans engagement',

  // ── Pour qui ───────────────────────────────────────────────
  pourToiSi: [
    "Tu es incorporé et tu ne sais pas trop quoi faire avec les surplus qui dorment dans ta compagnie",
    "Tu te demandes si tu devrais te payer en salaire ou en dividendes",
    "Ta famille dépend de ton revenu et tu n'es pas certain d'être bien protégé",
    "Tu veux une stratégie claire, pas un vendeur de produits",
  ],
  pasPourToiSi: [
    "Tu cherches un truc pour devenir riche rapidement",
    "Tu n'es pas prêt à regarder tes chiffres honnêtement",
  ],

  // ── Déroulement de l'appel ─────────────────────────────────
  etapes: [
    {
      titre: 'Tu réserves',
      texte: 'Choisis un moment qui te convient dans le calendrier. Ça prend 30 secondes.',
    },
    {
      titre: 'On fait le point',
      texte: "30 minutes en visio pour comprendre ta situation, ta structure et tes objectifs.",
    },
    {
      titre: 'Tu repars avec un plan',
      texte: "Tu sais exactement quelles sont tes 2 ou 3 priorités, que tu travailles avec moi ou non.",
    },
  ],

  // ── À propos ───────────────────────────────────────────────
  aPropos: [
    "J'aide les entrepreneurs incorporés à faire le pont entre leur compagnie et leur patrimoine personnel : rémunération, placements, protection et planification successorale.",
    "Mon approche est simple : comprendre tes chiffres avant de recommander quoi que ce soit.",
  ],
  // Petites pastilles sous ta bio (laisse vide [] pour masquer)
  credentials: [
    'Certificat AMF 269559',
    'Services financiers Christine Bourassa',
    'Rimouski · Rendez-vous virtuels partout au Québec',
  ],

  // ── Outils que tu as bâtis ─────────────────────────────────
  // url peut être un lien externe (https://…) ou une page de ce site ('/…')
  outils: [
    {
      nom: 'Diagnostic financier',
      description: 'Un questionnaire guidé pour voir où tu en es : épargne, protection, retraite.',
      url: '/',
      emoji: '📊',
    },
    // {
    //   nom: 'Calculateur salaire vs dividendes',
    //   description: 'Compare rapidement les deux options selon ton revenu.',
    //   url: 'https://…',
    //   emoji: '🧮',
    // },
  ],

  // ── Témoignages (optionnel : laisse [] pour masquer la section) ──
  // N'utilise que de vrais témoignages, avec l'accord des personnes.
  temoignages: [] as { texte: string; nom: string; detail?: string }[],

  // ── FAQ (lève les objections avant le calendrier) ──────────
  faq: [
    {
      q: "Est-ce que l'appel est vraiment gratuit?",
      r: "Oui. Aucun frais, aucune obligation. Si je ne peux pas t'aider, je vais te le dire.",
    },
    {
      q: "Est-ce que je vais me faire vendre quelque chose?",
      r: "Non. Le but de l'appel est de comprendre ta situation. Si ça a du sens de travailler ensemble, on en parlera après, pas pendant.",
    },
    {
      q: 'Je dois préparer quoi?',
      r: "Rien d'obligatoire. Si tu as tes derniers états financiers ou une idée de ta rémunération, c'est un plus.",
    },
    {
      q: "Ça se passe comment?",
      r: "En visioconférence, partout au Québec (ou en personne à Rimouski si tu préfères). Tu reçois le lien automatiquement après ta réservation.",
    },
  ],

  // ── Pied de page ───────────────────────────────────────────
  mentionLegale:
    "Le contenu de cette page est fourni à titre informatif seulement et ne constitue pas un conseil financier, fiscal ou juridique personnalisé.",
}

export type VslConfig = typeof vslConfig

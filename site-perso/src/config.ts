// =====================================================================
//  CONTENU DU SITE — tout ce qui est modifiable est dans ce fichier.
//  Les articles de blog sont dans src/content/blog/ (un fichier .md par article).
// =====================================================================

export const site = {
  name: 'Anthony Goulet',
  title: 'Anthony Goulet | Conseiller en sécurité financière',
  description:
    'Assurance, épargne et stratégie à long terme pour travailleurs autonomes, athlètes et futurs entrepreneurs. Appel découverte gratuit.',
  url: 'https://anthonygoulet.ca',
};

export const contact = {
  phone: '450-821-4395',
  phoneHref: 'tel:+14508214395',
  email: 'a.goulet@christinebourassa.com',
  instagram: '', // ex. https://instagram.com/tonhandle
  facebook: '',
  tiktok: '',
};

// GoHighLevel
// - Les demandes du formulaire de réservation créent le contact dans GHL (netlify/functions/lead.mjs).
//   La clé se met dans Netlify (variables GHL_TOKEN et GHL_LOCATION_ID), jamais ici.
// - Chat : coller l'identifiant du widget (data-widget-id dans le code d'intégration GHL).
export const ghl = {
  sendLeads: true,
  // Calendrier de réservation (Calendars → Calendar Settings → Embed : la fin du lien /widget/booking/…)
  calendarId: 'k6Pj89RUXQChdKbnCahp',
  chatWidgetId: '',
};

export const legal = {
  title: 'Conseiller en sécurité financière',
  amfNumber: '269559',
  firm: '', // TODO: nom exact du cabinet inscrit à l'AMF
  amfRegistryUrl:
    'https://lautorite.qc.ca/grand-public/registres/registre-des-entreprises-et-des-individus-autorises-a-exercer',
};

// Bouton principal répété partout sur la page
export const cta = {
  label: 'Réserver mon appel découverte',
  note: 'Gratuit · Sans engagement',
};

// HAUT DE PAGE : grande phrase centrée sur une photo plein écran + 3 boutons « chemins »
export const hero = {
  eyebrow: 'Pour travailleurs autonomes, athlètes et futurs entrepreneurs',
  title: 'Protège ce que tu bâtis',
  // Photo plein écran : déposer le fichier dans public/images/ puis indiquer le chemin, ex. '/images/hero.jpg'
  photo: '',
  // Chaque bouton mène à la réservation avec le besoin déjà choisi
  paths: [
    { label: 'Protéger mon revenu', need: 'Protéger mon revenu (assurance)' },
    { label: 'Faire croître mon épargne', need: 'Épargne, REER, CELI' },
    { label: 'Je me lance à mon compte', need: 'Je me lance à mon compte' },
  ],
};

// SECTION FONCÉE « À PROPOS » avec photo détourée et badge nom
export const about = {
  title: 'Parce que ta réussite mérite un vrai plan',
  paragraphs: [
    "Pendant des années, ma vie tournait autour du bodybuilding. Discipline, constance, plan à long terme : j'ai appris ce que ça prend pour atteindre un objectif ambitieux. Mais tout était centré sur moi.",
    "J'ai réalisé que ce qui m'allume vraiment, c'est de travailler avec les autres, pour les autres. Aujourd'hui, je mets la même discipline au service des travailleurs autonomes et des entrepreneurs : je compare plusieurs assureurs pour toi, et tu as accès à moi directement, en tout temps.",
  ],
  // Photo de toi : fichier dans public/images/
  photo: '/images/anthony.jpg',
  // Vidéo de présentation (optionnel) : lien YouTube/Vimeo « embed » ou '/videos/intro.mp4'
  videoUrl: '',
  stats: [
    { value: '50+', label: 'clients accompagnés' },
    { value: '5+ ans', label: 'en finances' },
    { value: '1', label: 'conseiller, plusieurs assureurs' },
  ],
  button: 'En savoir plus sur moi',
};

export const services = {
  title: 'Mes services',
  items: [
    {
      tag: 'Assurance',
      title: 'Protéger ton revenu et tes proches',
      text: 'Assurance vie, invalidité, maladies graves. Je magasine auprès de plusieurs assureurs pour une couverture adaptée à ta réalité.',
    },
    {
      tag: 'Épargne',
      title: 'Faire travailler ton argent',
      text: 'REER, CELI, épargne-retraite : une stratégie à long terme qui suit ton revenu, même quand il varie.',
    },
    {
      tag: 'Réseau',
      title: 'Les bons pros au bon moment',
      text: 'Fiscaliste, courtier hypothécaire, financement d’entreprise… Je te réfère aux bonnes personnes quand ton projet en a besoin.',
    },
  ],
};

// BLOC SÉPARÉ « question + bouton » (comme « Combien vaut ma propriété? »)
export const check = {
  title: 'Es-tu vraiment protégé?',
  text: "Pas d'employeur, pas d'assurance collective, un revenu qui varie : à ton compte, personne ne te protège par défaut. On fait le point ensemble, gratuitement.",
  button: 'Obtenir mon analyse gratuite',
  // Image à droite : '/images/analyse.jpg' (laisser vide pour un motif)
  image: '',
};

export const steps = {
  title: 'Comment ça fonctionne',
  items: [
    {
      title: 'Appel découverte gratuit',
      text: "On jase de ta situation, de tes objectifs et on voit si ça clique. Si un conseil suffit, ça s'arrête là. Aucune obligation.",
    },
    {
      title: 'Analyse et magasinage',
      text: "S'il y a de l'optimisation à faire, je prépare ton analyse et je compare les options de plusieurs compagnies.",
    },
    {
      title: 'Plan et suivi',
      text: 'On met le plan en place ensemble. Ensuite, tu as accès à moi directement, au fil de ta vie et de ton entreprise.',
    },
  ],
};

// Témoignages : laisser la liste vide [] pour cacher la section.
// Ex. { quote: "Anthony a pris le temps...", name: 'Francine' }
export const testimonials: { quote: string; name: string }[] = [];

export const partners = {
  title: 'Mon réseau',
  intro:
    "Ta situation touche plus que l'assurance? J'ai un réseau de professionnels de confiance vers qui je peux te référer.",
  featured: {
    name: 'Milesopedia',
    text: 'Partenaire principal pour tout ce qui touche les cartes de crédit : trouver la carte qui maximise tes récompenses selon tes dépenses.',
    url: '', // TODO: ton lien partenaire
  },
  resources: [
    'Assurance collective',
    'Assurance auto et habitation',
    'Courtier immobilier',
    'Courtier hypothécaire',
    'Fiscaliste',
    'Stratégie RRI',
    'Crédit-bail',
    'Financement d’entreprise',
    'Subventions aux entreprises',
  ],
  disclosure:
    "Je peux recevoir une rémunération ou une commission lorsque tu fais affaire avec un partenaire auquel je t'ai référé. Tu restes libre de choisir le professionnel ou le produit de ton choix.",
};

// Bonus : quiz de vulnérabilité financière (porte d'entrée secondaire)
export const quiz = {
  enabled: false, // passer à true quand le lien est prêt
  url: '',
  title: 'Pas encore prêt à réserver?',
  text: 'Fais le quiz de vulnérabilité financière en 3 minutes et découvre tes zones de risque.',
  button: 'Faire le quiz',
};

export const faq = {
  title: 'Questions fréquentes',
  items: [
    {
      q: "L'appel découverte, c'est vraiment gratuit?",
      a: "Oui. Gratuit et sans engagement. On regarde ta situation ensemble et, si un simple conseil suffit, ça s'arrête là.",
    },
    {
      q: "Je commence à mon compte et j'ai pas un gros budget. C'est pour moi?",
      a: "Oui. C'est justement au début que c'est le plus utile de mettre les bonnes bases en place. On ajuste selon ce qui est réaliste pour toi aujourd'hui.",
    },
    {
      q: 'Tu travailles avec quelles compagnies?',
      a: 'Je ne suis pas attaché à un seul assureur. Je compare les produits de plusieurs compagnies pour te présenter les options qui font du sens pour toi.',
    },
    {
      q: 'Je suis déjà assuré. Ça vaut la peine de te parler?',
      a: "Souvent, oui. Une couverture prise il y a quelques années ne reflète pas toujours ta réalité d'aujourd'hui. On peut la revoir ensemble, sans obligation de changer quoi que ce soit.",
    },
    {
      q: 'Comment es-tu rémunéré?',
      a: "Je suis principalement rémunéré par commission, versée par les compagnies lorsqu'un produit est mis en place. L'appel découverte et l'analyse ne te coûtent rien.",
    },
  ],
};

// RÉSERVATION : calendrier GoHighLevel (ghl.calendarId) + formulaire « Tu préfères m'écrire? »
export const booking = {
  title: 'Réserve ton appel découverte',
  text: 'Choisis le moment qui te convient. On jase de ta situation et de tes objectifs, sans pression.',
  needs: [
    'Protéger mon revenu (assurance)',
    'Épargne, REER, CELI',
    'Je me lance à mon compte',
    'Faire le point sur ma situation',
    'Autre',
  ],
  button: 'Choisir mon moment',
  perks: ['Gratuit', 'Sans engagement', 'Plusieurs assureurs comparés'],
};

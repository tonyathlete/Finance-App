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
  // TODO: coller ton lien Calendly ici (ex. https://calendly.com/anthonygoulet/appel-decouverte)
  calendlyUrl: '',
  phone: '450-821-4395',
  phoneHref: 'tel:+14508214395',
  email: 'en.goulet@commercialchristinebourassa.com',
  instagram: '', // ex. https://instagram.com/tonhandle
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

export const hero = {
  eyebrow: 'Pour travailleurs autonomes, athlètes et futurs entrepreneurs',
  title: 'Tu bâtis à ton compte.',
  titleAccent: 'Protège ce que tu bâtis.',
  subtitle:
    "Assurance, épargne et stratégie à long terme, avec un seul conseiller qui compare pour toi les produits de plusieurs assureurs. Et que tu peux joindre directement quand t'en as besoin.",
  // Vidéo de présentation : lien YouTube ou Vimeo (ex. https://www.youtube.com/embed/XXXX) ou fichier /videos/intro.mp4
  // Laisse vide pour afficher la photo à la place.
  videoUrl: '',
  // Photo : déposer le fichier dans public/images/ puis indiquer le chemin, ex. '/images/anthony.jpg'
  photo: '',
};

// Gros chiffres dans le haut de la page (2 ou 3 maximum)
export const stats = [
  { value: '50+', label: 'Clients\naccompagnés' },
  { value: '5+', label: 'Ans en\nfinances' },
];

export const problems = {
  title: 'Être à ton compte, c’est la liberté. Mais personne ne te protège par défaut.',
  items: [
    {
      title: 'Pas d’assurance collective',
      text: "Pas d'employeur, pas de régime d'assurance. Si tu te blesses ou que tu tombes malade, ton revenu peut s'arrêter du jour au lendemain.",
    },
    {
      title: 'Un revenu qui varie',
      text: 'Des gros mois, des mois tranquilles. Difficile de savoir combien mettre de côté pour l’impôt, la retraite et les imprévus.',
    },
    {
      title: 'Trop d’options, pas de plan',
      text: 'REER, CELI, assurance, placements… Chaque institution te propose ses produits. Dur de savoir ce qui fait vraiment du sens pour toi.',
    },
  ],
};

export const services = {
  title: 'Ce que je fais pour toi',
  items: [
    {
      icon: 'shield',
      title: 'Assurance de personnes',
      text: 'Assurance vie, invalidité, maladies graves. Je magasine auprès de plusieurs assureurs pour trouver une couverture adaptée à ta réalité de travailleur autonome.',
    },
    {
      icon: 'growth',
      title: 'Épargne et stratégie à long terme',
      text: 'REER, CELI, épargne-retraite : on bâtit une stratégie qui suit ton revenu, même quand il varie.',
    },
    {
      icon: 'network',
      title: 'Un réseau de professionnels',
      text: 'Fiscaliste, courtier hypothécaire, financement d’entreprise… Je te réfère aux bonnes personnes quand ton projet en a besoin.',
    },
  ],
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

export const why = {
  title: 'Pourquoi travailler avec moi',
  items: [
    {
      title: 'Accès direct, en tout temps',
      text: "Pas de centre d'appels. Tu as mon numéro, tu m'écris, je te réponds.",
    },
    {
      title: 'Je ne suis pas attaché à une seule compagnie',
      text: 'Je compare plusieurs assureurs. Tu ne te sens jamais pris à une place : je deviens le point central entre toi et les différentes compagnies.',
    },
    {
      title: 'Je comprends ta réalité',
      text: 'Revenu variable, horaire chargé, objectifs ambitieux : je viens du monde de la performance et je travaille avec des gens comme toi.',
    },
  ],
};

// Carte de réservation dans le haut de la page
export const bookCard = {
  title: 'Appel découverte',
  subtitle: 'Gratuit et sans engagement. Remplis ceci et choisis ton moment.',
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

export const about = {
  eyebrow: 'Qui je suis',
  title: 'De la scène de bodybuilding à tes finances',
  // Petits faits sous le texte (comme une fiche)
  facts: [
    { icon: 'shield', label: 'Titre', value: 'Conseiller en sécurité financière' },
    { icon: 'network', label: 'Clientèle', value: 'Travailleurs autonomes et athlètes' },
    { icon: 'check', label: 'Premier appel', value: 'Gratuit' },
  ],
  paragraphs: [
    "Pendant des années, ma vie tournait autour du bodybuilding. Discipline, constance, plan à long terme : j'ai appris ce que ça prend pour atteindre un objectif ambitieux.",
    "Mais à la fin de la journée, tout était centré sur moi. J'ai réalisé que ce qui m'allume vraiment, c'est de travailler avec les autres, pour les autres.",
    "Les finances, c'est primordial pour tout le monde, et encore plus quand t'es travailleur autonome ou entrepreneur. C'est pour ça que j'ai fait le switch : mettre la même discipline au service de tes objectifs.",
  ],
  signature: 'Anthony',
};

// Témoignages : laisser la liste vide [] pour cacher la section.
export const testimonials: { quote: string; name: string; role: string }[] = [];

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

export const booking = {
  title: 'Réserve ton appel découverte',
  text: 'Choisis le moment qui te convient. On jase de ta situation et de tes objectifs, sans pression.',
};

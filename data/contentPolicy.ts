/**
 * Politique de Contenu et Critères de Modération
 * StoryVerse - Plateforme de Storytelling Responsable
 */

export interface ContentPolicy {
  category: string;
  description: string;
  examples: string[];
  severity: 'critical' | 'high' | 'medium' | 'low';
}

export const CONTENT_POLICIES: ContentPolicy[] = [
  {
    category: 'Violence Extrême',
    description: 'Contenu décrivant de manière graphique ou glorifiant la violence extrême, la torture, ou les actes cruels.',
    examples: [
      'Descriptions détaillées de torture',
      'Glorification de meurtres ou massacres',
      'Violence graphique envers les enfants ou animaux',
      'Incitation à la violence',
    ],
    severity: 'critical',
  },
  {
    category: 'Contenu Sexuel Explicite',
    description: 'Contenu pornographique, sexuellement explicite ou impliquant des mineurs.',
    examples: [
      'Descriptions sexuelles explicites',
      'Contenu pornographique',
      'Exploitation sexuelle de mineurs',
      'Contenu pédophile',
    ],
    severity: 'critical',
  },
  {
    category: 'Discours de Haine',
    description: 'Contenu promouvant la haine, la discrimination ou la violence envers des groupes basés sur des caractéristiques protégées.',
    examples: [
      'Racisme, xénophobie',
      'Homophobie, transphobie',
      'Sexisme, misogynie',
      'Discrimination religieuse',
      'Incitation à la haine',
    ],
    severity: 'critical',
  },
  {
    category: 'Terrorisme et Extrémisme',
    description: 'Contenu promouvant, glorifiant ou incitant au terrorisme ou à l\'extrémisme violent.',
    examples: [
      'Propagande terroriste',
      'Instructions pour actes terroristes',
      'Glorification d\'organisations terroristes',
      'Recrutement pour groupes extrémistes',
    ],
    severity: 'critical',
  },
  {
    category: 'Automutilation et Suicide',
    description: 'Contenu encourageant, glorifiant ou donnant des instructions pour l\'automutilation ou le suicide.',
    examples: [
      'Instructions pour se suicider',
      'Glorification de l\'automutilation',
      'Encouragement au suicide',
      'Promotion de troubles alimentaires',
    ],
    severity: 'critical',
  },
  {
    category: 'Activités Illégales',
    description: 'Contenu promouvant ou facilitant des activités illégales.',
    examples: [
      'Trafic de drogue',
      'Vente d\'armes illégales',
      'Fraude et escroquerie',
      'Piratage et cybercriminalité',
      'Contrefaçon',
    ],
    severity: 'high',
  },
  {
    category: 'Désinformation Dangereuse',
    description: 'Fausses informations pouvant causer un préjudice physique ou social grave.',
    examples: [
      'Faux conseils médicaux dangereux',
      'Théories du complot dangereuses',
      'Désinformation électorale',
      'Fausses alertes d\'urgence',
    ],
    severity: 'high',
  },
  {
    category: 'Harcèlement et Intimidation',
    description: 'Contenu visant à harceler, intimider ou menacer des individus.',
    examples: [
      'Menaces directes',
      'Doxxing (divulgation d\'informations personnelles)',
      'Harcèlement ciblé',
      'Intimidation répétée',
    ],
    severity: 'high',
  },
  {
    category: 'Contenu Choquant',
    description: 'Contenu excessivement choquant, dégoûtant ou perturbant sans valeur artistique.',
    examples: [
      'Gore excessif',
      'Contenu scatologique extrême',
      'Images de cadavres',
      'Cruauté animale graphique',
    ],
    severity: 'medium',
  },
  {
    category: 'Spam et Manipulation',
    description: 'Contenu spam, trompeur ou manipulateur.',
    examples: [
      'Publicité déguisée',
      'Clickbait trompeur',
      'Manipulation algorithmique',
      'Contenu dupliqué en masse',
    ],
    severity: 'medium',
  },
];

export interface ModerationCriteria {
  name: string;
  description: string;
  weight: number; // 1-10, 10 étant le plus important
  autoReject: boolean; // Rejet automatique si détecté
}

export const MODERATION_CRITERIA: ModerationCriteria[] = [
  {
    name: 'Langage Offensant',
    description: 'Détection de langage vulgaire, insultant ou offensant excessif',
    weight: 7,
    autoReject: false,
  },
  {
    name: 'Mots-clés Interdits',
    description: 'Présence de mots-clés liés à du contenu illégal ou dangereux',
    weight: 10,
    autoReject: true,
  },
  {
    name: 'Qualité du Contenu',
    description: 'Évaluation de la qualité littéraire et de la cohérence',
    weight: 5,
    autoReject: false,
  },
  {
    name: 'Originalité',
    description: 'Vérification du plagiat et de l\'originalité du contenu',
    weight: 8,
    autoReject: false,
  },
  {
    name: 'Respect des Droits d\'Auteur',
    description: 'Vérification que le contenu ne viole pas de droits d\'auteur',
    weight: 9,
    autoReject: true,
  },
  {
    name: 'Âge Approprié',
    description: 'Vérification que le contenu est approprié pour l\'audience cible',
    weight: 8,
    autoReject: false,
  },
  {
    name: 'Informations Personnelles',
    description: 'Détection de divulgation d\'informations personnelles sensibles',
    weight: 9,
    autoReject: true,
  },
];

// Mots-clés interdits (liste non exhaustive - à compléter)
export const FORBIDDEN_KEYWORDS = [
  // Violence extrême
  'terrorisme', 'attentat', 'bombe', 'explosif',
  // Contenu sexuel explicite avec mineurs
  'pédophilie', 'enfant nu',
  // Drogues illégales (instructions)
  'fabriquer drogue', 'synthétiser',
  // Armes
  'fabriquer arme', 'construire bombe',
  // Suicide
  'comment se suicider', 'méthodes suicide',
];

// Seuils de modération
export const MODERATION_THRESHOLDS = {
  AUTO_APPROVE: 90, // Score >= 90 : Approbation automatique
  MANUAL_REVIEW: 70, // Score 70-89 : Révision manuelle
  AUTO_REJECT: 69,   // Score < 70 : Rejet automatique
};

export interface ModerationResult {
  approved: boolean;
  score: number;
  flags: string[];
  requiresManualReview: boolean;
  rejectionReasons?: string[];
}

/**
 * Fonction de modération de contenu
 * @param content - Le contenu à modérer
 * @returns Résultat de la modération
 */
export function moderateContent(content: string): ModerationResult {
  let score = 100;
  const flags: string[] = [];
  const rejectionReasons: string[] = [];

  const lowerContent = content.toLowerCase();

  // Vérification des mots-clés interdits
  for (const keyword of FORBIDDEN_KEYWORDS) {
    if (lowerContent.includes(keyword.toLowerCase())) {
      score -= 50;
      flags.push(`Mot-clé interdit détecté: ${keyword}`);
      rejectionReasons.push(`Contenu contenant des mots-clés interdits`);
    }
  }

  // Vérification de la longueur minimale
  if (content.length < 100) {
    score -= 20;
    flags.push('Contenu trop court');
  }

  // Vérification de la qualité (basique)
  const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
  if (sentences.length < 3) {
    score -= 10;
    flags.push('Manque de structure narrative');
  }

  // Vérification du langage offensant (liste basique)
  const offensiveWords = ['connard', 'salope', 'putain', 'merde'];
  let offensiveCount = 0;
  for (const word of offensiveWords) {
    const regex = new RegExp(word, 'gi');
    const matches = lowerContent.match(regex);
    if (matches) {
      offensiveCount += matches.length;
    }
  }

  if (offensiveCount > 5) {
    score -= 30;
    flags.push('Langage offensant excessif');
    rejectionReasons.push('Utilisation excessive de langage vulgaire');
  } else if (offensiveCount > 2) {
    score -= 10;
    flags.push('Langage offensant modéré');
  }

  // Déterminer le résultat
  const approved = score >= MODERATION_THRESHOLDS.AUTO_APPROVE;
  const requiresManualReview = 
    score >= MODERATION_THRESHOLDS.MANUAL_REVIEW && 
    score < MODERATION_THRESHOLDS.AUTO_APPROVE;

  return {
    approved,
    score,
    flags,
    requiresManualReview,
    rejectionReasons: rejectionReasons.length > 0 ? rejectionReasons : undefined,
  };
}

/**
 * Guidelines pour les auteurs
 */
export const AUTHOR_GUIDELINES = {
  title: 'Guidelines pour les Auteurs',
  sections: [
    {
      title: 'Contenu Autorisé',
      items: [
        'Histoires originales de tous genres (fiction, fantaisie, science-fiction, romance, etc.)',
        'Contenu créatif et imaginatif',
        'Histoires avec des thèmes matures traités de manière responsable',
        'Fanfiction respectant les droits d\'auteur',
        'Contenu éducatif et informatif',
      ],
    },
    {
      title: 'Contenu Interdit',
      items: [
        'Violence graphique excessive ou gratuite',
        'Contenu sexuel explicite ou pornographique',
        'Discours de haine ou discrimination',
        'Promotion d\'activités illégales',
        'Harcèlement ou intimidation',
        'Désinformation dangereuse',
        'Contenu impliquant des mineurs de manière inappropriée',
      ],
    },
    {
      title: 'Bonnes Pratiques',
      items: [
        'Utilisez des avertissements de contenu appropriés',
        'Respectez les droits d\'auteur et citez vos sources',
        'Relisez et corrigez votre contenu avant publication',
        'Soyez respectueux envers votre audience',
        'Acceptez les critiques constructives',
        'Signalez tout contenu inapproprié que vous rencontrez',
      ],
    },
    {
      title: 'Processus de Modération',
      items: [
        'Toutes les soumissions sont automatiquement analysées',
        'Le contenu suspect est examiné manuellement par notre équipe',
        'Les décisions de modération peuvent être contestées',
        'Les violations répétées peuvent entraîner la suspension du compte',
        'Nous nous réservons le droit de supprimer tout contenu inapproprié',
      ],
    },
  ],
};

export const CONTENT_WARNINGS = [
  'Violence',
  'Langage Adulte',
  'Thèmes Sombres',
  'Mort de Personnages',
  'Contenu Sensible',
  'Thèmes Psychologiques',
  'Horreur',
  'Guerre',
  'Maladie',
  'Deuil',
];

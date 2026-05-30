/**
 * Utilitaires de sanitization pour protéger contre les attaques XSS
 * Pas de dépendance externe — implémentation légère et sécurisée
 */

/**
 * Échappe les caractères HTML dangereux
 */
export function escapeHtml(str: string): string {
  const htmlEscapes: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
  };

  return str.replace(/[&<>"'/]/g, (char) => htmlEscapes[char] || char);
}

/**
 * Supprime toutes les balises HTML d'une chaîne
 */
export function stripHtml(str: string): string {
  return str.replace(/<[^>]*>/g, '');
}

/**
 * Sanitize un texte pour un affichage sûr
 * - Supprime les balises script
 * - Supprime les attributs d'événements (onclick, onerror, etc.)
 * - Supprime les URLs javascript:
 */
export function sanitizeText(str: string): string {
  if (!str) return '';

  let clean = str;

  // Supprimer les balises script et leur contenu
  clean = clean.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

  // Supprimer les balises style et leur contenu
  clean = clean.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');

  // Supprimer les attributs d'événements
  clean = clean.replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, '');
  clean = clean.replace(/\s*on\w+\s*=\s*[^\s>]*/gi, '');

  // Supprimer les URLs javascript:
  clean = clean.replace(/javascript\s*:/gi, '');

  // Supprimer les URLs data: (sauf images)
  clean = clean.replace(/data\s*:[^;]*;/gi, (match) => {
    if (match.startsWith('data:image/')) return match;
    return '';
  });

  return clean;
}

/**
 * Sanitize le contenu d'un chapitre (autorise certaines balises de formatage)
 * Balises autorisées : p, br, strong, em, u, h1-h6, ul, ol, li, blockquote
 */
export function sanitizeContent(str: string): string {
  if (!str) return '';

  let clean = sanitizeText(str);

  // Supprimer les balises non autorisées (garder le contenu)
  const allowedTags = ['p', 'br', 'strong', 'em', 'u', 'b', 'i', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'blockquote'];
  const tagRegex = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi;

  clean = clean.replace(tagRegex, (match, tagName) => {
    if (allowedTags.includes(tagName.toLowerCase())) {
      // Supprimer tous les attributs des balises autorisées
      return match.replace(/\s+[a-z-]+\s*=\s*["'][^"']*["']/gi, '');
    }
    return ''; // Supprimer les balises non autorisées
  });

  return clean;
}

/**
 * Valide et sanitize un titre (pas de HTML, longueur limitée)
 */
export function sanitizeTitle(str: string, maxLength: number = 200): string {
  if (!str) return '';
  return stripHtml(str).trim().slice(0, maxLength);
}

/**
 * Valide et sanitize une description (pas de HTML, longueur limitée)
 */
export function sanitizeDescription(str: string, maxLength: number = 2000): string {
  if (!str) return '';
  return stripHtml(str).trim().slice(0, maxLength);
}

/**
 * Valide une URL (seulement http/https)
 */
export function isValidUrl(str: string): boolean {
  try {
    const url = new URL(str);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

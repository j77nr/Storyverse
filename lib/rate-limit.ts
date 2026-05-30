/**
 * Rate Limiter en mémoire
 * Limite le nombre de requêtes par IP/identifiant dans une fenêtre de temps
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

// Nettoyer les entrées expirées (appelé à chaque vérification)
function cleanup() {
  const now = Date.now();
  // Limiter le nettoyage pour ne pas ralentir
  if (store.size > 1000) {
    for (const [key, entry] of store.entries()) {
      if (now > entry.resetAt) {
        store.delete(key);
      }
    }
  }
}

interface RateLimitConfig {
  /** Nombre maximum de requêtes autorisées */
  maxRequests: number;
  /** Fenêtre de temps en secondes */
  windowSeconds: number;
}

interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetAt: number;
}

/**
 * Vérifie si une requête est autorisée selon le rate limit
 */
export function rateLimit(
  identifier: string,
  config: RateLimitConfig
): RateLimitResult {
  cleanup();
  const now = Date.now();
  const key = identifier;
  const entry = store.get(key);

  // Si pas d'entrée ou fenêtre expirée, créer une nouvelle entrée
  if (!entry || now > entry.resetAt) {
    const resetAt = now + config.windowSeconds * 1000;
    store.set(key, { count: 1, resetAt });
    return {
      success: true,
      remaining: config.maxRequests - 1,
      resetAt,
    };
  }

  // Incrémenter le compteur
  entry.count++;

  // Vérifier si la limite est dépassée
  if (entry.count > config.maxRequests) {
    return {
      success: false,
      remaining: 0,
      resetAt: entry.resetAt,
    };
  }

  return {
    success: true,
    remaining: config.maxRequests - entry.count,
    resetAt: entry.resetAt,
  };
}

/**
 * Configurations prédéfinies
 */
export const rateLimits = {
  /** 10 soumissions par heure */
  submission: { maxRequests: 10, windowSeconds: 3600 },
  /** 5 candidatures par jour */
  application: { maxRequests: 5, windowSeconds: 86400 },
  /** 100 requêtes API par minute */
  api: { maxRequests: 100, windowSeconds: 60 },
  /** 30 likes par minute (anti-spam) */
  interaction: { maxRequests: 30, windowSeconds: 60 },
  /** 3 tentatives de connexion par minute */
  auth: { maxRequests: 3, windowSeconds: 60 },
};

/**
 * Extraire l'identifiant depuis une requête (IP ou user ID)
 */
export function getIdentifier(req: Request, userId?: string): string {
  if (userId) return `user:${userId}`;
  
  // Essayer de récupérer l'IP
  const forwarded = req.headers.get('x-forwarded-for');
  const ip = forwarded?.split(',')[0]?.trim() || 'unknown';
  return `ip:${ip}`;
}

/**
 * Templates d'emails pour StoryVerse
 * Tous les emails sont en HTML avec un design moderne et responsive
 */

const baseStyles = `
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .container {
      background: #ffffff;
      border-radius: 8px;
      padding: 40px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .header {
      text-align: center;
      margin-bottom: 30px;
    }
    .logo {
      font-size: 32px;
      font-weight: bold;
      color: #2563eb;
      margin-bottom: 10px;
    }
    .title {
      font-size: 24px;
      font-weight: bold;
      color: #1f2937;
      margin-bottom: 20px;
    }
    .content {
      font-size: 16px;
      color: #4b5563;
      margin-bottom: 30px;
    }
    .button {
      display: inline-block;
      background: #2563eb;
      color: #ffffff;
      padding: 12px 30px;
      text-decoration: none;
      border-radius: 6px;
      font-weight: 600;
      margin: 20px 0;
    }
    .footer {
      text-align: center;
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #e5e7eb;
      font-size: 14px;
      color: #6b7280;
    }
    .highlight {
      background: #fef3c7;
      padding: 2px 6px;
      border-radius: 3px;
    }
  </style>
`;

export const emailTemplates = {
  /**
   * 1. Email de confirmation de candidature auteur
   */
  applicationReceived: (name: string) => ({
    subject: 'Candidature reçue - StoryVerse',
    html: `
      ${baseStyles}
      <div class="container">
        <div class="header">
          <div class="logo">📚 StoryVerse</div>
        </div>
        
        <h1 class="title">Candidature Reçue !</h1>
        
        <div class="content">
          <p>Bonjour <strong>${name}</strong>,</p>
          
          <p>Nous avons bien reçu votre candidature pour devenir auteur sur StoryVerse ! 🎉</p>
          
          <p>Notre équipe va examiner votre profil et votre motivation dans les prochains jours. Nous vous tiendrons informé(e) de l'avancement de votre candidature par email.</p>
          
          <p><strong>Prochaines étapes :</strong></p>
          <ul>
            <li>Examen de votre candidature par notre équipe</li>
            <li>Notification par email de la décision</li>
            <li>Si approuvé : accès immédiat au dashboard auteur</li>
          </ul>
          
          <p>Merci de votre intérêt pour StoryVerse !</p>
        </div>
        
        <div class="footer">
          <p>© 2024 StoryVerse - Plateforme de Storytelling Interactif</p>
          <p>Cet email a été envoyé automatiquement, merci de ne pas y répondre.</p>
        </div>
      </div>
    `,
  }),

  /**
   * 2. Email d'approbation de candidature
   */
  applicationApproved: (name: string) => ({
    subject: 'Candidature approuvée ! 🎉 - StoryVerse',
    html: `
      ${baseStyles}
      <div class="container">
        <div class="header">
          <div class="logo">📚 StoryVerse</div>
        </div>
        
        <h1 class="title">Félicitations ${name} ! 🎉</h1>
        
        <div class="content">
          <p>Excellente nouvelle ! Votre candidature pour devenir auteur sur StoryVerse a été <span class="highlight">approuvée</span> !</p>
          
          <p>Vous pouvez maintenant :</p>
          <ul>
            <li>✍️ Créer et publier vos histoires</li>
            <li>📊 Suivre vos statistiques en temps réel</li>
            <li>👥 Rejoindre notre communauté d'auteurs</li>
            <li>🎨 Personnaliser vos récits avec des thèmes uniques</li>
          </ul>
          
          <p style="text-align: center;">
            <a href="${process.env.NEXTAUTH_URL}/author/dashboard" class="button">
              Accéder au Dashboard Auteur
            </a>
          </p>
          
          <p><strong>Conseils pour bien démarrer :</strong></p>
          <ol>
            <li>Explorez le dashboard pour vous familiariser avec l'interface</li>
            <li>Lisez nos guidelines de contenu</li>
            <li>Commencez par une histoire courte pour tester</li>
            <li>N'hésitez pas à nous contacter si vous avez des questions</li>
          </ol>
          
          <p>Bienvenue dans la famille StoryVerse ! 🚀</p>
        </div>
        
        <div class="footer">
          <p>© 2024 StoryVerse - Plateforme de Storytelling Interactif</p>
        </div>
      </div>
    `,
  }),

  /**
   * 3. Email de rejet de candidature
   */
  applicationRejected: (name: string, reason?: string) => ({
    subject: 'Candidature non retenue - StoryVerse',
    html: `
      ${baseStyles}
      <div class="container">
        <div class="header">
          <div class="logo">📚 StoryVerse</div>
        </div>
        
        <h1 class="title">Candidature Non Retenue</h1>
        
        <div class="content">
          <p>Bonjour ${name},</p>
          
          <p>Merci d'avoir postulé pour devenir auteur sur StoryVerse.</p>
          
          <p>Après examen de votre candidature, nous ne pouvons malheureusement pas l'accepter pour le moment.</p>
          
          ${reason ? `
            <p><strong>Raison :</strong></p>
            <p style="background: #fef2f2; padding: 15px; border-left: 4px solid #ef4444; border-radius: 4px;">
              ${reason}
            </p>
          ` : ''}
          
          <p><strong>Vous pouvez :</strong></p>
          <ul>
            <li>Continuer à lire et découvrir des histoires sur StoryVerse</li>
            <li>Soumettre une nouvelle candidature dans 30 jours</li>
            <li>Nous contacter si vous avez des questions</li>
          </ul>
          
          <p>Nous vous encourageons à continuer à écrire et à développer votre style !</p>
        </div>
        
        <div class="footer">
          <p>© 2024 StoryVerse - Plateforme de Storytelling Interactif</p>
        </div>
      </div>
    `,
  }),

  /**
   * 4. Email d'histoire publiée
   */
  storyPublished: (name: string, storyTitle: string, storyId: string) => ({
    subject: `Votre histoire "${storyTitle}" est publiée ! 🎉`,
    html: `
      ${baseStyles}
      <div class="container">
        <div class="header">
          <div class="logo">📚 StoryVerse</div>
        </div>
        
        <h1 class="title">Histoire Publiée ! 🎉</h1>
        
        <div class="content">
          <p>Bravo <strong>${name}</strong> !</p>
          
          <p>Votre histoire <span class="highlight">"${storyTitle}"</span> a été publiée avec succès sur StoryVerse !</p>
          
          <p>Elle est maintenant visible par tous les lecteurs de la plateforme. 🌟</p>
          
          <p style="text-align: center;">
            <a href="${process.env.NEXTAUTH_URL}/stories/${storyId}" class="button">
              Voir Mon Histoire
            </a>
          </p>
          
          <p><strong>Prochaines étapes :</strong></p>
          <ul>
            <li>📊 Suivez vos statistiques dans le dashboard</li>
            <li>💬 Répondez aux commentaires de vos lecteurs</li>
            <li>✍️ Continuez à écrire de nouveaux chapitres</li>
            <li>📢 Partagez votre histoire sur les réseaux sociaux</li>
          </ul>
          
          <p>Félicitations pour cette publication ! 🚀</p>
        </div>
        
        <div class="footer">
          <p>© 2024 StoryVerse - Plateforme de Storytelling Interactif</p>
        </div>
      </div>
    `,
  }),

  /**
   * 5. Email d'histoire en attente de modération
   */
  storyPending: (name: string, storyTitle: string) => ({
    subject: `Votre histoire "${storyTitle}" est en cours de modération`,
    html: `
      ${baseStyles}
      <div class="container">
        <div class="header">
          <div class="logo">📚 StoryVerse</div>
        </div>
        
        <h1 class="title">Histoire en Modération</h1>
        
        <div class="content">
          <p>Bonjour <strong>${name}</strong>,</p>
          
          <p>Votre histoire <span class="highlight">"${storyTitle}"</span> a été soumise avec succès !</p>
          
          <p>Elle est actuellement en cours de modération par notre équipe. Ce processus prend généralement <strong>24 à 48 heures</strong>.</p>
          
          <p><strong>Que se passe-t-il maintenant ?</strong></p>
          <ul>
            <li>🔍 Notre système de modération automatique analyse le contenu</li>
            <li>👥 Si nécessaire, notre équipe effectue une revue manuelle</li>
            <li>✅ Vous recevrez un email dès que la décision sera prise</li>
          </ul>
          
          <p><strong>Critères de modération :</strong></p>
          <ul>
            <li>Respect des guidelines de contenu</li>
            <li>Qualité de l'écriture et de la narration</li>
            <li>Absence de contenu inapproprié</li>
          </ul>
          
          <p>Merci de votre patience ! 🙏</p>
        </div>
        
        <div class="footer">
          <p>© 2024 StoryVerse - Plateforme de Storytelling Interactif</p>
        </div>
      </div>
    `,
  }),

  /**
   * 6. Email d'histoire rejetée
   */
  storyRejected: (name: string, storyTitle: string, reason: string) => ({
    subject: `Votre histoire "${storyTitle}" nécessite des modifications`,
    html: `
      ${baseStyles}
      <div class="container">
        <div class="header">
          <div class="logo">📚 StoryVerse</div>
        </div>
        
        <h1 class="title">Histoire Non Approuvée</h1>
        
        <div class="content">
          <p>Bonjour <strong>${name}</strong>,</p>
          
          <p>Votre histoire <span class="highlight">"${storyTitle}"</span> n'a pas pu être approuvée pour publication.</p>
          
          <p><strong>Raison du rejet :</strong></p>
          <div style="background: #fef2f2; padding: 15px; border-left: 4px solid #ef4444; border-radius: 4px; margin: 20px 0;">
            ${reason}
          </div>
          
          <p><strong>Que faire maintenant ?</strong></p>
          <ul>
            <li>📝 Modifiez votre histoire en tenant compte des remarques</li>
            <li>🔄 Soumettez à nouveau votre histoire</li>
            <li>📖 Consultez nos guidelines de contenu</li>
            <li>💬 Contactez-nous si vous avez des questions</li>
          </ul>
          
          <p style="text-align: center;">
            <a href="${process.env.NEXTAUTH_URL}/author/dashboard" class="button">
              Modifier Mon Histoire
            </a>
          </p>
          
          <p>Ne vous découragez pas ! Chaque auteur passe par ce processus. 💪</p>
        </div>
        
        <div class="footer">
          <p>© 2024 StoryVerse - Plateforme de Storytelling Interactif</p>
        </div>
      </div>
    `,
  }),

  /**
   * 7. Email de bienvenue
   */
  welcome: (name: string) => ({
    subject: 'Bienvenue sur StoryVerse ! 👋',
    html: `
      ${baseStyles}
      <div class="container">
        <div class="header">
          <div class="logo">📚 StoryVerse</div>
        </div>
        
        <h1 class="title">Bienvenue ${name} ! 👋</h1>
        
        <div class="content">
          <p>Nous sommes ravis de vous accueillir sur <strong>StoryVerse</strong>, votre nouvelle plateforme de storytelling interactif !</p>
          
          <p><strong>Que pouvez-vous faire sur StoryVerse ?</strong></p>
          <ul>
            <li>📖 Découvrir des histoires captivantes</li>
            <li>🎨 Profiter d'une expérience de lecture immersive</li>
            <li>👥 Suivre vos auteurs préférés</li>
            <li>✍️ Devenir auteur et partager vos récits</li>
          </ul>
          
          <p style="text-align: center;">
            <a href="${process.env.NEXTAUTH_URL}/library" class="button">
              Explorer la Bibliothèque
            </a>
          </p>
          
          <p><strong>Envie de devenir auteur ?</strong></p>
          <p>Partagez vos histoires avec notre communauté ! Postulez pour devenir auteur et commencez à publier vos récits.</p>
          
          <p style="text-align: center;">
            <a href="${process.env.NEXTAUTH_URL}/become-author" class="button" style="background: #10b981;">
              Devenir Auteur
            </a>
          </p>
          
          <p>Bonne lecture et bienvenue dans la famille StoryVerse ! 🚀</p>
        </div>
        
        <div class="footer">
          <p>© 2024 StoryVerse - Plateforme de Storytelling Interactif</p>
          <p>
            <a href="${process.env.NEXTAUTH_URL}" style="color: #2563eb; text-decoration: none;">Visiter StoryVerse</a> |
            <a href="${process.env.NEXTAUTH_URL}/about" style="color: #2563eb; text-decoration: none;">À Propos</a>
          </p>
        </div>
      </div>
    `,
  }),
};

/**
 * Helper pour obtenir un template
 */
export function getEmailTemplate(
  type: keyof typeof emailTemplates,
  ...args: any[]
): { subject: string; html: string } {
  const template = emailTemplates[type];
  if (!template) {
    throw new Error(`Email template "${type}" not found`);
  }
  return (template as any)(...args);
}

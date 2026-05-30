import { Resend } from 'resend';

// Initialiser Resend seulement si la clé API est disponible
let resend: Resend | null = null;

function getResendClient(): Resend | null {
  if (!process.env.RESEND_API_KEY) return null;
  if (!resend) {
    resend = new Resend(process.env.RESEND_API_KEY);
  }
  return resend;
}

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

/**
 * Envoyer un email via Resend
 */
export async function sendEmail({ to, subject, html }: EmailOptions) {
  try {
    // Vérifier que la clé API est configurée
    if (!process.env.RESEND_API_KEY) {
      console.warn('⚠️  RESEND_API_KEY not configured. Email not sent.');
      console.log('📧 Email would have been sent to:', to);
      console.log('📧 Subject:', subject);
      return { success: false, error: 'RESEND_API_KEY not configured' };
    }

    const client = getResendClient();
    if (!client) {
      return { success: false, error: 'Email client not available' };
    }

    // Envoyer l'email
    const { data, error } = await client.emails.send({
      from: process.env.EMAIL_FROM || 'StoryVerse <noreply@storyverse.com>',
      to,
      subject,
      html,
    });

    if (error) {
      console.error('❌ Error sending email:', error);
      return { success: false, error: error.message };
    }

    console.log('✅ Email sent successfully to:', to);
    return { success: true, data };
  } catch (error) {
    console.error('❌ Error sending email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Envoyer plusieurs emails en parallèle
 */
export async function sendBulkEmails(emails: EmailOptions[]) {
  const results = await Promise.allSettled(
    emails.map((email) => sendEmail(email))
  );

  const successful = results.filter((r) => r.status === 'fulfilled').length;
  const failed = results.filter((r) => r.status === 'rejected').length;

  console.log(`📧 Bulk email results: ${successful} sent, ${failed} failed`);

  return { successful, failed, results };
}

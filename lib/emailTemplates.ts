interface EmailTemplate {
  subject: string
  html: string
}

export function getWelcomeEmail(name: string, locale = 'en'): EmailTemplate {
  const translations: Record<string, EmailTemplate> = {
    en: {
      subject: 'Welcome to Smart-Win',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #000; padding: 20px; text-align: center;">
            <h1 style="color: #FFD900; margin: 0;">Smart-Win</h1>
          </div>
          <div style="padding: 30px; background: #fff;">
            <h2 style="color: #000;">Welcome, ${name}!</h2>
            <p>Thank you for registering with Smart-Win. Your account has been created successfully.</p>
            <p>To unlock your premium dashboard and access verified match proofs, please complete your payment of <strong>$100</strong>.</p>
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" style="display: inline-block; background: #FF181A; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 20px 0;">Go to Dashboard</a>
            <p style="color: #666; font-size: 14px;">If you have any questions, contact us at support@smartwin.example</p>
          </div>
        </div>
      `
    },
    es: {
      subject: 'Bienvenido a Smart-Win',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #000; padding: 20px; text-align: center;">
            <h1 style="color: #FFD900; margin: 0;">Smart-Win</h1>
          </div>
          <div style="padding: 30px; background: #fff;">
            <h2 style="color: #000;">¡Bienvenido, ${name}!</h2>
            <p>Gracias por registrarte en Smart-Win. Tu cuenta ha sido creada exitosamente.</p>
            <p>Para desbloquear tu panel premium y acceder a pruebas verificadas, completa tu pago de <strong>$100</strong>.</p>
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" style="display: inline-block; background: #FF181A; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 20px 0;">Ir al Panel</a>
            <p style="color: #666; font-size: 14px;">Si tienes preguntas, contáctanos en support@smartwin.example</p>
          </div>
        </div>
      `
    },
    fr: {
      subject: 'Bienvenue chez Smart-Win',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #000; padding: 20px; text-align: center;">
            <h1 style="color: #FFD900; margin: 0;">Smart-Win</h1>
          </div>
          <div style="padding: 30px; background: #fff;">
            <h2 style="color: #000;">Bienvenue, ${name}!</h2>
            <p>Merci de vous être inscrit sur Smart-Win. Votre compte a été créé avec succès.</p>
            <p>Pour déverrouiller votre tableau de bord premium et accéder aux preuves vérifiées, veuillez effectuer votre paiement de <strong>$100</strong>.</p>
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" style="display: inline-block; background: #FF181A; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 20px 0;">Aller au Tableau</a>
            <p style="color: #666; font-size: 14px;">Pour toute question, contactez-nous à support@smartwin.example</p>
          </div>
        </div>
      `
    }
  }
  return translations[locale] || translations.en
}

export function getPaymentConfirmationEmail(name: string, locale = 'en'): EmailTemplate {
  const translations: Record<string, EmailTemplate> = {
    en: {
      subject: 'Payment Confirmed - Dashboard Unlocked',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #000; padding: 20px; text-align: center;">
            <h1 style="color: #FFD900; margin: 0;">Smart-Win</h1>
          </div>
          <div style="padding: 30px; background: #fff;">
            <h2 style="color: #000;">Payment Confirmed!</h2>
            <p>Hi ${name},</p>
            <p>Your payment of <strong>$100</strong> has been successfully processed.</p>
            <p style="color: #FF181A; font-weight: bold;">Your premium dashboard is now unlocked!</p>
            <p>Access exclusive verified match proofs, historical data, and contact our team for match negotiations.</p>
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" style="display: inline-block; background: #FF181A; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 20px 0;">Access Dashboard</a>
            <p style="color: #666; font-size: 14px;">For support, email us at support@smartwin.example</p>
          </div>
        </div>
      `
    },
    es: {
      subject: 'Pago Confirmado - Panel Desbloqueado',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #000; padding: 20px; text-align: center;">
            <h1 style="color: #FFD900; margin: 0;">Smart-Win</h1>
          </div>
          <div style="padding: 30px; background: #fff;">
            <h2 style="color: #000;">¡Pago Confirmado!</h2>
            <p>Hola ${name},</p>
            <p>Tu pago de <strong>$100</strong> ha sido procesado exitosamente.</p>
            <p style="color: #FF181A; font-weight: bold;">¡Tu panel premium está ahora desbloqueado!</p>
            <p>Accede a pruebas verificadas exclusivas, datos históricos y contacta a nuestro equipo.</p>
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" style="display: inline-block; background: #FF181A; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 20px 0;">Acceder al Panel</a>
            <p style="color: #666; font-size: 14px;">Para soporte, escríbenos a support@smartwin.example</p>
          </div>
        </div>
      `
    }
  }
  return translations[locale] || translations.en
}

const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Sends a password reset email with a styled HTML template using Resend.
 * @param {string} to - Recipient email address
 * @param {string} name - Recipient's name
 * @param {string} resetLink - Full URL to the reset password page
 */
async function sendPasswordResetEmail(to, name, resetLink) {
  const html = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 520px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e5e7eb;">
      <div style="background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); padding: 32px 24px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 700;">ModuComm</h1>
      </div>
      <div style="padding: 32px 24px;">
        <p style="color: #374151; font-size: 16px; margin: 0 0 16px;">Hi <strong>${name}</strong>,</p>
        <p style="color: #6b7280; font-size: 15px; line-height: 1.6; margin: 0 0 24px;">
          We received a request to reset your password. Click the button below to choose a new one. This link is valid for <strong>1 hour</strong>.
        </p>
        <div style="text-align: center; margin: 0 0 24px;">
          <a href="${resetLink}" style="display: inline-block; background: #4f46e5; color: #ffffff; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 15px;">
            Reset Password
          </a>
        </div>
        <p style="color: #9ca3af; font-size: 13px; line-height: 1.5; margin: 0;">
          If you didn't request this, you can safely ignore this email. Your password will remain unchanged.
        </p>
      </div>
      <div style="background: #f9fafb; padding: 16px 24px; text-align: center; border-top: 1px solid #e5e7eb;">
        <p style="color: #9ca3af; font-size: 12px; margin: 0;">&copy; ${new Date().getFullYear()} ModuComm. All rights reserved.</p>
      </div>
    </div>
  `;

  const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';

  await resend.emails.send({
    from: `ModuComm <${fromEmail}>`,
    to,
    subject: 'Reset your ModuComm password',
    html,
  });
}

module.exports = { sendPasswordResetEmail };

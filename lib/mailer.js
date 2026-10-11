import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';

const EMAIL_ENABLED = (process.env.EMAIL_ENABLED ?? 'true') === 'true';

let transporter = null;
let logoContent;

function getTransporter() {
  if (transporter) return transporter;

  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 465);
  const secure = (process.env.SMTP_SECURE ?? 'true') === 'true';
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    throw new Error('SMTP configuration missing. Set SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS.');
  }

  // Reused across requests (pooled connections) instead of reconnecting for every email.
  transporter = nodemailer.createTransport({ host, port, secure, pool: true, auth: { user, pass } });
  return transporter;
}

function getLogo() {
  if (logoContent === undefined) {
    const logoPath = path.join(process.cwd(), 'public', 'yutira-logo.jpeg');
    logoContent = fs.existsSync(logoPath) ? fs.readFileSync(logoPath) : null;
  }
  return logoContent;
}

export function escapeHtml(str) {
  return String(str ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function baseHtml({ title, preheader, contentHtml }) {
  const fromName = escapeHtml(process.env.SMTP_FROM_NAME || 'Yutira 2026');
  return `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>${escapeHtml(title)}</title>
    </head>
    <body style="margin:0; padding:0; background:#0b0f19; color:#ffffff; font-family:Arial,Helvetica,sans-serif;">
      <div style="display:none; max-height:0; overflow:hidden; opacity:0;">${escapeHtml(preheader || '')}</div>
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#0b0f19; padding:24px 12px;">
        <tr>
          <td align="center">
            <table role="presentation" width="640" cellspacing="0" cellpadding="0" style="width:640px; max-width:100%;">
              <tr>
                <td style="padding:18px 18px 0 18px;">
                  <table role="presentation" cellspacing="0" cellpadding="0">
                    <tr>
                      <td style="padding-right:12px;">
                        <img src="cid:yutiraLogo" alt="Yutira 2026" width="96" height="56" style="border-radius:12px; display:block;" />
                      </td>
                      <td>
                        <div style="font-size:18px; font-weight:700; line-height:1.2; color:#ffc83d;">${fromName}</div>
                        <div style="font-size:12px; color:rgba(255,255,255,0.75); line-height:1.4;">Department of Civil Engineering, PSG College of Technology</div>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td style="padding:18px;">
                  <div style="background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.14); border-radius:16px; padding:18px;">
                    ${contentHtml}
                  </div>
                </td>
              </tr>
              <tr>
                <td style="padding:0 18px 18px 18px; color:rgba(255,255,255,0.6); font-size:12px; line-height:1.6;">
                  <div>March 27 &amp; March 28, 2026 &bull; Bridging Ideas, Building Realities</div>
                  <div style="margin-top:6px;">If you didn't request this, you can ignore this email.</div>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>`;
}

export async function sendMail({ to, subject, title, preheader, contentHtml }) {
  if (!EMAIL_ENABLED) {
    // For offline testing when SMTP isn't configured.
    console.log('[EMAIL_DISABLED] to:', to);
    console.log('subject:', subject);
    return;
  }

  const fromName = process.env.SMTP_FROM_NAME || 'Yutira 2026';
  const from = `${fromName} <${process.env.SMTP_USER}>`;
  const logo = getLogo();

  await getTransporter().sendMail({
    from,
    to,
    subject,
    html: baseHtml({ title: title || subject, preheader, contentHtml }),
    attachments: logo ? [{ filename: 'yutira-logo.jpeg', content: logo, cid: 'yutiraLogo' }] : []
  });
}

export function button(href, text) {
  return `
    <div style="margin:16px 0;">
      <a href="${escapeHtml(href)}" style="display:inline-block; background:#ffc83d; color:#000000; text-decoration:none; padding:12px 16px; border-radius:12px; font-weight:700; font-size:14px;">${escapeHtml(text)}</a>
    </div>
  `;
}

/** Note: `text` may contain trusted markup; escape user data with escapeHtml() before passing it in. */
export function p(text) {
  return `<p style="margin:0 0 12px 0; color:rgba(255,255,255,0.92); font-size:14px; line-height:1.7;">${text}</p>`;
}

export function small(text) {
  return `<p style="margin:10px 0 0 0; color:rgba(255,255,255,0.7); font-size:12px; line-height:1.6;">${text}</p>`;
}

export function h2(text) {
  return `<h2 style="margin:0 0 10px 0; font-size:18px; line-height:1.35;">${escapeHtml(text)}</h2>`;
}

export function linkText(href) {
  return `<a href="${escapeHtml(href)}" style="color:#ffc83d; word-break:break-all;">${escapeHtml(href)}</a>`;
}

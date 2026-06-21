import type { EmailBranding } from "@/lib/email/branding";

export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function renderTemplate(
  template: string,
  vars: Record<string, string>
): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key: string) => {
    const value = vars[key];
    return value !== undefined ? escapeHtml(value) : `{{${key}}}`;
  });
}

type EmailLayoutOptions = {
  branding: EmailBranding;
  title: string;
  titleColor?: string;
  bodyHtml: string;
  preheader?: string;
};

export function buildEmailLayout({
  branding,
  title,
  titleColor,
  bodyHtml,
  preheader,
}: EmailLayoutOptions): string {
  const primary = branding.primaryColor;
  const accent = titleColor ?? primary;
  const logoBlock = branding.logoUrl
    ? `<img src="${escapeHtml(branding.logoUrl)}" alt="${escapeHtml(branding.collegeName)}" width="48" height="48" style="display:block;height:48px;width:48px;object-fit:contain;" />`
    : `<div style="width:48px;height:48px;border-radius:4px;border:1px solid #E2E6E3;background:#FBFBF9;color:${primary};font-family:Georgia,serif;font-size:14px;font-weight:600;line-height:48px;text-align:center;">NMTC</div>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="color-scheme" content="light" />
  <title>${escapeHtml(title)}</title>
</head>
<body style="margin:0;padding:0;background:#F3F5F4;font-family:Inter,Segoe UI,Helvetica,Arial,sans-serif;color:#14241B;-webkit-text-size-adjust:100%;">
  ${preheader ? `<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(preheader)}</div>` : ""}
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F3F5F4;padding:24px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#FFFFFF;border:1px solid #E2E6E3;border-radius:4px;overflow:hidden;">
          <tr>
            <td style="background:${primary};padding:20px 24px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td width="56" valign="middle">${logoBlock}</td>
                  <td valign="middle" style="padding-left:12px;">
                    <p style="margin:0;font-family:Georgia,'Source Serif 4',serif;font-size:18px;font-weight:600;color:#FFFFFF;line-height:1.3;">${escapeHtml(branding.collegeName)}</p>
                    ${branding.motto ? `<p style="margin:4px 0 0;font-size:12px;color:rgba(255,255,255,0.85);line-height:1.4;">${escapeHtml(branding.motto)}</p>` : ""}
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:28px 24px 8px;">
              <h1 style="margin:0 0 20px;font-family:Georgia,'Source Serif 4',serif;font-size:22px;font-weight:600;color:${accent};line-height:1.3;">${escapeHtml(title)}</h1>
              ${bodyHtml}
            </td>
          </tr>
          <tr>
            <td style="padding:8px 24px 24px;border-top:1px solid #E2E6E3;">
              <p style="margin:0 0 8px;font-size:13px;color:#6B7A72;line-height:1.5;">${escapeHtml(branding.collegeName)}</p>
              <p style="margin:0;font-size:12px;color:#6B7A72;line-height:1.5;">
                <a href="${escapeHtml(branding.siteUrl)}" style="color:${primary};text-decoration:none;">${escapeHtml(branding.siteUrl.replace(/^https?:\/\//, ""))}</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function referenceBox(referenceNo: string): string {
  return `<p style="margin:20px 0;padding:16px;background:#FBFBF9;border:1px solid #E2E6E3;border-radius:4px;">
    <span style="display:block;font-size:11px;text-transform:uppercase;letter-spacing:0.08em;color:#6B7A72;margin-bottom:6px;">Reference number</span>
    <span style="font-family:'IBM Plex Mono',ui-monospace,monospace;font-size:18px;font-weight:500;color:#14241B;">${escapeHtml(referenceNo)}</span>
  </p>`;
}

export function reasonBox(reason: string, accentColor: string): string {
  return `<p style="margin:20px 0;padding:16px;background:#FBFBF9;border-left:3px solid ${accentColor};border-radius:0 4px 4px 0;color:#14241B;white-space:pre-wrap;line-height:1.6;">${escapeHtml(reason)}</p>`;
}

export function emailButton(href: string, label: string, primaryColor: string): string {
  return `<p style="margin:24px 0;">
    <a href="${escapeHtml(href)}" style="display:inline-block;background:${primaryColor};color:#FFFFFF;text-decoration:none;font-size:14px;font-weight:600;padding:12px 20px;border-radius:4px;">${escapeHtml(label)}</a>
  </p>`;
}

export function emailParagraph(html: string): string {
  return `<p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#14241B;">${html}</p>`;
}

export function emailLink(href: string, label: string, primaryColor: string): string {
  return `<a href="${escapeHtml(href)}" style="color:${primaryColor};text-decoration:underline;">${escapeHtml(label)}</a>`;
}

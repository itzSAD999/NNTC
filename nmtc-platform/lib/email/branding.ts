import type { Settings } from "@/types/database";
import { DEFAULT_SETTINGS } from "@/lib/data/settings";
import { getSettings } from "@/lib/data/settings";
import { getSiteUrl } from "@/lib/utils/format";

export type EmailBranding = {
  collegeName: string;
  motto: string;
  logoUrl: string | null;
  primaryColor: string;
  accentColor: string;
  siteUrl: string;
  notificationTemplate: string | null;
};

export async function getEmailBranding(): Promise<EmailBranding> {
  const settings = await getSettings();

  return {
    collegeName: settings.college_name ?? DEFAULT_SETTINGS.college_name,
    motto: settings.motto ?? DEFAULT_SETTINGS.motto,
    logoUrl: settings.logo_url,
    primaryColor: settings.primary_color ?? "#1A5E3A",
    accentColor: settings.accent_color ?? "#9A1B2F",
    siteUrl: getSiteUrl(),
    notificationTemplate: settings.notification_email_template,
  };
}

export function brandingFromSettings(settings: Settings): EmailBranding {
  return {
    collegeName: settings.college_name,
    motto: settings.motto,
    logoUrl: settings.logo_url,
    primaryColor: settings.primary_color ?? "#1A5E3A",
    accentColor: settings.accent_color ?? "#9A1B2F",
    siteUrl: getSiteUrl(),
    notificationTemplate: settings.notification_email_template,
  };
}

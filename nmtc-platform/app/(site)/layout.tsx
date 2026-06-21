import { SiteShell } from "@/components/layout/site-shell";
import { getSettings } from "@/lib/data/settings";

export default async function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSettings();

  return <SiteShell settings={settings}>{children}</SiteShell>;
}

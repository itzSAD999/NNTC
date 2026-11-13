"use client";

import { NavThemeProvider } from "@/components/layout/nav-theme";
import { SiteHeader } from "@/components/layout/site-header";
import type { Settings } from "@/types/database";

export function PublicChrome({ settings }: { settings: Settings }) {
  return (
    <NavThemeProvider>
      <SiteHeader settings={settings} />
    </NavThemeProvider>
  );
}

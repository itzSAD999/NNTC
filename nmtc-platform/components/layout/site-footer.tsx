import {
  FacebookMark,
  InstagramMark,
  WhatsAppMark,
  XMark,
} from "@/components/layout/social-icons";
import { FooterColumns } from "@/components/layout/footer-columns";
import type { Settings } from "@/types/database";

interface SiteFooterProps {
  settings: Settings;
}

export function SiteFooter({ settings }: SiteFooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer data-nav="dark" className="mt-auto bg-primary text-ink">
      <div className="section-grid py-14 md:py-16">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_1.6fr] lg:items-start">
          <div>
            <p className="font-serif text-3xl font-medium tracking-tight text-ink sm:text-4xl">
              Stay in the know
            </p>
            <p className="mt-3 max-w-xs text-sm text-ink/75">
              {settings.college_name}
              {settings.motto ? ` — ${settings.motto}` : null}
            </p>
            <div className="mt-6 flex flex-wrap gap-4">
              {settings.facebook_url ? (
                <a
                  href={settings.facebook_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="text-ink/80 hover:text-ink"
                >
                  <FacebookMark />
                </a>
              ) : null}
              {settings.instagram_url ? (
                <a
                  href={settings.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="text-ink/80 hover:text-ink"
                >
                  <InstagramMark />
                </a>
              ) : null}
              {settings.whatsapp ? (
                <a
                  href={`https://wa.me/${settings.whatsapp.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp"
                  className="text-ink/80 hover:text-ink"
                >
                  <WhatsAppMark />
                </a>
              ) : null}
              {settings.x_url ? (
                <a
                  href={settings.x_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="X (Twitter)"
                  className="text-ink/80 hover:text-ink"
                >
                  <XMark />
                </a>
              ) : null}
            </div>
          </div>

          <nav aria-label="Footer">
            <FooterColumns />
          </nav>
        </div>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <p className="text-xs text-ink/70">
            © {year} {settings.college_name}. All rights reserved.
          </p>
          <p className="text-xs text-ink/70">
            Built by{" "}
            <a
              href="https://mistarstudio.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-ink"
            >
              Mistar Studio
            </a>
          </p>
        </div>
      </div>

      <div className="overflow-hidden px-4 pb-4 sm:px-6 lg:px-8">
        <p className="select-none font-serif text-[clamp(2.8rem,14vw,11rem)] font-bold leading-[0.85] tracking-tight text-ink">
          NANDOM NMTC
        </p>
      </div>
    </footer>
  );
}

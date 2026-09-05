"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";

type TurnstileWidgetProps = {
  onToken: (token: string) => void;
  onExpire?: () => void;
};

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement,
        options: {
          sitekey: string;
          callback: (token: string) => void;
          "expired-callback"?: () => void;
          theme?: "light" | "dark" | "auto";
        }
      ) => string;
      reset: (widgetId: string) => void;
    };
  }
}

export function TurnstileWidget({ onToken, onExpire }: TurnstileWidgetProps) {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim();
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!ready || !siteKey || !containerRef.current || !window.turnstile) {
      return;
    }

    if (widgetIdRef.current) {
      window.turnstile.reset(widgetIdRef.current);
      return;
    }

    widgetIdRef.current = window.turnstile.render(containerRef.current, {
      sitekey: siteKey,
      callback: onToken,
      "expired-callback": onExpire,
      theme: "light",
    });
  }, [ready, siteKey, onToken, onExpire]);

  if (!siteKey) {
    if (process.env.NODE_ENV === "production") {
      return (
        <p className="text-xs text-danger">
          Security verification is not configured.
        </p>
      );
    }
    return (
      <p className="text-xs text-caption">
        Turnstile disabled in development (set NEXT_PUBLIC_TURNSTILE_SITE_KEY).
      </p>
    );
  }

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="lazyOnload"
        onLoad={() => setReady(true)}
      />
      <div ref={containerRef} className="min-h-[65px]" aria-label="Security check" />
    </>
  );
}

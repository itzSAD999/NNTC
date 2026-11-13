"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";

export type NavTheme = "hero" | "dark" | "light";

const NavThemeContext = createContext<NavTheme>("light");

export function useNavTheme() {
  return useContext(NavThemeContext);
}

function readThemeAtProbe(isHome: boolean): NavTheme {
  const probe = 56;
  const nodes = document.querySelectorAll<HTMLElement>("[data-nav]");
  let match: NavTheme = isHome ? "hero" : "light";
  nodes.forEach((node) => {
    const rect = node.getBoundingClientRect();
    if (rect.top <= probe && rect.bottom > probe) {
      const value = node.getAttribute("data-nav");
      if (value === "hero" || value === "dark" || value === "light") {
        match = value;
      }
    }
  });
  return match;
}

export function NavThemeProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [theme, setTheme] = useState<NavTheme>(isHome ? "hero" : "light");

  useEffect(() => {
    setTheme(isHome ? "hero" : "light");
    const update = () => setTheme(readThemeAtProbe(isHome));

    const observer = new IntersectionObserver(update, {
      root: null,
      rootMargin: "-48px 0px -65% 0px",
      threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
    });

    const nodes = document.querySelectorAll("[data-nav]");
    nodes.forEach((node) => observer.observe(node));
    update();

    return () => observer.disconnect();
  }, [isHome, pathname]);

  return (
    <NavThemeContext.Provider value={theme}>{children}</NavThemeContext.Provider>
  );
}

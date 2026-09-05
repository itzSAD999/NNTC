export type NavLink = { href: string; label: string };

export type NavGroup = {
  type: "group";
  label: string;
  items: NavLink[];
};

export type NavItem = NavLink | NavGroup;

export function isNavGroup(item: NavItem): item is NavGroup {
  return "type" in item && item.type === "group";
}

/** Primary site navigation — Harvard primary nav + Yale campus grouping. */
export const SITE_NAV: NavItem[] = [
  { href: "/about", label: "About" },
  { href: "/programs", label: "Programmes" },
  { href: "/admissions", label: "Admissions" },
  {
    type: "group",
    label: "Campus",
    items: [
      { href: "/faculty", label: "Staff & lecturers" },
      { href: "/campus-life", label: "Campus life" },
      { href: "/gallery", label: "Gallery" },
      { href: "/events", label: "Events" },
      { href: "/resources", label: "Student resources" },
    ],
  },
  { href: "/news", label: "News" },
  { href: "/financial-aid", label: "Fees & Aid" },
  { href: "/contact", label: "Contact" },
];

export function isNavActive(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function isGroupActive(pathname: string, items: NavLink[]): boolean {
  return items.some((item) => isNavActive(pathname, item.href));
}

/** Flat list for mobile menu (top-level + campus items). */
export function flattenSiteNav(): NavLink[] {
  const links: NavLink[] = [];
  for (const item of SITE_NAV) {
    if (isNavGroup(item)) {
      links.push(...item.items);
    } else {
      links.push(item);
    }
  }
  return links;
}

import Link from "next/link";
import {
  BookOpen,
  GraduationCap,
  Home,
  Images,
  Stethoscope,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const EXPLORE_ITEMS: {
  href: string;
  label: string;
  description: string;
  icon: LucideIcon;
}[] = [
  {
    href: "/programs",
    label: "Programmes",
    description: "Nursing and midwifery pathways accredited for Ghana.",
    icon: GraduationCap,
  },
  {
    href: "/admissions",
    label: "Admissions",
    description: "Entry requirements, deadlines, and how to apply.",
    icon: BookOpen,
  },
  {
    href: "/faculty",
    label: "Staff & lecturers",
    description: "Meet the educators behind clinical training.",
    icon: Users,
  },
  {
    href: "/campus-life",
    label: "Campus life",
    description: "Accommodation, welfare, clubs, and student support.",
    icon: Home,
  },
  {
    href: "/gallery",
    label: "Gallery",
    description: "Campus moments, ceremonies, and clinical practice.",
    icon: Images,
  },
  {
    href: "/resources",
    label: "Resources",
    description: "Handbooks, timetables, forms, and academic calendars.",
    icon: Stethoscope,
  },
];

export function ExploreStrip() {
  return (
    <section aria-labelledby="explore-heading" className="border-b border-line bg-bg">
      <div className="section-grid py-16 md:py-20">
        <div className="max-w-2xl">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">
            Explore NMTC
          </p>
          <h2
            id="explore-heading"
            className="mt-3 font-serif text-display-md md:text-display-lg"
          >
            The parts that make our college whole
          </h2>
          <p className="mt-4 text-base text-caption">
            From admissions to campus life — structured pathways for prospective
            students, families, and partners across the Upper West Region.
          </p>
        </div>

        <ul className="mt-12 grid gap-px overflow-hidden rounded-none border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {EXPLORE_ITEMS.map(({ href, label, description, icon: Icon }) => (
            <li key={href} className="bg-surface rounded-none">
              <Link
                href={href}
                className="group flex h-full flex-col p-6 transition-colors hover:bg-bg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring md:p-8"
              >
                <Icon
                  className="h-5 w-5 text-primary"
                  strokeWidth={1.5}
                  aria-hidden
                />
                <h3 className="mt-4 font-serif text-lg text-ink group-hover:text-primary">
                  {label}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-caption">
                  {description}
                </p>
                <span className="mt-5 text-sm font-medium text-primary group-hover:text-primary-deep">
                  Learn more →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

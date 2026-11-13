import Image from "next/image";
import Link from "next/link";

import { Reveal } from "@/components/motion/reveal";
import { MEDIA } from "@/lib/media";

const ITEMS = [
  {
    href: "/programs",
    label: "Nursing & Midwifery",
    description: "Diploma pathways with supervised clinical practice.",
    tags: ["General Nursing", "Midwifery"],
    photo: MEDIA.lecture,
  },
  {
    href: "/admissions",
    label: "Admissions & Aid",
    description: "Requirements, fees, and how to apply.",
    tags: ["Apply", "Fees", "Scholarships"],
    photo: MEDIA.graduation,
  },
  {
    href: "/campus-life",
    label: "Campus & Community",
    description: "Hostels, skills labs, and student life in Nandom.",
    tags: ["Hostels", "Gallery", "Events"],
    photo: MEDIA.campus,
  },
  {
    href: "/resources",
    label: "Resources",
    description: "Handbooks, forms, calendars, and student downloads.",
    tags: ["Handbook", "Forms", "Calendar"],
    photo: MEDIA.team,
  },
] as const;

export function ExploreStrip() {
  return (
    <section
      aria-labelledby="explore-heading"
      data-nav="dark"
      className="bg-[#111] py-16 text-white md:py-20"
    >
      <div className="section-grid grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
        <div>
          <Reveal variant="fade">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/55">
            Academics
          </p>
          <h2
            id="explore-heading"
            className="mt-3 font-serif text-3xl font-medium tracking-tight text-white sm:text-4xl md:text-5xl"
          >
            Training that prepares you to practise
          </h2>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-white/70">
            Programmes, admissions, campus life, and student resources — organised so you can find the next step without hunting.
          </p>
          </Reveal>

          <ol className="mt-10 space-y-8">
            {ITEMS.map((item, i) => (
              <Reveal as="li" key={item.href} delay={i * 90} className="border-t border-white/15 pt-6">
                <p className="font-mono text-xs text-white/45">0{i + 1}</p>
                <h3 className="mt-2 font-serif text-2xl text-white">
                  <Link href={item.href} className="hover:underline">
                    {item.label}
                  </Link>
                </h3>
                <p className="mt-2 max-w-lg text-sm text-white/70">{item.description}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="border border-white/20 px-2 py-0.5 text-[0.7rem] text-white/80"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <Link
                  href={item.href}
                  className="mt-3 inline-block text-sm font-medium text-white underline underline-offset-4"
                >
                  Learn more
                </Link>
              </Reveal>
            ))}
          </ol>
        </div>

        <div className="hidden space-y-3 lg:block">
          {ITEMS.map((item, i) => (
            <Reveal key={item.href} variant="image" delay={90 + i * 90} className="relative aspect-[16/10] overflow-hidden border border-white/10">
              <Image
                src={item.photo}
                alt=""
                fill
                className="object-cover"
                sizes="40vw"
              />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

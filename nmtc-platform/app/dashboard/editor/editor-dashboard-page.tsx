import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  Images,
  Newspaper,
  Users,
} from "lucide-react";

import { DeskHelp } from "@/components/dashboard/desk-help";
import { requireStaffRole } from "@/lib/auth/session";
import { listAllPosts } from "@/lib/data/admin-posts";
import { listAllEvents } from "@/lib/data/admin-events";
import { listAllStaff } from "@/lib/data/admin-staff";
import { listGalleryAlbums } from "@/lib/data/admin-gallery";

export default async function EditorDashboardPage() {
  await requireStaffRole(["content_editor"]);
  const [posts, events, staff, albums] = await Promise.all([
    listAllPosts(),
    listAllEvents(),
    listAllStaff(),
    listGalleryAlbums(),
  ]);

  const cards = [
    { href: "/dashboard/admin/news", icon: Newspaper, label: "News", count: posts.length },
    { href: "/dashboard/admin/events", icon: CalendarDays, label: "Events", count: events.length },
    { href: "/dashboard/admin/staff", icon: Users, label: "Faculty", count: staff.length },
    { href: "/dashboard/admin/gallery", icon: Images, label: "Gallery", count: albums.length },
  ];

  return (
    <div className="space-y-8">
      <header className="flex items-start justify-between gap-3">
        <div>
          <h1 className="font-serif text-display-md">Content desk</h1>
          <p className="mt-1 text-sm text-caption">
            Edit public pages. You do not process document requests.
          </p>
        </div>
        <DeskHelp title="Your desk">
          Update news, events, faculty, and gallery. Document requests stay with Academic, Accounts, and the Principal.
        </DeskHelp>
      </header>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.href}
              href={card.href}
              className="border border-line bg-white p-5 hover:border-primary"
            >
              <Icon className="h-5 w-5 text-primary" />
              <p className="mt-6 font-serif text-3xl font-bold text-ink">{card.count}</p>
              <p className="mt-1 text-sm font-medium text-ink">{card.label}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-primary">
                Open <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

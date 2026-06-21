import type { Metadata } from "next";

import { ResourcesSections } from "@/components/marketing/resources-sections";
import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import {
  getPublishedResources,
  groupResourcesByCategory,
} from "@/lib/data/resources";
import { getSettings } from "@/lib/data/settings";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return {
    title: `Student Resources — ${settings.college_name}`,
    description: `Handbooks, timetables, forms, and academic calendars for ${settings.college_name} students.`,
  };
}

export default async function ResourcesPage() {
  const [resources, settings] = await Promise.all([
    getPublishedResources(),
    getSettings(),
  ]);

  const groups = groupResourcesByCategory(resources);

  return (
    <>
      <PageHeader
        eyebrow="Students"
        title="Student resources"
        description={`Download handbooks, timetables, forms, and academic calendars from ${settings.college_name}.`}
      />
      {groups.length > 0 ? (
        <ResourcesSections groups={groups} />
      ) : (
        <div className="section-grid py-12">
          <EmptyState message="Resources will be published here soon." />
        </div>
      )}
    </>
  );
}

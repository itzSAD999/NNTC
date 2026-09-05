"use client";

import { useMemo, useState, type ReactNode } from "react";

import type { PublishFilter } from "@/lib/admin/list-filters";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type AdminListFilterOption = {
  value: string;
  label: string;
};

type AdminListFilterBarProps = {
  searchPlaceholder?: string;
  search: string;
  onSearchChange: (value: string) => void;
  status?: PublishFilter;
  onStatusChange?: (value: PublishFilter) => void;
  showStatus?: boolean;
  category?: string;
  onCategoryChange?: (value: string) => void;
  categoryOptions?: AdminListFilterOption[];
  categoryLabel?: string;
  extraFilters?: ReactNode;
  total: number;
  filtered: number;
  className?: string;
};

const STATUS_OPTIONS: { value: PublishFilter; label: string }[] = [
  { value: "all", label: "All statuses" },
  { value: "published", label: "Published" },
  { value: "draft", label: "Draft" },
];

const selectClass =
  "flex h-9 w-full rounded border border-line bg-surface px-3 text-sm text-ink sm:w-auto";

export function AdminListFilterBar({
  searchPlaceholder = "Search…",
  search,
  onSearchChange,
  status = "all",
  onStatusChange,
  showStatus = true,
  category = "all",
  onCategoryChange,
  categoryOptions,
  categoryLabel = "Category",
  extraFilters,
  total,
  filtered,
  className,
}: AdminListFilterBarProps) {
  const hasFilters =
    search.trim() !== "" ||
    status !== "all" ||
    category !== "all";

  return (
    <div
      className={cn(
        "space-y-3 rounded border border-line bg-surface p-4",
        className
      )}
    >
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
        <div className="min-w-0 flex-1 space-y-1">
          <label htmlFor="admin-list-search" className="text-xs font-medium text-caption">
            Search
          </label>
          <Input
            id="admin-list-search"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={searchPlaceholder}
          />
        </div>

        {showStatus && onStatusChange ? (
          <div className="space-y-1 sm:w-44">
            <label htmlFor="admin-list-status" className="text-xs font-medium text-caption">
              Status
            </label>
            <select
              id="admin-list-status"
              value={status}
              onChange={(e) => onStatusChange(e.target.value as PublishFilter)}
              className={selectClass}
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        ) : null}

        {categoryOptions && onCategoryChange ? (
          <div className="space-y-1 sm:w-48">
            <label htmlFor="admin-list-category" className="text-xs font-medium text-caption">
              {categoryLabel}
            </label>
            <select
              id="admin-list-category"
              value={category}
              onChange={(e) => onCategoryChange(e.target.value)}
              className={selectClass}
            >
              <option value="all">All {categoryLabel.toLowerCase()}s</option>
              {categoryOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        ) : null}

        {extraFilters}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-caption">
        <p>
          Showing <span className="font-medium text-ink">{filtered}</span> of{" "}
          <span className="font-medium text-ink">{total}</span>
        </p>
        {hasFilters ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-7 text-caption"
            onClick={() => {
              onSearchChange("");
              onStatusChange?.("all");
              onCategoryChange?.("all");
            }}
          >
            Clear filters
          </Button>
        ) : null}
      </div>
    </div>
  );
}

export function useAdminListFilters() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<PublishFilter>("all");
  const [category, setCategory] = useState("all");

  return useMemo(
    () => ({
      search,
      setSearch,
      status,
      setStatus,
      category,
      setCategory,
      reset: () => {
        setSearch("");
        setStatus("all");
        setCategory("all");
      },
    }),
    [search, status, category]
  );
}

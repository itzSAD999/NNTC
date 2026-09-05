"use client";

import { Suspense, useMemo, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";

import {
  createStaff,
  deactivateStaffForm,
  resetStaffPassword,
  updateStaff,
  type UserActionState,
} from "@/lib/actions/users";
import { ROLES, type Role } from "@/lib/constants";
import type { StaffAccount } from "@/types/database";
import { matchesSearch } from "@/lib/admin/list-filters";
import { AdminModal } from "@/components/admin/admin-modal";
import { AdminListFilterBar } from "@/components/admin/admin-list-filters";
import { AdminListToast } from "@/components/admin/admin-list-toast";
import {
  AdminListResults,
  AdminMobileCard,
} from "@/components/admin/admin-responsive-list";
import { FormMessage } from "@/components/admin/admin-layout";
import { DeleteConfirmButton } from "@/components/admin/delete-confirm-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const ROLE_LABELS: Record<Role, string> = {
  super_admin: "Super Admin",
  content_editor: "Content Editor",
  academic: "Academic Office",
  accounts: "Accounts Office",
  principal: "Principal",
};

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Saving…" : label}
    </Button>
  );
}

function ActionMessage({ state }: { state: UserActionState }) {
  return <FormMessage error={state.error} success={state.success} />;
}

function MemberActions({
  member,
  currentUserId,
  onEdit,
  onResetPassword,
}: {
  member: StaffAccount;
  currentUserId: string;
  onEdit: () => void;
  onResetPassword: () => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      <Button type="button" size="sm" variant="outline" onClick={onEdit}>
        Edit
      </Button>
      <Button type="button" size="sm" variant="ghost" onClick={onResetPassword}>
        Reset password
      </Button>
      {member.is_active && member.id !== currentUserId ? (
        <DeleteConfirmButton
          action={deactivateStaffForm}
          confirmMessage={`Deactivate ${member.full_name}? They will not be able to sign in.`}
          buttonLabel="Deactivate"
          hiddenFields={{ id: member.id }}
          variant="destructive"
        />
      ) : null}
    </div>
  );
}

function MemberStatus({ member }: { member: StaffAccount }) {
  return (
    <span
      className={
        member.is_active ? "text-primary" : "text-caption line-through"
      }
    >
      {member.is_active ? "Active" : "Inactive"}
    </span>
  );
}

export function UsersManager({
  staff,
  currentUserId,
}: {
  staff: StaffAccount[];
  currentUserId: string;
}) {
  const [createState, createAction] = useFormState(createStaff, {});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [resetId, setResetId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [activeFilter, setActiveFilter] = useState("all");

  const filteredStaff = useMemo(() => {
    return staff.filter((member) => {
      if (
        !matchesSearch(search, [
          member.full_name,
          member.email,
          ROLE_LABELS[member.role],
        ])
      ) {
        return false;
      }
      if (roleFilter !== "all" && member.role !== roleFilter) return false;
      if (activeFilter === "active" && !member.is_active) return false;
      if (activeFilter === "inactive" && member.is_active) return false;
      return true;
    });
  }, [staff, search, roleFilter, activeFilter]);

  return (
    <div className="space-y-10">
      <Suspense fallback={null}>
        <AdminListToast />
      </Suspense>
      <section className="rounded border border-line bg-surface p-6">
        <h2 className="font-serif text-display-sm">Create staff account</h2>
        <form action={createAction} className="mt-6 grid gap-4 sm:grid-cols-2">
          <ActionMessage state={createState} />
          <div className="space-y-2 sm:col-span-2 sm:grid sm:grid-cols-2 sm:gap-4">
            <div className="space-y-2">
              <Label htmlFor="create-full_name">Full name</Label>
              <Input id="create-full_name" name="full_name" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="create-email">Email</Label>
              <Input id="create-email" name="email" type="email" required />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="create-password">Temporary password</Label>
            <Input
              id="create-password"
              name="password"
              type="password"
              minLength={8}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="create-role">Role</Label>
            <select
              id="create-role"
              name="role"
              className="flex h-9 w-full rounded border border-line bg-bg px-3 text-sm"
              required
            >
              {ROLES.map((role) => (
                <option key={role} value={role}>
                  {ROLE_LABELS[role]}
                </option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-2">
            <SubmitButton label="Create account" />
          </div>
        </form>
      </section>

      <section>
        <h2 className="font-serif text-display-sm">Staff accounts</h2>
        <div className="mt-4 space-y-4">
          <AdminListFilterBar
            search={search}
            onSearchChange={setSearch}
            showStatus={false}
            searchPlaceholder="Search by name or email…"
            total={staff.length}
            filtered={filteredStaff.length}
            extraFilters={
              <>
                <div className="space-y-1 sm:w-44">
                  <label
                    htmlFor="user-role-filter"
                    className="text-xs font-medium text-caption"
                  >
                    Role
                  </label>
                  <select
                    id="user-role-filter"
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="flex h-9 w-full rounded border border-line bg-surface px-3 text-sm sm:w-auto"
                  >
                    <option value="all">All roles</option>
                    {ROLES.map((role) => (
                      <option key={role} value={role}>
                        {ROLE_LABELS[role]}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1 sm:w-44">
                  <label
                    htmlFor="user-active-filter"
                    className="text-xs font-medium text-caption"
                  >
                    Account status
                  </label>
                  <select
                    id="user-active-filter"
                    value={activeFilter}
                    onChange={(e) => setActiveFilter(e.target.value)}
                    className="flex h-9 w-full rounded border border-line bg-surface px-3 text-sm sm:w-auto"
                  >
                    <option value="all">All accounts</option>
                    <option value="active">Active only</option>
                    <option value="inactive">Inactive only</option>
                  </select>
                </div>
              </>
            }
          />
          {filteredStaff.length === 0 ? (
            <p className="rounded border border-dashed border-line bg-surface px-4 py-8 text-center text-sm text-caption">
              No accounts match your filters.
            </p>
          ) : (
            <AdminListResults
              table={
                <div className="overflow-x-auto rounded border border-line bg-surface">
                  <table className="w-full min-w-[720px] text-left text-sm">
                    <thead>
                      <tr className="border-b border-line text-xs uppercase tracking-widest text-caption">
                        <th className="px-4 py-3 font-medium">Name</th>
                        <th className="px-4 py-3 font-medium">Email</th>
                        <th className="px-4 py-3 font-medium">Role</th>
                        <th className="px-4 py-3 font-medium">Status</th>
                        <th className="px-4 py-3 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredStaff.map((member) => (
                        <tr
                          key={member.id}
                          className="border-b border-line last:border-0"
                        >
                          <td className="px-4 py-3 font-medium text-ink">
                            {member.full_name}
                          </td>
                          <td className="px-4 py-3 text-caption">
                            {member.email}
                          </td>
                          <td className="px-4 py-3 text-caption">
                            {ROLE_LABELS[member.role]}
                          </td>
                          <td className="px-4 py-3">
                            <MemberStatus member={member} />
                          </td>
                          <td className="px-4 py-3">
                            <MemberActions
                              member={member}
                              currentUserId={currentUserId}
                              onEdit={() => {
                                setEditingId(member.id);
                                setResetId(null);
                              }}
                              onResetPassword={() => {
                                setResetId(member.id);
                                setEditingId(null);
                              }}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              }
              cards={filteredStaff.map((member) => (
                <AdminMobileCard key={member.id}>
                  <div className="space-y-3">
                    <div>
                      <p className="font-medium text-ink">{member.full_name}</p>
                      <p className="text-xs text-caption">{member.email}</p>
                    </div>
                    <p className="text-xs text-caption">
                      {ROLE_LABELS[member.role]}
                    </p>
                    <MemberStatus member={member} />
                    <MemberActions
                      member={member}
                      currentUserId={currentUserId}
                      onEdit={() => {
                        setEditingId(member.id);
                        setResetId(null);
                      }}
                      onResetPassword={() => {
                        setResetId(member.id);
                        setEditingId(null);
                      }}
                    />
                  </div>
                </AdminMobileCard>
              ))}
            />
          )}
        </div>
      </section>

      {editingId ? (
        <EditStaffDialog
          member={staff.find((s) => s.id === editingId)!}
          currentUserId={currentUserId}
          onClose={() => setEditingId(null)}
        />
      ) : null}

      {resetId ? (
        <ResetPasswordDialog
          memberId={resetId}
          onClose={() => setResetId(null)}
        />
      ) : null}
    </div>
  );
}

function EditStaffDialog({
  member,
  currentUserId,
  onClose,
}: {
  member: StaffAccount;
  currentUserId: string;
  onClose: () => void;
}) {
  const [state, action] = useFormState(updateStaff, {});

  return (
    <AdminModal open title={`Edit ${member.full_name}`} onClose={onClose}>
      <form action={action} className="space-y-4">
          <input type="hidden" name="id" value={member.id} />
          <ActionMessage state={state} />
          <div className="space-y-2">
            <Label htmlFor="edit-full_name">Full name</Label>
            <Input
              id="edit-full_name"
              name="full_name"
              defaultValue={member.full_name}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-email">Email</Label>
            <Input
              id="edit-email"
              name="email"
              type="email"
              defaultValue={member.email}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-role">Role</Label>
            <select
              id="edit-role"
              name="role"
              defaultValue={member.role}
              disabled={member.id === currentUserId}
              className="flex h-9 w-full rounded border border-line bg-bg px-3 text-sm disabled:opacity-50"
            >
              {ROLES.map((role) => (
                <option key={role} value={role}>
                  {ROLE_LABELS[role]}
                </option>
              ))}
            </select>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="is_active"
              value="true"
              defaultChecked={member.is_active}
              disabled={member.id === currentUserId}
            />
            Active account
          </label>
          <div className="flex gap-2 pt-2">
            <SubmitButton label="Save changes" />
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
    </AdminModal>
  );
}

function ResetPasswordDialog({
  memberId,
  onClose,
}: {
  memberId: string;
  onClose: () => void;
}) {
  const [state, action] = useFormState(resetStaffPassword, {});

  return (
    <AdminModal open title="Reset password" onClose={onClose}>
      <form action={action} className="space-y-4">
          <input type="hidden" name="id" value={memberId} />
          <ActionMessage state={state} />
          <div className="space-y-2">
            <Label htmlFor="reset-password">New password</Label>
            <Input
              id="reset-password"
              name="password"
              type="password"
              minLength={8}
              required
            />
          </div>
          <div className="flex gap-2 pt-2">
            <SubmitButton label="Reset password" />
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
    </AdminModal>
  );
}

"use client";

import { useState } from "react";
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
  if (state.error) {
    return (
      <p role="alert" className="text-sm text-danger">
        {state.error}
      </p>
    );
  }
  if (state.success) {
    return <p className="text-sm text-primary">Saved successfully.</p>;
  }
  return null;
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

  return (
    <div className="space-y-10">
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
        <div className="mt-4 overflow-x-auto rounded border border-line bg-surface">
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
              {staff.map((member) => (
                <tr key={member.id} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-medium text-ink">
                    {member.full_name}
                  </td>
                  <td className="px-4 py-3 text-caption">{member.email}</td>
                  <td className="px-4 py-3 text-caption">
                    {ROLE_LABELS[member.role]}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        member.is_active
                          ? "text-primary"
                          : "text-caption line-through"
                      }
                    >
                      {member.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setEditingId(member.id);
                          setResetId(null);
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setResetId(member.id);
                          setEditingId(null);
                        }}
                      >
                        Reset password
                      </Button>
                      {member.is_active && member.id !== currentUserId ? (
                        <form action={deactivateStaffForm}>
                          <input type="hidden" name="id" value={member.id} />
                          <Button type="submit" size="sm" variant="destructive">
                            Deactivate
                          </Button>
                        </form>
                      ) : null}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4">
      <div className="w-full max-w-lg rounded border border-line bg-surface p-6 shadow-lg">
        <h3 className="font-serif text-display-sm">Edit {member.full_name}</h3>
        <form action={action} className="mt-6 space-y-4">
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
      </div>
    </div>
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4">
      <div className="w-full max-w-md rounded border border-line bg-surface p-6 shadow-lg">
        <h3 className="font-serif text-display-sm">Reset password</h3>
        <form action={action} className="mt-6 space-y-4">
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
      </div>
    </div>
  );
}

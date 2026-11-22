
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import type { AdminUser } from "@/app/dashboard/admin/users/page";

type Props = {
  initialUsers: AdminUser[];
  currentUserEmail: string;
};

export default function AdminUsersList({
  initialUsers,
  currentUserEmail,
}: Props) {
  const [users, setUsers] = useState(initialUsers);
  const [selectedRoles, setSelectedRoles] = useState<
    Record<string, AdminUser["role"]>
  >({});
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const router = useRouter();

  async function updateRole(userId: string) {
    const role = selectedRoles[userId];

    if (!role) return;

    setUpdatingId(userId);

    try {
      const { data } = await authClient.token();
      const token = data?.token;

      if (!token) {
        toast.error("Authentication required.");
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/users/${userId}/role`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ role }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to update user role.");
      }

      setUsers((currentUsers) =>
        currentUsers.map((user) =>
          user._id === userId ? { ...user, role } : user
        )
      );

      setSelectedRoles((current) => {
        const updated = { ...current };
        delete updated[userId];
        return updated;
      });

      toast.success("User role updated successfully.");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong."
      );
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Manage Users
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          View registered users and manage their roles.
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="border-b border-slate-200 px-6 py-4">
          <p className="font-semibold text-slate-800">
            All Users ({users.length})
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-6 py-4 font-medium">User</th>
                <th className="px-6 py-4 font-medium">Email</th>
                <th className="px-6 py-4 font-medium">Role</th>
                <th className="px-6 py-4 font-medium">Joined</th>
                <th className="px-6 py-4 font-medium">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {users.map((user) => {
                const isCurrentAdmin =
                  user.email === currentUserEmail;

                const selectedRole =
                  selectedRoles[user._id] ?? user.role;

                const hasChanged = selectedRole !== user.role;

                return (
                  <tr key={user._id}>
                    <td className="whitespace-nowrap px-6 py-4 font-medium text-slate-800">
                      {user.name}
                      {isCurrentAdmin && (
                        <span className="ml-2 text-xs text-blue-600">
                          (You)
                        </span>
                      )}
                    </td>

                    <td className="whitespace-nowrap px-6 py-4 text-slate-600">
                      {user.email}
                    </td>

                    <td className="px-6 py-4">
                      {isCurrentAdmin ? (
                        <span className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm capitalize text-slate-700 outline-none focus:border-slate-400 disabled:opacity-50">
                          {user.role}
                        </span>
                      ) : (
                        <select
                          value={selectedRole}
                          disabled={updatingId === user._id}
                          onChange={(event) =>
                            setSelectedRoles((current) => ({
                              ...current,
                              [user._id]: event.target.value as AdminUser["role"],
                            }))
                          }
                          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm capitalize text-slate-700 outline-none focus:border-slate-400 disabled:opacity-50"
                        >
                          <option value="customer">Customer</option>
                          <option value="technician">Technician</option>
                          <option value="admin">Admin</option>
                        </select>
                      )}
                    </td>

                    <td className="whitespace-nowrap px-6 py-4 text-slate-500">
                      {user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString()
                        : "—"}
                    </td>

                    <td className="px-6 py-4">
                      {isCurrentAdmin ? (
                        <span className="text-xs text-slate-400">
                          Not editable
                        </span>
                      ) : (
                        <button
                          onClick={() => updateRole(user._id)}
                          disabled={
                            !hasChanged || updatingId === user._id
                          }
                          className="rounded-lg bg-green-600 px-4 py-2 text-xs font-medium text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          {updatingId === user._id
                            ? "Saving..."
                            : "Update"}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}

              {users.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-10 text-center text-slate-500"
                  >
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

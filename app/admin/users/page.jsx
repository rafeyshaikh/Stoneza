"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Trash2,
  Search,
  Users,
  Shield,
  ShieldAlert,
  Loader2,
  Calendar,
  Mail,
  Phone,
  UserCog,
} from "lucide-react";

import { useAuth } from "@/context/AuthContext";
import Breadcrumbs from "@/components/admin/layout/Breadcrumbs";
import PageHeader from "@/components/admin/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const ROLE_NAMES = { user: "User", subadmin: "Sub Admin", admin: "Administrator" };

function RoleBadge({ role }) {
  if (role === "admin") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200/50 dark:border-amber-900/30">
        <Shield className="size-3" />
        Admin
      </span>
    );
  }
  if (role === "subadmin") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 border border-blue-200/50 dark:border-blue-900/30">
        <UserCog className="size-3" />
        Sub Admin
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-stone-100 px-2.5 py-1 text-xs font-semibold text-stone-600 dark:bg-stone-800 dark:text-stone-400">
      User
    </span>
  );
}

function AvatarCircle({ name, role }) {
  const colorMap = {
    admin: "bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400",
    subadmin: "bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400",
    user: "bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300",
  };
  return (
    <div
      className={`flex shrink-0 size-10 items-center justify-center rounded-full font-bold text-sm select-none ${colorMap[role] ?? colorMap.user}`}
    >
      {name ? name[0].toUpperCase() : "U"}
    </div>
  );
}

export default function UsersAdminPage() {
  const { user: currentUser, userRole, loading: authLoading } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionUserId, setActionUserId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const currentUserId = currentUser?.data?._id || currentUser?._id;

  useEffect(() => {
    let active = true;
    async function loadUsers() {
      try {
        setLoading(true);
        const res = await fetch("/api/admin/users");
        const data = await res.json();
        if (active) {
          if (!data.success) throw new Error(data.message || "Failed to load users");
          setUsers(data.data || []);
        }
      } catch (error) {
        console.error(error);
        if (active) toast.error(error.message);
      } finally {
        if (active) setLoading(false);
      }
    }

    if (userRole === "admin") loadUsers();
    return () => { active = false; };
  }, [userRole]);

  async function handleRoleChange(user, newRole) {
    if (user._id === currentUserId) {
      toast.error("You cannot change your own role");
      return;
    }
    const confirmed = window.confirm(
      `Change the role of ${user.name} to ${ROLE_NAMES[newRole]}?`
    );
    if (!confirmed) return;

    try {
      setActionUserId(user._id);
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user._id, role: newRole }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Failed to change user role");

      toast.success(`${user.name} is now a ${ROLE_NAMES[newRole]}`);
      setUsers((prev) =>
        prev.map((u) => (u._id === user._id ? { ...u, role: newRole } : u))
      );
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    } finally {
      setActionUserId(null);
    }
  }

  async function handleDeleteUser(user) {
    if (user._id === currentUserId) {
      toast.error("You cannot delete your own account");
      return;
    }
    const confirmed = window.confirm(
      `Permanently delete the account for ${user.name} (${user.email})? This cannot be undone.`
    );
    if (!confirmed) return;

    try {
      setActionUserId(user._id);
      const res = await fetch(`/api/admin/users?userId=${user._id}`, { method: "DELETE" });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Failed to delete user");

      toast.success(`${user.name} deleted successfully`);
      setUsers((prev) => prev.filter((u) => u._id !== user._id));
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    } finally {
      setActionUserId(null);
    }
  }

  const filteredUsers = users.filter((user) => {
    const q = searchQuery.toLowerCase();
    return (
      user.name?.toLowerCase().includes(q) ||
      user.email?.toLowerCase().includes(q) ||
      user.phoneNumber?.includes(q)
    );
  });

  if (authLoading) {
    return (
      <div className="flex h-96 items-center justify-center text-stone-500">
        <Loader2 className="mr-2 size-6 animate-spin text-stone-900 dark:text-white" />
        Verifying permissions...
      </div>
    );
  }

  if (userRole !== "admin") {
    return (
      <div className="flex h-96 flex-col items-center justify-center space-y-4 text-center px-4">
        <ShieldAlert className="size-16 text-red-500" />
        <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100">Access Denied</h2>
        <p className="text-stone-500 text-sm max-w-md">
          Only Super Administrators have access to view, edit, or delete users.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Breadcrumbs />
      <PageHeader
        title="User Management"
        description="View registered users, assign roles (Admin, Sub Admin, User), and delete accounts."
      />

      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-xl border border-stone-200 bg-white p-4 dark:border-stone-800 dark:bg-stone-900">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-stone-400" />
          <Input
            placeholder="Search by name, email, or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-stone-50 border-stone-300 dark:bg-stone-950 dark:border-stone-800"
          />
        </div>
        <p className="text-xs text-stone-500 font-medium shrink-0">
          Showing {filteredUsers.length} of {users.length} users
        </p>
      </div>

      {/* Content */}
      <div className="rounded-2xl border border-stone-200 bg-white overflow-hidden shadow-sm dark:border-stone-800 dark:bg-stone-900">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-stone-500">
            <Loader2 className="size-8 animate-spin text-stone-900 dark:text-stone-100 mb-2" />
            <p className="text-sm font-medium">Fetching users...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-stone-500">
            <Users className="size-12 text-stone-300 mb-3" />
            <p className="text-sm font-medium">
              {searchQuery ? "No users match your search." : "No registered users found."}
            </p>
          </div>
        ) : (
          <>
            {/* ── Mobile card list (hidden on md+) ── */}
            <ul className="divide-y divide-stone-200 dark:divide-stone-800 md:hidden">
              {filteredUsers.map((user) => {
                const isCurrentActionUser = actionUserId === user._id;
                const isSelf = user._id === currentUserId;

                return (
                  <li key={user._id} className="p-4 space-y-3">
                    {/* Top row: avatar + name + badge */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <AvatarCircle name={user.name} role={user.role} />
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className="font-semibold text-stone-900 dark:text-stone-50 text-sm truncate">
                              {user.name}
                            </span>
                            {isSelf && (
                              <span className="text-[10px] bg-stone-100 text-stone-600 px-1.5 py-0.5 rounded font-normal shrink-0">
                                You
                              </span>
                            )}
                          </div>
                          <RoleBadge role={user.role} />
                        </div>
                      </div>

                      {/* Delete */}
                      <Button
                        onClick={() => handleDeleteUser(user)}
                        disabled={isCurrentActionUser || isSelf}
                        size="icon"
                        variant="destructive"
                        className="cursor-pointer size-8 shrink-0 rounded-lg shadow-xs hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        title={isSelf ? "Cannot delete yourself" : "Delete user"}
                      >
                        {isCurrentActionUser ? (
                          <Loader2 className="size-3.5 animate-spin" />
                        ) : (
                          <Trash2 className="size-3.5" />
                        )}
                      </Button>
                    </div>

                    {/* Contact info */}
                    <div className="space-y-1 pl-13">
                      <div className="flex items-center gap-1.5 text-xs text-stone-600 dark:text-stone-400">
                        <Mail className="size-3.5 text-stone-400 shrink-0" />
                        <span className="truncate">{user.email}</span>
                      </div>
                      {user.phoneNumber && (
                        <div className="flex items-center gap-1.5 text-xs text-stone-600 dark:text-stone-400">
                          <Phone className="size-3.5 text-stone-400 shrink-0" />
                          <span>{user.phoneNumber}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1.5 text-xs text-stone-600 dark:text-stone-400">
                        <Calendar className="size-3.5 text-stone-400 shrink-0" />
                        <span>
                          Joined{" "}
                          {new Date(user.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    </div>

                    {/* Role changer */}
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-xs text-stone-500 font-medium">Change role:</span>
                      <select
                        value={user.role}
                        disabled={isCurrentActionUser || isSelf}
                        onChange={(e) => handleRoleChange(user, e.target.value)}
                        className="bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-xs font-semibold px-2.5 py-1.5 text-stone-700 dark:text-stone-300 focus:outline-none focus:ring-1 focus:ring-[#c9a877] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <option value="user">User</option>
                        <option value="subadmin">Sub Admin</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                  </li>
                );
              })}
            </ul>

            {/* ── Desktop table (hidden below md) ── */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-stone-50/75 border-b border-stone-200 text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:bg-stone-950 dark:border-stone-800 dark:text-stone-400">
                    <th className="px-6 py-4">User Details</th>
                    <th className="px-6 py-4">Contact Info</th>
                    <th className="px-6 py-4">Date Joined</th>
                    <th className="px-6 py-4">System Role</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200 dark:divide-stone-800 text-sm">
                  {filteredUsers.map((user) => {
                    const isCurrentActionUser = actionUserId === user._id;
                    const isAdmin = user.role === "admin";
                    const isSubAdmin = user.role === "subadmin";
                    const isSelf = user._id === currentUserId;

                    return (
                      <tr
                        key={user._id}
                        className="hover:bg-stone-50/50 transition dark:hover:bg-stone-950/20"
                      >
                        {/* Name */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <AvatarCircle name={user.name} role={user.role} />
                            <div>
                              <div className="font-semibold text-stone-950 dark:text-stone-50 flex items-center gap-1.5">
                                {user.name}
                                {isSelf && (
                                  <span className="text-[10px] bg-stone-100 text-stone-600 px-1.5 py-0.5 rounded font-normal">
                                    You
                                  </span>
                                )}
                              </div>
                              <div className="text-xs text-stone-400 font-mono">{user._id}</div>
                            </div>
                          </div>
                        </td>

                        {/* Contact */}
                        <td className="px-6 py-4 space-y-1">
                          <div className="flex items-center gap-1.5 text-xs text-stone-600 dark:text-stone-400">
                            <Mail className="size-3.5 text-stone-400" />
                            <span>{user.email}</span>
                          </div>
                          {user.phoneNumber && (
                            <div className="flex items-center gap-1.5 text-xs text-stone-600 dark:text-stone-400">
                              <Phone className="size-3.5 text-stone-400" />
                              <span>{user.phoneNumber}</span>
                            </div>
                          )}
                        </td>

                        {/* Date */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1.5 text-xs text-stone-600 dark:text-stone-400">
                            <Calendar className="size-3.5 text-stone-400" />
                            <span>
                              {new Date(user.createdAt).toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })}
                            </span>
                          </div>
                        </td>

                        {/* Role badge */}
                        <td className="px-6 py-4">
                          <RoleBadge role={user.role} />
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-3">
                            <select
                              value={user.role}
                              disabled={isCurrentActionUser || isSelf}
                              onChange={(e) => handleRoleChange(user, e.target.value)}
                              className="bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-xs font-semibold px-2.5 py-1.5 text-stone-700 dark:text-stone-300 focus:outline-none focus:ring-1 focus:ring-[#c9a877] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <option value="user">User</option>
                              <option value="subadmin">Sub Admin</option>
                              <option value="admin">Admin</option>
                            </select>

                            <Button
                              onClick={() => handleDeleteUser(user)}
                              disabled={isCurrentActionUser || isSelf}
                              size="icon"
                              variant="destructive"
                              className="cursor-pointer size-8 rounded-lg shadow-xs hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                              title={isSelf ? "Cannot delete yourself" : "Delete user"}
                            >
                              {isCurrentActionUser ? (
                                <Loader2 className="size-3.5 animate-spin" />
                              ) : (
                                <Trash2 className="size-3.5" />
                              )}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

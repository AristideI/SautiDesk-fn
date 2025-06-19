import React, { useState } from "react";
import Button from "components/utils/button";
import {
  Search,
  UserPlus,
  Users,
  Shield,
  Mail,
  Phone,
  MoreVertical,
} from "lucide-react";

interface IUser {
  id: string;
  username: string;
  email: string;
  phone: string;
  role: "ADMIN" | "AGENT" | "USER";
  status: "ACTIVE" | "INACTIVE" | "SUSPENDED";
  joinedAt: Date;
}

export default function OrgUsersPage() {
  const [searchQuery, setSearchQuery] = useState("");

  function formatDate(date: Date) {
    return new Date(date).toLocaleDateString();
  }

  // Mock data - replace with actual data from your API
  const users: IUser[] = [
    {
      id: "1",
      username: "John Doe",
      email: "john@example.com",
      phone: "+1234567890",
      role: "ADMIN",
      status: "ACTIVE",
      joinedAt: new Date("2024-01-01"),
    },
    {
      id: "2",
      username: "Jane Smith",
      email: "jane@example.com",
      phone: "+1987654321",
      role: "AGENT",
      status: "ACTIVE",
      joinedAt: new Date("2024-02-01"),
    },
  ];

  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main>
      <article className="flex justify-between items-center border-b border-white/40 py-4 px-6">
        <h1 className="text-2xl font-semibold">Users</h1>
        <section className="flex gap-4">
          <Button
            buttonText="Invite User"
            variant="secondary"
            icon={<UserPlus size={20} />}
            onPress={() => {}}
            className="border-white/50 hover:bg-white/10 text-white/50"
          />
          <Button
            buttonText="Add User"
            icon={<Users size={20} />}
            onPress={() => {}}
          />
        </section>
      </article>

      <article className="flex w-full py-4 border-b border-white/40 px-6 gap-4">
        <label className="w-1/5 relative mr-12">
          <input
            type="text"
            className="border border-white/30 rounded-lg w-full px-4 pl-8 py-1 outline-none"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search
            className="absolute top-1/5 left-2"
            color="#ffffff60"
            size={20}
          />
        </label>
      </article>

      <article className="flex-1 p-6">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-white/40">
                <th className="text-left py-3 px-4 text-white/60">User</th>
                <th className="text-left py-3 px-4 text-white/60">Role</th>
                <th className="text-left py-3 px-4 text-white/60">Status</th>
                <th className="text-left py-3 px-4 text-white/60">Contact</th>
                <th className="text-left py-3 px-4 text-white/60">Joined</th>
                <th className="text-left py-3 px-4 text-white/60">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-white/20 hover:bg-white/5"
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                        <Shield size={16} />
                      </div>
                      <span>{user.username}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 rounded-full text-sm ${
                        user.role === "ADMIN"
                          ? "bg-purple-500/20 text-purple-400"
                          : user.role === "AGENT"
                          ? "bg-blue-500/20 text-blue-400"
                          : "bg-gray-500/20 text-gray-400"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 rounded-full text-sm ${
                        user.status === "ACTIVE"
                          ? "bg-green-500/20 text-green-400"
                          : user.status === "SUSPENDED"
                          ? "bg-red-500/20 text-red-400"
                          : "bg-gray-500/20 text-gray-400"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail size={14} />
                        <span>{user.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone size={14} />
                        <span>{user.phone}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">{formatDate(user.joinedAt)}</td>
                  <td className="py-3 px-4">
                    <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
                      <MoreVertical size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>
    </main>
  );
}

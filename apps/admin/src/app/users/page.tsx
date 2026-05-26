'use client';
import { useState, useEffect } from 'react';
import { adminAPI } from '@/lib/api';

export default function UsersPage() {
  const [data, setData] = useState<any>(null);
  const [search, setSearch] = useState('');

  useEffect(() => { adminAPI.users(1, search || undefined).then(setData).catch(() => {}); }, [search]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">User Management</h1>
      <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search username..."
        className="w-full max-w-md px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 mb-6 outline-none focus:border-emerald-500" />

      <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-750 border-b border-gray-700">
            <tr className="text-left text-gray-400">
              <th className="px-4 py-3">Username</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Country</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Trust</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {data?.users?.map((user: any) => (
              <tr key={user.id} className="hover:bg-gray-750">
                <td className="px-4 py-3 font-medium">{user.username}</td>
                <td className="px-4 py-3 text-gray-400">{user.email}</td>
                <td className="px-4 py-3">{user.country}</td>
                <td className="px-4 py-3"><span className="px-2 py-0.5 bg-gray-700 rounded text-xs">{user.role}</span></td>
                <td className="px-4 py-3 text-emerald-400">{user.trustScore}</td>
                <td className="px-4 py-3">
                  <button onClick={() => adminAPI.banUser(user.id).then(() => adminAPI.users(1, search).then(setData))}
                    className="text-xs text-red-400 hover:text-red-300">Ban</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {data && <p className="text-xs text-gray-500 mt-4">Total: {data.total} users</p>}
    </div>
  );
}

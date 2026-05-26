export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Users', value: '—', color: 'text-emerald-400' },
          { label: 'Total Reports', value: '—', color: 'text-blue-400' },
          { label: 'Active Campaigns', value: '—', color: 'text-orange-400' },
          { label: 'Platform Revenue', value: '—', color: 'text-yellow-400' },
        ].map((stat) => (
          <div key={stat.label} className="bg-gray-800 rounded-xl p-5 border border-gray-700">
            <p className="text-sm text-gray-400">{stat.label}</p>
            <p className={`text-2xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h2 className="font-semibold mb-4">Recent Activity</h2>
        <p className="text-gray-400 text-sm">Connect to API to load live data. Use admin credentials to authenticate.</p>
      </div>
    </div>
  );
}

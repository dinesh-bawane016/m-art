import { useState, useEffect } from 'react';
import API from '../utils/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Overview = () => {
  const [stats, setStats] = useState({ totalUsers: 0, totalArtists: 0, pendingVerifications: 0 });
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [recentOrders, setRecentOrders] = useState([]);
  const [categoryStats, setCategoryStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [statsRes, ordersRes, orderStatsRes] = await Promise.all([
          API.get('/users/stats'), 
          API.get('/orders'),
          API.get('/orders/stats')
        ]);
        setStats(statsRes.data);
        const orders = ordersRes.data;
        setTotalOrders(orders.length);
        setTotalRevenue(orders.filter(o => o.status === 'Completed').reduce((s, o) => s + o.total_amount, 0));
        setRecentOrders(orders.slice(0, 5));
        setCategoryStats(orderStatsRes.data.categoryStats || []);
      } catch (err) { console.error(err); }
      setLoading(false);
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-primary-950 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const statCards = [
    { label: 'Total Users', value: stats.totalUsers, sub: `${stats.totalArtists} artists` },
    { label: 'Pending Reviews', value: stats.pendingVerifications, sub: 'needs attention' },
    { label: 'Revenue', value: `₹${totalRevenue.toLocaleString('en-IN')}`, sub: 'completed' },
    { label: 'Total Orders', value: totalOrders, sub: 'all time' },
  ];

  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" id="stats-grid">
        {statCards.map((stat, i) => (
          <div key={i} className="border border-gray-200 p-6" id={`stat-card-${i}`}>
            <p className="text-xs font-semibold uppercase tracking-wider text-primary-500">{stat.label}</p>
            <p className="text-3xl font-serif font-bold text-primary-950 mt-2 stat-number">{stat.value}</p>
            <p className="text-xs text-primary-400 mt-1">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Analytics Chart */}
      {categoryStats.length > 0 && (
        <div className="border border-gray-200 p-6 bg-white" id="analytics-chart">
          <h3 className="text-lg font-serif font-bold text-primary-950 mb-6">Revenue by Category</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryStats} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="_id" tick={{ fill: '#6B7280', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={(val) => `₹${(val / 1000)}k`} tick={{ fill: '#6B7280', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip 
                  cursor={{ fill: '#f9fafb' }}
                  contentStyle={{ border: 'none', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  formatter={(value) => [`₹${value.toLocaleString()}`, 'Revenue']}
                />
                <Bar dataKey="revenue" fill="#111827" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Recent Orders */}
      <div className="border border-gray-200" id="recent-activity">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-serif font-bold text-primary-950">Recent Orders</h3>
        </div>
        {recentOrders.length === 0 ? (
          <p className="p-6 text-sm text-primary-500">No orders yet.</p>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-surface-100">
                <th className="text-left text-xs font-semibold uppercase tracking-wider text-primary-500 px-6 py-3">Artwork</th>
                <th className="text-left text-xs font-semibold uppercase tracking-wider text-primary-500 px-6 py-3">Buyer</th>
                <th className="text-right text-xs font-semibold uppercase tracking-wider text-primary-500 px-6 py-3">Amount</th>
                <th className="text-left text-xs font-semibold uppercase tracking-wider text-primary-500 px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order._id} className="border-b border-gray-100 hover:bg-surface-100 transition-colors">
                  <td className="px-6 py-4 text-sm text-primary-950">{order.artwork_id?.title || '—'}</td>
                  <td className="px-6 py-4 text-sm text-primary-600">{order.buyer_id?.name || '—'}</td>
                  <td className="px-6 py-4 text-sm text-primary-950 font-medium text-right">₹{order.total_amount?.toLocaleString('en-IN')}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-semibold uppercase tracking-wider ${order.status === 'Completed' ? 'text-green-700' : 'text-amber-700'}`}>{order.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default Overview

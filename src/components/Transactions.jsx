import { useState, useEffect } from 'react'
import API from '../utils/api'

const Transactions = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    const fetchOrders = async () => {
      try { const { data } = await API.get('/orders'); setOrders(data); }
      catch (err) { console.error(err); }
      setLoading(false);
    };
    fetchOrders();
  }, []);

  const filtered = statusFilter === 'all' ? orders : orders.filter((t) => t.status === statusFilter);
  const totalRevenue = orders.filter((t) => t.status === 'Completed').reduce((s, t) => s + t.total_amount, 0);
  const pendingAmount = orders.filter((t) => t.status === 'Pending').reduce((s, t) => s + t.total_amount, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-primary-950 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6" id="transaction-summary">
        <div className="border border-gray-200 p-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary-500">Completed Revenue</p>
          <p className="text-3xl font-serif font-bold text-green-700 mt-2">₹{totalRevenue.toLocaleString('en-IN')}</p>
          <p className="text-xs text-primary-400 mt-1">{orders.filter(t => t.status === 'Completed').length} transactions</p>
        </div>
        <div className="border border-gray-200 p-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary-500">Pending</p>
          <p className="text-3xl font-serif font-bold text-amber-700 mt-2">₹{pendingAmount.toLocaleString('en-IN')}</p>
          <p className="text-xs text-primary-400 mt-1">{orders.filter(t => t.status === 'Pending').length} transactions</p>
        </div>
      </div>

      {/* Table */}
      <div className="border border-gray-200" id="transactions-table">
        <div className="px-6 py-4 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h3 className="text-lg font-serif font-bold text-primary-950">Transaction History</h3>
          <div className="flex border border-gray-300">
            {['all', 'Completed', 'Pending'].map((s) => (
              <button key={s} onClick={() => setStatusFilter(s)}
                className={`px-4 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors ${
                  statusFilter === s ? 'bg-primary-950 text-white' : 'text-primary-600 hover:text-primary-950'
                }`}>
                {s}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <p className="p-8 text-center text-sm text-primary-500">No transactions found.</p>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-surface-100">
                <th className="text-left text-xs font-semibold uppercase tracking-wider text-primary-500 px-6 py-3">Artwork</th>
                <th className="text-left text-xs font-semibold uppercase tracking-wider text-primary-500 px-6 py-3">Buyer</th>
                <th className="text-right text-xs font-semibold uppercase tracking-wider text-primary-500 px-6 py-3">Amount</th>
                <th className="text-left text-xs font-semibold uppercase tracking-wider text-primary-500 px-6 py-3">Date</th>
                <th className="text-left text-xs font-semibold uppercase tracking-wider text-primary-500 px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((order) => (
                <tr key={order._id} className="border-b border-gray-100 hover:bg-surface-100 transition-colors">
                  <td className="px-6 py-4 text-sm text-primary-950">{order.artwork_id?.title || '—'}</td>
                  <td className="px-6 py-4 text-sm text-primary-600">{order.buyer_id?.name || '—'}</td>
                  <td className="px-6 py-4 text-sm text-primary-950 font-medium text-right">₹{order.total_amount?.toLocaleString('en-IN')}</td>
                  <td className="px-6 py-4 text-sm text-primary-600">
                    {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  </td>
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

export default Transactions

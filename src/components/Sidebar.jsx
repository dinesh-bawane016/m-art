import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ activePage, setActivePage, sidebarOpen, setSidebarOpen }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    {
      id: 'overview',
      label: 'Dashboard',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      ),
    },
    {
      id: 'verify-artists',
      label: 'Verify Artists',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
    },
    {
      id: 'artwork-moderation',
      label: 'Artworks',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      id: 'transactions',
      label: 'Transactions',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  ]

  return (
    <aside
      className={`fixed top-0 left-0 h-full bg-white border-r border-gray-200 transition-all duration-300 z-20 flex flex-col ${
        sidebarOpen ? 'w-64' : 'w-20'
      }`}
      id="sidebar"
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-gray-200">
        <span className="font-serif text-2xl font-bold text-primary-950 flex-shrink-0">M</span>
        {sidebarOpen && (
          <div className="overflow-hidden">
            <h2 className="text-lg font-serif font-bold text-primary-950">M-Art</h2>
            <p className="text-[10px] uppercase tracking-widest text-primary-500 -mt-0.5">Admin Panel</p>
          </div>
        )}
      </div>

      {/* Toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="mx-3 mt-4 mb-2 p-2 text-primary-500 hover:text-primary-950 transition-colors"
        id="sidebar-toggle"
      >
        <svg className={`w-5 h-5 transition-transform duration-300 ${!sidebarOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
        </svg>
      </button>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-1">
        <p className={`text-[10px] font-semibold text-primary-400 uppercase tracking-widest mb-3 ${sidebarOpen ? 'px-3' : 'text-center'}`}>
          {sidebarOpen ? 'Menu' : '•••'}
        </p>
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActivePage(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-all duration-200
              ${
                activePage === item.id
                  ? 'bg-primary-950 text-white'
                  : 'text-primary-600 hover:bg-surface-200 hover:text-primary-950'
              }
              ${!sidebarOpen ? 'justify-center' : ''}
            `}
            id={`nav-${item.id}`}
            title={item.label}
          >
            <span className="flex-shrink-0">{item.icon}</span>
            {sidebarOpen && <span className="text-xs uppercase tracking-wider">{item.label}</span>}
          </button>
        ))}
      </nav>

      {/* Bottom */}
      <div className="px-3 pb-4">
        <button
          onClick={handleLogout}
          className={`w-full flex items-center gap-3 px-3 py-2.5 text-xs font-medium uppercase tracking-wider text-primary-500 hover:text-primary-950 transition-colors ${!sidebarOpen ? 'justify-center' : ''}`}
        >
          <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          {sidebarOpen && <span>Logout</span>}
        </button>
      </div>
    </aside>
  )
}

export default Sidebar

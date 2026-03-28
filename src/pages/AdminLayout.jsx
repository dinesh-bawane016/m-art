import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Overview from '../components/Overview';
import VerifyArtists from '../components/VerifyArtists';
import ArtworkModeration from '../components/ArtworkModeration';
import Transactions from '../components/Transactions';

const AdminLayout = () => {
  const [activePage, setActivePage] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const renderPage = () => {
    switch (activePage) {
      case 'overview': return <Overview />;
      case 'verify-artists': return <VerifyArtists />;
      case 'artwork-moderation': return <ArtworkModeration />;
      case 'transactions': return <Transactions />;
      default: return <Overview />;
    }
  };

  const pageTitle = {
    'overview': 'Dashboard Overview',
    'verify-artists': 'Verify Artists',
    'artwork-moderation': 'Artwork Moderation',
    'transactions': 'Transactions',
  };

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      <Sidebar activePage={activePage} setActivePage={setActivePage} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <main className={`flex-1 overflow-y-auto transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        <header className="sticky top-0 z-10 bg-white border-b border-gray-200 px-8 py-5">
          <h1 className="text-2xl font-serif font-bold text-primary-950">{pageTitle[activePage]}</h1>
          <p className="text-xs text-primary-500 uppercase tracking-wider mt-1">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </header>

        <div className="p-8 page-enter" key={activePage}>
          {renderPage()}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;

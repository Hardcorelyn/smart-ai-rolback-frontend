import Sidebar from './Sidebar';
import { Bell, UserCircle } from 'lucide-react';

const Layout = ({ children }) => {
  return (
    <div className="flex h-screen bg-zinc-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-sm p-4 flex justify-between items-center">
          <h1 className="text-lg font-semibold text-zinc-800">Banking Processes And Activities Monitoring Dashboard</h1>
          <div className="flex items-center gap-4">
            <Bell className="text-zinc-500" />
            <UserCircle className="text-zinc-500" size={28} />
            <a href="/login" className="text-sm font-medium text-zinc-600 hover:text-orange-500">Log Out</a>
          </div>
        </header>
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
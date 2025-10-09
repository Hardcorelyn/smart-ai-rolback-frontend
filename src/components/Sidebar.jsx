import { NavLink } from 'react-router';
import { LayoutDashboard, Settings, ChevronsLeft, History, ChevronsRight } from 'lucide-react';
import { useState } from 'react';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navLinkClass = ({ isActive }) =>
    `flex items-center p-3 rounded-lg transition-colors ${
      isActive
        ? 'bg-orange-500 text-white'
        : 'text-zinc-600 hover:bg-zinc-200'
    } ${isCollapsed ? 'justify-center' : ''}`;

  return (
    <aside className={`bg-white shadow-md flex flex-col transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'}`}>
      <div className={`p-4 flex items-center gap-3 border-b border-zinc-200 ${isCollapsed ? 'justify-center' : ''}`}>
        {!isCollapsed && <h1 className="text-xl font-bold text-zinc-800">AI SDRS</h1>}
      </div>

      <nav className="flex-1 px-3 py-4 flex flex-col gap-2">
        <NavLink to="/" className={navLinkClass}>
          <LayoutDashboard />
          {!isCollapsed && <span className="ml-3">Dashboard</span>}
        </NavLink>
        <NavLink to="/settings" className={navLinkClass}>
          <Settings />
          {!isCollapsed && <span className="ml-3">Settings</span>}
        </NavLink>
         <NavLink to="/audit-logs" className={navLinkClass}>
          <History />
          {!isCollapsed && <span className="ml-3">Audit Logs</span>}
        </NavLink>
      </nav>

      <div className="p-3 border-t border-zinc-200">
        <button onClick={() => setIsCollapsed(!isCollapsed)} className="flex items-center p-3 rounded-lg text-zinc-600 hover:bg-zinc-200 w-full">
          {isCollapsed ? <ChevronsRight /> : <ChevronsLeft />}
          {!isCollapsed && <span className="ml-3">Collapse</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
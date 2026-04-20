import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Database,
  ShoppingCart,
  Users,
  BarChart3,
  Settings,
  ChefHat,
  ChevronLeft,
  ChevronRight,
  LogOut
} from 'lucide-react';
import { clsx } from 'clsx';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../features/auth/authSlice';
import { toast } from 'react-hot-toast';

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Logged out successfully');
    navigate('/');

  };

  const menuItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/admin' },
    { name: 'Products', icon: <Package size={20} />, path: '/admin/products' },
    { name: 'Stock', icon: <Database size={20} />, path: '/admin/stock' },
    { name: 'Orders', icon: <ShoppingCart size={20} />, path: '/admin/orders' },
    { name: 'Customers', icon: <Users size={20} />, path: '/admin/customers' },
    { name: 'Reports', icon: <BarChart3 size={20} />, path: '/admin/reports' },
    { name: 'Settings', icon: <Settings size={20} />, path: '/admin/settings' },
  ];

  return (
    <aside className="w-[260px] bg-gray-900 h-screen fixed left-0 top-0 text-gray-400 flex flex-col z-50">
      {/* Brand */}
      <div className="p-6 flex items-center gap-3 border-b border-gray-800/50">
        <div className="bg-primary-600 p-2 rounded-lg text-white shadow-lg shadow-primary-900/20">
          <ChefHat size={24} />
        </div>
        <div className="overflow-hidden">
          <h1 className="text-white font-black text-xl tracking-tight leading-none font-jakarta">DAS Enterprise</h1>
          <p className="text-[10px] uppercase font-bold tracking-widest text-primary-500 mt-1">Admin Panel</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto custom-scrollbar">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end={item.path === '/admin'}
            className={({ isActive }) => clsx(
              "flex items-center gap-4 px-4 py-3 rounded-xl font-bold transition-all duration-300 group",
              isActive
                ? "bg-primary-600/10 text-primary-500 border-l-4 border-primary-600 shadow-sm"
                : "hover:bg-gray-800 hover:text-white border-l-4 border-transparent"
            )}
          >
            <span className={clsx("transition-transform group-hover:scale-110", item.path === '/admin' ? "text-primary-500" : "")}>
              {item.icon}
            </span>
            <span className="text-sm">{item.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer / Account */}
      <div className="p-4 border-t border-gray-800/50">
        <div className="bg-gray-800/30 p-4 rounded-2xl flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 border-2 border-gray-700 flex items-center justify-center text-white text-xs font-black">
            AD
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-white text-xs font-bold truncate">Admin User</p>
            <p className="text-[10px] text-gray-500 truncate">admin@distro.com</p>
          </div>
          <button
            onClick={handleLogout}
            className="text-gray-500 hover:text-red-500 transition-colors"
            title="Logout"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

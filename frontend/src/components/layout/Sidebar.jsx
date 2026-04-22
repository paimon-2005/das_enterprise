import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  LayoutDashboard,
  Package,
  Database,
  ShoppingCart,
  Store,
  MapPin,
  LogOut,
  ChefHat,
  ChevronRight,
  X
} from 'lucide-react';
import { clsx } from 'clsx';
import { logout, selectCurrentUser } from '../../features/auth/authSlice';
import { toast } from 'react-hot-toast';

const Sidebar = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectCurrentUser);

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Sign out successful');
    navigate('/login');
  };

  const adminMenu = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/admin/dashboard' },
    { name: 'Order Management', icon: <ShoppingCart size={20} />, path: '/admin/orders' },
    { name: 'Shop Partners', icon: <Store size={20} />, path: '/admin/shops' },
    { name: 'Inventory Management', icon: <Package size={20} />, path: '/admin/products' },
    { name: 'Stock Levels', icon: <Database size={20} />, path: '/admin/stock' },
    { name: 'Delivery Areas', icon: <MapPin size={20} />, path: '/admin/areas' },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity" 
          onClick={onClose}
        />
      )}

      <aside className={clsx(
        "w-72 bg-white h-screen fixed left-0 top-0 border-r-2 border-gray-100 flex flex-col z-50 shadow-sm transition-transform duration-300 lg:translate-x-0 lg:static lg:h-auto",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        "lg:fixed" // Keep it fixed on desktop
      )}>
        
        {/* Brand Header */}
        <div className="p-6 border-b-2 border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-[#16a34a] p-2.5 rounded-2xl text-white shadow-md shadow-green-200">
              <ChefHat size={26} strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-gray-900 font-black text-xl tracking-tight leading-none">
                DAS <span className="text-[#16a34a]">Enterprise</span>
              </h1>
              <p className="text-[11px] font-bold tracking-widest text-gray-400 mt-1 uppercase">Administrator</p>
            </div>
          </div>
          {/* Mobile Close Button */}
          <button 
            onClick={onClose}
            className="lg:hidden p-2 hover:bg-gray-50 rounded-xl text-gray-400"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-5 space-y-1 overflow-y-auto">
          <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em] px-3 mb-3">Main Menu</p>
          {adminMenu.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={() => {
                if (window.innerWidth < 1024) onClose();
              }}
              className={({ isActive }) => clsx(
                "flex items-center justify-between px-4 py-3.5 rounded-xl font-bold transition-all group text-sm",
                isActive
                  ? "bg-[#16a34a] text-white shadow-md shadow-green-200"
                  : "text-gray-600 hover:bg-green-50 hover:text-[#16a34a]"
              )}
            >
              <div className="flex items-center gap-3">
                <span className="transition-transform group-hover:scale-110">
                  {item.icon}
                </span>
                <span>{item.name}</span>
              </div>
              <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all" />
            </NavLink>
          ))}
        </nav>

        {/* Account Info at Bottom */}
        <div className="p-4 border-t-2 border-gray-100">
          <div className="bg-gray-50 border-2 border-gray-100 p-4 rounded-2xl flex items-center gap-3 hover:border-gray-200 transition-all">
            <div className="w-11 h-11 rounded-xl bg-[#16a34a] flex items-center justify-center text-white font-black text-lg shadow-sm shrink-0">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-gray-900 text-sm font-black truncate">{user?.name}</p>
              <p className="text-xs text-gray-400 font-medium truncate">{user?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="text-gray-400 hover:text-red-500 p-2 hover:bg-red-50 rounded-xl transition-all border border-gray-200 hover:border-red-100"
              title="Sign Out"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

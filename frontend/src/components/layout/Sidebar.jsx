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
  X,
  Wheat,
  ChevronRight,
} from 'lucide-react';
import { clsx } from 'clsx';
import { logout, selectCurrentUser } from '../../features/auth/authSlice';
import { toast } from 'react-hot-toast';

const Sidebar = ({ isOpen, onClose }) => {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const user      = useSelector(selectCurrentUser);

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Signed out successfully');
    navigate('/login');
  };

  const adminMenu = [
    { name: 'Dashboard',           icon: <LayoutDashboard size={18} />, path: '/admin/dashboard' },
    { name: 'Order Management',    icon: <ShoppingCart    size={18} />, path: '/admin/orders'    },
    { name: 'Shop Partners',       icon: <Store           size={18} />, path: '/admin/shops'     },
    { name: 'Product Catalogue',   icon: <Package         size={18} />, path: '/admin/products'  },
    { name: 'Stock Management',    icon: <Database        size={18} />, path: '/admin/stock'     },
    { name: 'Delivery Areas',      icon: <MapPin          size={18} />, path: '/admin/areas'     },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          onClick={onClose}
        />
      )}

      <aside className={clsx(
        'w-[260px] bg-white h-screen fixed left-0 top-0 flex flex-col z-50',
        'border-r border-gray-200 shadow-sm transition-transform duration-300',
        'lg:translate-x-0',
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
      )}>

        {/* Brand header — dark primary */}
        <div className="bg-primary-800 px-5 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="bg-white/10 p-2 rounded-lg">
              <Wheat size={22} className="text-white" strokeWidth={2} />
            </div>
            <div>
              <h1 className="text-white font-bold text-base leading-none tracking-tight">
                DAS Enterprise
              </h1>
              <p className="text-primary-200 text-[10px] font-medium mt-0.5 uppercase tracking-widest">
                B2B Wholesale
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden text-white/60 hover:text-white p-1 rounded transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav section label */}
        <div className="px-5 pt-5 pb-1">
          <p className="text-[10px] font-semibold text-txt-secondary uppercase tracking-[0.2em]">
            Main Navigation
          </p>
        </div>

        {/* Navigation links */}
        <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto">
          {adminMenu.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={() => { if (window.innerWidth < 1024) onClose(); }}
              className={({ isActive }) => clsx(
                'flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all group',
                isActive
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'text-txt-secondary hover:bg-primary-50 hover:text-primary-700',
              )}
            >
              <div className="flex items-center gap-3">
                <span className="shrink-0">{item.icon}</span>
                <span>{item.name}</span>
              </div>
              <ChevronRight
                size={14}
                className="opacity-0 group-hover:opacity-60 transition-opacity"
              />
            </NavLink>
          ))}
        </nav>

        {/* User card at bottom */}
        <div className="p-3 border-t border-gray-100 shrink-0">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-surface border border-gray-100">
            <div className="w-9 h-9 rounded-lg bg-primary-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
              {user?.name?.charAt(0).toUpperCase() || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-txt-primary text-sm font-semibold truncate">{user?.name || 'Admin'}</p>
              <p className="text-txt-secondary text-xs truncate">{user?.email || ''}</p>
            </div>
            <button
              onClick={handleLogout}
              title="Sign Out"
              className="text-txt-secondary hover:text-red-500 p-1.5 hover:bg-red-50 rounded-lg transition-all border border-transparent hover:border-red-100"
            >
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

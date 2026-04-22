import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    Box,
    PackageSearch,
    ShoppingCart,
    Users,
    Layers,
    BarChart3,
    Settings,
    ChefHat
} from 'lucide-react';

const Sidebar = () => {
    const navLinks = [
        { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/admin' },
        { name: 'Products', icon: <Box size={20} />, path: '/admin/products' },
        { name: 'Stock', icon: <PackageSearch size={20} />, path: '/admin/stock' },
        { name: 'Orders', icon: <ShoppingCart size={20} />, path: '/admin/orders' },
        { name: 'Network Dealers', icon: <Users size={20} />, path: '/admin/dealers' },
        { name: 'Categories', icon: <Layers size={20} />, path: '/admin/categories' },
        { name: 'Reports', icon: <BarChart3 size={20} />, path: '/admin/reports' },
        { name: 'Settings', icon: <Settings size={20} />, path: '/admin/settings' },

    ];

    return (
        <aside className="fixed left-0 top-0 h-screen w-[260px] bg-gray-900 text-gray-400 flex flex-col z-50">
            {/* Logo */}
            <div className="p-6 flex items-center gap-3 border-b border-gray-800">
                <div className="bg-primary-600 p-2 rounded-lg text-white">
                    <ChefHat size={24} />
                </div>
                <div>
                    <h1 className="text-white font-bold text-lg leading-none">DAS Enterprise</h1>
                    <p className="text-xs mt-1 text-gray-500">Admin Panel</p>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-4 px-3 space-y-1">
                {navLinks.map((link) => (
                    <NavLink
                        key={link.name}
                        to={link.path}
                        end={link.path === '/admin'}
                        className={({ isActive }) => `
                            flex items-center gap-3 px-4 py-3 rounded-lg transition-all
                            ${isActive
                                ? 'bg-primary-600/10 text-primary-500 border-l-4 border-primary-600'
                                : 'hover:bg-gray-800 hover:text-white border-l-4 border-transparent'}
                        `}
                    >
                        {link.icon}
                        <span className="font-medium">{link.name}</span>
                    </NavLink>
                ))}
            </nav>

            {/* Footer / User info */}
            <div className="p-4 border-t border-gray-800">
                <div className="flex items-center gap-3 p-2 rounded-lg bg-gray-800/50">
                    <div className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center text-white font-bold">
                        A
                    </div>
                    <div>
                        <p className="text-white text-sm font-semibold">Admin User</p>
                        <p className="text-xs text-gray-500">admin@dasenterprise.in</p>

                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;

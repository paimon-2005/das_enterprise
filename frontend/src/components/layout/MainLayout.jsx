import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../features/auth/authSlice';

const MainLayout = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useSelector((state) => state.auth);
    const [menuOpen, setMenuOpen] = useState(false);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/');

    };

    const navLinks = [
        { to: '/shop', label: 'Home' },
        { to: '/shop/cart', label: '🛒 Cart' },
        { to: '/shop/my-orders', label: 'My Orders' },
        { to: '/shop/profile', label: 'Profile' },
    ];

    return (
        <div className="min-h-screen bg-[#0f1115] text-white font-sans flex flex-col">
            {/* Top Navbar */}
            <nav className="sticky top-0 z-50 bg-[#16191f]/90 backdrop-blur border-b border-white/10 shadow-lg">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    {/* Logo */}
                    <Link to="/shop" className="flex items-center gap-2 text-xl font-bold tracking-tight">
                        <span className="text-2xl">🥦</span>
                        <span className="bg-gradient-to-r from-green-400 to-emerald-300 bg-clip-text text-transparent">
                            Das Enterprise
                        </span>
                    </Link>

                    {/* Desktop Nav Links */}
                    <div className="hidden md:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.to}
                                to={link.to}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                                    location.pathname === link.to
                                        ? 'bg-green-500/20 text-green-400'
                                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* User Menu */}
                    <div className="relative">
                        <button
                            onClick={() => setMenuOpen(!menuOpen)}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 transition-all duration-200"
                        >
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-sm font-bold text-white shadow">
                                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                            </div>
                            <span className="hidden md:block text-sm text-gray-300 max-w-[120px] truncate">
                                {user?.name || 'Customer'}
                            </span>
                            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        {menuOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-[#1e2028] border border-white/10 rounded-xl shadow-2xl py-1 z-50">
                                <Link
                                    to="/shop/profile"
                                    onClick={() => setMenuOpen(false)}
                                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
                                >
                                    <span>👤</span> My Profile
                                </Link>
                                <Link
                                    to="/shop/my-orders"
                                    onClick={() => setMenuOpen(false)}
                                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
                                >
                                    <span>📦</span> My Orders
                                </Link>
                                <div className="border-t border-white/10 my-1" />
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
                                >
                                    <span>🚪</span> Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            {/* Page Content */}
            <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8">
                <Outlet />
            </main>

            {/* Footer */}
            <footer className="border-t border-white/10 bg-[#16191f] py-6 text-center text-sm text-gray-500">
                © {new Date().getFullYear()} Das Enterprise. All rights reserved.
            </footer>
        </div>
    );
};

export default MainLayout;

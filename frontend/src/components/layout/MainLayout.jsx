import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout, selectCurrentUser } from '../../features/auth/authSlice';
import {
    LayoutDashboard,
    ShoppingCart,
    Package,
    User,
    LogOut,
    Menu,
    X,
    Wheat,
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { clsx } from 'clsx';

const MainLayout = () => {
    const dispatch  = useDispatch();
    const navigate  = useNavigate();
    const location  = useLocation();
    const user      = useSelector(selectCurrentUser);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        dispatch(logout());
        toast.success('Signed out');
        navigate('/login');
    };

    const navLinks = [
        { to: '/dealer/dashboard', label: 'Dashboard',     icon: LayoutDashboard },
        { to: '/dealer/products',  label: 'Order Products', icon: ShoppingCart },
        { to: '/dealer/orders',    label: 'Order History',  icon: Package },
        { to: '/dealer/profile',   label: 'Shop Profile',   icon: User },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <div className="min-h-screen bg-surface text-txt-primary font-inter flex flex-col">

            {/* ── Top Navbar ─────────────────────────────────── */}
            <nav className="sticky top-0 z-50 bg-primary-800 shadow-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">

                    {/* Brand */}
                    <Link to="/dealer/dashboard" className="flex items-center gap-3 shrink-0">
                        <div className="bg-white/10 p-2 rounded-lg">
                            <Wheat className="w-5 h-5 text-white" strokeWidth={2} />
                        </div>
                        <div className="hidden sm:block">
                            <span className="text-white font-bold text-base leading-none block tracking-tight">
                                DAS Enterprise
                            </span>
                            <span className="text-primary-300 text-[10px] font-medium uppercase tracking-widest">
                                Distribution Partner
                            </span>
                        </div>
                    </Link>

                    {/* Desktop nav links */}
                    <div className="hidden lg:flex items-center gap-1 flex-1 justify-center">
                        {navLinks.map((link) => (
                            <Link
                                key={link.to}
                                to={link.to}
                                className={clsx(
                                    'px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all',
                                    isActive(link.to)
                                        ? 'bg-white/15 text-white'
                                        : 'text-white/70 hover:text-white hover:bg-white/10',
                                )}
                            >
                                <link.icon className="w-4 h-4" />
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Right: user info + logout */}
                    <div className="flex items-center gap-3">
                        <div className="hidden sm:flex items-center gap-3">
                            <div className="text-right">
                                <p className="text-white text-sm font-semibold leading-none truncate max-w-[130px]">
                                    {user?.shopName}
                                </p>
                                <p className="text-primary-300 text-[11px] font-medium mt-0.5">
                                    {user?.area}
                                </p>
                            </div>
                            <div className="w-9 h-9 rounded-lg bg-white/15 flex items-center justify-center text-white font-bold text-sm border border-white/20">
                                {user?.shopName?.charAt(0).toUpperCase()}
                            </div>
                            <button
                                onClick={handleLogout}
                                title="Sign Out"
                                className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-all border border-white/10"
                            >
                                <LogOut className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Mobile hamburger */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="lg:hidden p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                        >
                            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>
                </div>

                {/* Mobile dropdown */}
                {isMobileMenuOpen && (
                    <div className="lg:hidden bg-primary-900 border-t border-white/10 p-4 space-y-1">
                        {/* User info */}
                        <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl mb-3 border border-white/10">
                            <div className="w-10 h-10 rounded-lg bg-white/15 flex items-center justify-center text-white font-bold text-base">
                                {user?.shopName?.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <p className="font-semibold text-white text-sm">{user?.shopName}</p>
                                <p className="text-xs text-primary-300">{user?.area}</p>
                            </div>
                        </div>
                        {navLinks.map((link) => (
                            <Link
                                key={link.to}
                                to={link.to}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={clsx(
                                    'flex items-center gap-3 p-3 rounded-xl font-medium text-sm transition-all',
                                    isActive(link.to)
                                        ? 'bg-white/15 text-white'
                                        : 'text-white/70 hover:bg-white/10 hover:text-white',
                                )}
                            >
                                <link.icon className="w-4 h-4" />
                                {link.label}
                            </Link>
                        ))}
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 p-3 rounded-xl font-medium text-sm text-red-400 hover:bg-red-500/10 w-full text-left mt-1 transition-all"
                        >
                            <LogOut className="w-4 h-4" /> Sign Out
                        </button>
                    </div>
                )}
            </nav>

            {/* ── Page content ──────────────────────────────── */}
            <main className="flex-1">
                <Outlet />
            </main>

            {/* ── Footer ────────────────────────────────────── */}
            <footer className="bg-card border-t border-gray-200 py-6">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="bg-primary-600 p-2 rounded-lg">
                            <Wheat className="w-4 h-4 text-white" />
                        </div>
                        <div>
                            <p className="font-semibold text-txt-primary text-sm">DAS Enterprise</p>
                            <p className="text-xs text-txt-secondary">Official Distribution Network</p>
                        </div>
                    </div>
                    <div className="flex gap-6 text-sm font-medium text-txt-secondary">
                        <span className="hover:text-primary-600 transition-colors cursor-pointer">Support</span>
                        <span className="hover:text-primary-600 transition-colors cursor-pointer">Policies</span>
                        <span>GST: {user?.gstNumber || 'NA'}</span>
                    </div>
                    <p className="text-xs text-txt-secondary">
                        © {new Date().getFullYear()} DAS Enterprise Portal
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default MainLayout;

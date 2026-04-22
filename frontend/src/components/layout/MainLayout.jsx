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
    ChefHat
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const MainLayout = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const user = useSelector(selectCurrentUser);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        dispatch(logout());
        toast.success('Signed out');
        navigate('/login');
    };

    const navLinks = [
        { to: '/dealer/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { to: '/dealer/products', label: 'Order Products', icon: ShoppingCart },
        { to: '/dealer/orders', label: 'Order History', icon: Package },
        { to: '/dealer/profile', label: 'Shop Profile', icon: User },
    ];

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 font-sans flex flex-col">
            {/* Dealer Top Navbar */}
            <nav className="sticky top-0 z-50 bg-white border-b-2 border-gray-100 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-8 h-20 flex items-center justify-between">
                    
                    {/* Brand */}
                    <Link to="/dealer/dashboard" className="flex items-center gap-3 group">
                        <div className="bg-[#16a34a] p-2.5 rounded-xl shadow-md shadow-green-200 group-hover:bg-[#15803d] transition-colors">
                            <ChefHat className="w-6 h-6 text-white" strokeWidth={2.5} />
                        </div>
                        <div className="hidden sm:block">
                            <span className="text-xl font-black tracking-tight leading-none block text-gray-900">
                                Das <span className="text-[#16a34a]">Enterprise</span>
                            </span>
                            <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">Distribution Partner</span>
                        </div>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden lg:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.to}
                                to={link.to}
                                className={`px-5 py-3 rounded-xl text-sm font-bold flex items-center gap-2.5 transition-all duration-200 ${
                                    location.pathname === link.to
                                        ? 'bg-[#16a34a] text-white shadow-md shadow-green-200'
                                        : 'text-gray-600 hover:text-[#16a34a] hover:bg-green-50'
                                }`}
                            >
                                <link.icon className="w-4 h-4" />
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Right: User & Mobile Toggle */}
                    <div className="flex items-center gap-3">
                        <div className="hidden sm:flex items-center gap-3 pl-4 border-l-2 border-gray-100">
                            <div className="w-10 h-10 rounded-xl bg-[#16a34a] flex items-center justify-center text-white font-black text-lg shadow-sm">
                                {user?.shopName?.charAt(0).toUpperCase()}
                            </div>
                            <div className="text-left">
                                <p className="text-sm font-black text-gray-900 truncate max-w-[130px]">{user?.shopName}</p>
                                <p className="text-[11px] text-[#16a34a] font-bold">{user?.area}</p>
                            </div>
                            <button
                                onClick={handleLogout}
                                title="Sign Out"
                                className="p-2.5 bg-red-50 hover:bg-red-100 text-red-400 hover:text-red-600 rounded-xl transition-all border border-red-100 ml-1"
                            >
                                <LogOut className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Mobile Menu Toggle */}
                        <button 
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="lg:hidden p-2.5 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all"
                        >
                            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="lg:hidden bg-white border-t-2 border-gray-100 p-4 space-y-2 shadow-lg">
                        {/* User info on mobile */}
                        <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl mb-3 border border-green-100">
                            <div className="w-12 h-12 rounded-xl bg-[#16a34a] flex items-center justify-center text-white font-black text-xl">
                                {user?.shopName?.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <p className="font-black text-gray-900">{user?.shopName}</p>
                                <p className="text-sm text-[#16a34a] font-bold">{user?.area}</p>
                            </div>
                        </div>
                        {navLinks.map((link) => (
                            <Link
                                key={link.to}
                                to={link.to}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`flex items-center gap-4 p-4 rounded-xl font-bold text-base transition-all ${
                                    location.pathname === link.to 
                                        ? 'bg-[#16a34a] text-white shadow-md shadow-green-200' 
                                        : 'text-gray-700 bg-gray-50 hover:bg-green-50 hover:text-[#16a34a]'
                                }`}
                            >
                                <link.icon className="w-6 h-6" />
                                {link.label}
                            </Link>
                        ))}
                        <button 
                            onClick={handleLogout}
                            className="flex items-center gap-4 p-4 rounded-xl font-bold text-red-600 bg-red-50 w-full text-left border border-red-100 text-base"
                        >
                            <LogOut className="w-6 h-6" /> Sign Out
                        </button>
                    </div>
                )}
            </nav>

            {/* Page Content */}
            <main className="flex-1">
                <Outlet />
            </main>

            {/* Footer */}
            <footer className="bg-white border-t-2 border-gray-100 py-8">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="bg-[#16a34a] p-2 rounded-lg text-white">
                            <ChefHat className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="font-black text-gray-900">Das <span className="text-[#16a34a]">Enterprise</span></p>
                            <p className="text-xs text-gray-400 font-medium">Official Distribution Network</p>
                        </div>
                    </div>
                    <div className="flex gap-6 text-sm font-bold text-gray-400">
                        <span className="hover:text-[#16a34a] transition-colors cursor-pointer">Support</span>
                        <span className="hover:text-[#16a34a] transition-colors cursor-pointer">Policies</span>
                        <span>GST: {user?.gstNumber || 'NA'}</span>
                    </div>
                    <p className="text-xs text-gray-400 font-medium">
                        © {new Date().getFullYear()} Enterprise Portal
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default MainLayout;

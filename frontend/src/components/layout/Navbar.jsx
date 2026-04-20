import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { selectCurrentUser, selectIsAuthenticated, logout } from '../../features/auth/authSlice';
import { selectTotalQuantity } from '../../features/cart/cartSlice';
import { Search, ShoppingCart, User, Menu, X, Package, LogOut, Settings, ChefHat } from 'lucide-react';


const Navbar = ({ onOpenLogin }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const user = useSelector(selectCurrentUser);
    
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const cartCount = useSelector(selectTotalQuantity);

    const handleLogout = () => {
        dispatch(logout());
        setIsUserDropdownOpen(false);
        navigate('/');
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
            setIsSearchOpen(false);
        }
    };

    return (
        <nav className="sticky top-0 z-50 w-full bg-white shadow-sm border-b border-gray-100 font-jakarta">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    
                    {/* Logo - LEFT */}
                    <Link to="/" className="flex items-center gap-2 flex-shrink-0 group">
                        <div className="bg-[#16a34a] p-2 rounded-xl group-hover:bg-[#15803d] transition-colors text-white">
                            <ChefHat size={24} />
                        </div>
                        <span className="font-bold text-xl tracking-tight text-gray-900 hidden sm:block">
                            DAS <span className="text-[#16a34a]">Enterprise</span>
                        </span>

                    </Link>

                    {/* Nav Links - CENTER */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link to="/" className="text-gray-600 hover:text-[#16a34a] font-medium transition-colors">Home</Link>
                        <Link to="/products" className="text-gray-600 hover:text-[#16a34a] font-medium transition-colors">Products</Link>
                        <Link to="/register-shop" className="px-3 py-1.5 bg-primary-50 text-primary-700 rounded-lg text-xs font-black uppercase tracking-widest border border-primary-100 hover:bg-primary-600 hover:text-white hover:border-primary-600 transition-all">
                            B2B Wholesale
                        </Link>
                        <Link to="/about" className="text-gray-600 hover:text-[#16a34a] font-medium transition-colors">About</Link>
                        <Link to="/contact" className="text-gray-600 hover:text-[#16a34a] font-medium transition-colors">Contact</Link>
                    </div>

                    {/* Action Buttons - RIGHT */}
                    <div className="hidden md:flex items-center space-x-5">
                        
                        {/* Expandable Search */}
                        <div className="relative flex items-center">
                            {isSearchOpen ? (
                                <form onSubmit={handleSearchSubmit} className="flex items-center absolute right-0 animate-in fade-in slide-in-from-right-4 duration-200">
                                    <input 
                                        type="text" 
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Search products..."
                                        autoFocus
                                        className="pl-4 pr-10 py-1.5 border border-gray-200 rounded-full focus:outline-none focus:border-[#16a34a] focus:ring-1 focus:ring-[#16a34a] text-sm w-48 shadow-sm"
                                    />
                                    <button type="button" onClick={() => setIsSearchOpen(false)} className="absolute right-3 text-gray-400 hover:text-gray-600">
                                        <X size={14} />
                                    </button>
                                </form>
                            ) : (
                                <button onClick={() => setIsSearchOpen(true)} className="text-gray-500 hover:text-[#16a34a] transition-colors p-2 rounded-full hover:bg-green-50">
                                    <Search className="w-5 h-5" />
                                </button>
                            )}
                        </div>
                        
                        <Link to="/cart" className="text-gray-500 hover:text-[#16a34a] p-2 rounded-full hover:bg-green-50 transition-colors relative group">
                            <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            {cartCount > 0 && (
                                <span className="absolute top-0 right-0 bg-[#ea580c] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white transform translate-x-1 -translate-y-1">
                                    {cartCount}
                                </span>
                            )}
                        </Link>

                        {isAuthenticated && user ? (
                            <div className="relative">
                                <button 
                                    onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                                    className="flex items-center gap-2 p-1 pl-2 pr-3 rounded-full border border-gray-200 hover:border-[#16a34a] hover:bg-green-50 transition-all"
                                >
                                    <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#16a34a] to-[#22c55e] flex items-center justify-center text-white text-xs font-bold">
                                        {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                    </div>
                                    <span className="text-sm font-medium text-gray-700">{user.name?.split(' ')[0] || 'User'}</span>
                                </button>

                                {isUserDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                                        {user.role === 'admin' ? (
                                            <Link to="/admin/dashboard" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#16a34a]">
                                                <Settings className="w-4 h-4" /> Admin Dashboard
                                            </Link>
                                        ) : (
                                            <>
                                                <Link to="/my-orders" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#16a34a]">
                                                    <Package className="w-4 h-4" /> My Orders
                                                </Link>
                                                <Link to="/profile" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#16a34a]">
                                                    <User className="w-4 h-4" /> Profile
                                                </Link>
                                            </>
                                        )}
                                        <div className="h-px bg-gray-100 my-2"></div>
                                        <button 
                                            onClick={handleLogout}
                                            className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-medium"
                                        >
                                            <LogOut className="w-4 h-4" /> Sign out
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <button 
                                onClick={onOpenLogin}
                                className="text-gray-500 hover:text-[#16a34a] hover:bg-green-50 p-2 rounded-full transition-all"
                                aria-label="Login"
                            >
                                <User className="w-5 h-5" />
                            </button>
                        )}
                    </div>

                    {/* Mobile Menu Toggle */}
                    <div className="md:hidden flex items-center gap-4">
                        <button className="text-gray-500 hover:text-[#16a34a]">
                            <Search className="w-5 h-5" />
                        </button>
                        <Link to="/cart" className="text-gray-500 hover:text-[#16a34a] relative">
                            <ShoppingCart className="w-5 h-5" />
                            {cartCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-[#ea580c] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
                                    {cartCount}
                                </span>
                            )}
                        </Link>
                        <button 
                            className="text-gray-500 hover:text-[#16a34a]"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Nav Dropdown */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-white border-t border-gray-100 py-4 px-4 space-y-4 shadow-lg absolute w-full left-0 z-40 animate-in slide-in-from-top-2">
                    <Link to="/" className="block text-gray-600 hover:text-[#16a34a] font-medium p-2">Home</Link>
                    <Link to="/products" className="block text-gray-600 hover:text-[#16a34a] font-medium p-2">Products</Link>
                    <Link to="/register-shop" className="block text-primary-600 font-black uppercase tracking-widest text-xs p-2">B2B Wholesale Registration</Link>
                    <Link to="/about" className="block text-gray-600 hover:text-[#16a34a] font-medium p-2">About</Link>
                    <Link to="/contact" className="block text-gray-600 hover:text-[#16a34a] font-medium p-2">Contact</Link>
                    <div className="h-px bg-gray-100 my-2"></div>
                    
                    {!isAuthenticated ? (
                        <button 
                            onClick={() => {
                                setIsMobileMenuOpen(false);
                                onOpenLogin();
                            }}
                            className="w-full bg-[#16a34a] text-white font-medium py-3 rounded-xl hover:bg-[#15803d]"
                        >
                            Sign In / Register
                        </button>
                    ) : (
                        <div className="space-y-2">
                            <div className="flex items-center gap-3 p-2">
                                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-[#16a34a] font-bold">
                                    {user?.name?.charAt(0) || 'U'}
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
                                    <p className="text-xs text-gray-500">{user?.email}</p>
                                </div>
                            </div>
                            {user?.role === 'admin' ? (
                                <Link to="/admin/dashboard" className="block text-gray-600 hover:text-[#16a34a] font-medium p-2">Admin Dashboard</Link>
                            ) : (
                                <>
                                    <Link to="/my-orders" className="block text-gray-600 hover:text-[#16a34a] font-medium p-2">My Orders</Link>
                                    <Link to="/profile" className="block text-gray-600 hover:text-[#16a34a] font-medium p-2">Profile</Link>
                                </>
                            )}
                            <button 
                                onClick={handleLogout}
                                className="w-full text-left text-red-600 hover:bg-red-50 font-medium p-2 rounded-lg"
                            >
                                Sign out
                            </button>
                        </div>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;

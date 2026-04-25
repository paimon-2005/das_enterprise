import React, { useState, useEffect } from 'react';
import Navbar from '../components/layout/Navbar';
import LoginModal from '../components/auth/LoginModal';
import { ShoppingCart, Heart, ShieldCheck, Truck, Tag, Clock, ArrowRight, Star, Phone, ChefHat } from 'lucide-react';

import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addItem } from '../features/cart/cartSlice';
import toast from 'react-hot-toast';

// MOCK DATA for Landing Page UI
const CATEGORIES = [
    { id: 1, name: 'Nestle', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Nestle_textlogo.svg/2560px-Nestle_textlogo.svg.png', count: 124 },
    { id: 2, name: 'Oils & Fats', image: 'https://cdn-icons-png.flaticon.com/512/3075/3075908.png', count: 45 },
    { id: 3, name: 'Spices', image: 'https://cdn-icons-png.flaticon.com/512/1041/1041341.png', count: 89 },
    { id: 4, name: 'Dairy', image: 'https://cdn-icons-png.flaticon.com/512/2674/2674486.png', count: 32 },
    { id: 5, name: 'Beverages', image: 'https://cdn-icons-png.flaticon.com/512/3124/3124233.png', count: 56 },
    { id: 6, name: 'Snacks', image: 'https://cdn-icons-png.flaticon.com/512/1256/1256667.png', count: 112 },
];

const PROMOTED_PRODUCTS = [
    { id: 1, name: 'Premium Basmati Rice', category: 'Grains', price: 1250, stock: 'In Stock', rating: 4.8, image: 'https://images.unsplash.com/photo-1586201375761-83865001e8ac?w=500&auto=format&fit=crop' },
    { id: 2, name: 'Cold Pressed Mustard Oil 5L', category: 'Oils', price: 850, stock: 'Low Stock', rating: 4.9, image: 'https://images.unsplash.com/photo-1620021614051-229ec6ea310d?w=500&auto=format&fit=crop' },
    { id: 3, name: 'Organic Turmeric Powder', category: 'Spices', price: 299, stock: 'In Stock', rating: 4.7, image: 'https://images.unsplash.com/photo-1615486171448-472ac2985172?w=500&auto=format&fit=crop' },
    { id: 4, name: 'A2 Cow Ghee Pure', category: 'Dairy', price: 1950, stock: 'Out of Stock', rating: 5.0, image: 'https://images.unsplash.com/photo-1678174780515-56455def3a49?w=500&auto=format&fit=crop' },
];

const LandingPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

    useEffect(() => {
        if (location.state?.openLogin) {
            setIsLoginModalOpen(true);
            navigate('.', { replace: true, state: {} });
        }
    }, [location.state, navigate]);

    const handleAddToCart = (product) => {
        dispatch(addItem(product));
        toast.success(`Added ${product.name} to cart!`, {
            style: { background: '#16a34a', color: '#fff' }
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            <Navbar onOpenLogin={() => setIsLoginModalOpen(true)} />

            <main className="flex-1">
                {/* HERO SECTION */}
                <section className="relative w-full bg-gradient-to-r from-[#16a34a] to-[#15803d] overflow-hidden">
                    <div className="absolute inset-0 bg-black/10"></div>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <div className="py-20 md:py-28 lg:py-32 flex flex-col md:flex-row items-center gap-12">
                            {/* Text Content */}
                            <div className="w-full md:w-1/2 text-white">
                                <span className="inline-block py-1 px-3 rounded-full bg-white/20 text-white text-sm font-semibold tracking-wider mb-6 backdrop-blur-md">
                                    B2B & WHOLESALE
                                </span>
                                <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight mb-6 leading-tight font-jakarta">
                                    Fresh Food.<br />Direct to Your Door.
                                </h1>
                                <p className="text-lg md:text-xl text-green-50 mb-10 max-w-lg leading-relaxed">
                                    Premium quality food products distributed across the region. Unbeatable wholesale prices, guaranteed freshness.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <button onClick={() => navigate('/products')} className="bg-white text-[#16a34a] hover:bg-gray-50 font-bold py-4 px-8 rounded-xl shadow-xl transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2">
                                        Shop Now <ArrowRight size={18} />
                                    </button>
                                    <button onClick={() => navigate('/register-shop')} className="bg-transparent border-2 border-white text-white hover:bg-white/10 font-bold py-4 px-8 rounded-xl transition-all flex items-center justify-center gap-2">
                                        Become a Dealer <ChefHat size={18} />
                                    </button>
                                </div>

                            </div>

                            {/* Hero Image */}
                            <div className="w-full md:w-1/2 relative">
                                <div className="absolute inset-0 bg-white/20 rounded-full blur-3xl filter transform scale-110"></div>
                                <img
                                    src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80"
                                    alt="Fresh produce and groceries"
                                    className="relative z-10 w-full h-[400px] object-cover rounded-2xl shadow-2xl origin-bottom animate-in slide-in-from-right-10 duration-1000"
                                />

                                {/* Floating Badges */}
                                <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-xl z-20 animate-bounce delay-100 flex items-center gap-3">
                                    <div className="bg-yellow-100 p-2 rounded-full text-yellow-600"><Star size={24} fill="currentColor" /></div>
                                    <div>
                                        <p className="font-bold text-gray-900">4.9/5</p>
                                        <p className="text-xs text-gray-500">Customer Rating</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* FEATURED CATEGORIES */}
                <section className="py-16 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-end mb-8">
                            <div>
                                <h2 className="text-3xl font-bold text-gray-900 font-jakarta mb-2">Shop by Category</h2>
                                <p className="text-gray-500">Explore our wide range of premium wholesale products.</p>
                            </div>
                        </div>

                        {/* Horizontal Scroll Container */}
                        <div className="flex overflow-x-auto pb-6 -mx-4 px-4 sm:mx-0 sm:px-0 gap-6 hide-scroll-bar">
                            {CATEGORIES.map(cat => (
                                <button
                                    key={cat.id}
                                    onClick={() => navigate(`/products?category=${encodeURIComponent(cat.name.split(' ')[0].toLowerCase())}`)}
                                    className="min-w-[180px] flex-shrink-0 bg-white border border-gray-100 rounded-3xl p-8 flex flex-col items-center justify-center gap-6 hover:shadow-2xl hover:border-[#16a34a] transition-all group flex-1"
                                >
                                    <div className="h-16 flex items-center justify-center">
                                        <img
                                            src={cat.image}
                                            alt={cat.name}
                                            className="h-full object-contain group-hover:scale-110 transition-transform"
                                        />
                                    </div>
                                    <div className="text-center">
                                        <h3 className="font-bold text-gray-900 text-sm">{cat.name}</h3>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{cat.count} Products</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </section>

                {/* PROMO BANNER */}
                <section className="bg-gradient-to-r from-orange-600 to-amber-500 py-4 shadow-inner">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-center gap-4 text-white text-center">
                        <span className="bg-white text-orange-600 px-3 py-1 rounded-full text-sm font-bold animate-pulse">SPECIAL OFFER</span>
                        <p className="text-lg md:text-xl font-medium">Bulk Orders? Get up to <span className="font-bold text-2xl">20% discount!</span></p>
                        <p className="md:ml-auto font-bold flex items-center gap-2"><Phone className="w-5 h-5" /> Call: +91 98765 43210</p>
                    </div>
                </section>

                {/* FEATURED PRODUCTS */}
                <section className="py-20 bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-end mb-10">
                            <div>
                                <h2 className="text-3xl font-bold text-gray-900 font-jakarta mb-2">Featured Products</h2>
                                <p className="text-gray-500">Top quality ingredients handpicked for you.</p>
                            </div>
                            <button onClick={() => navigate('/products')} className="hidden md:flex text-[#16a34a] font-semibold hover:text-[#15803d] items-center gap-1 group">
                                View All Products <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {PROMOTED_PRODUCTS.map(product => (
                                <div key={product.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-gray-100 transition-all group">
                                    {/* Image Container */}
                                    <div className="relative h-56 overflow-hidden">
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                        <button className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-md text-gray-400 hover:text-red-500 transition-colors">
                                            <Heart size={18} />
                                        </button>
                                        <div className="absolute top-3 left-3">
                                            <span className="bg-[#16a34a] text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                                                {product.category}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-5">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-bold text-gray-900 text-lg leading-tight line-clamp-2">{product.name}</h3>
                                        </div>

                                        <div className="flex items-center gap-1 text-yellow-500 text-sm mb-4">
                                            <Star size={14} fill="currentColor" />
                                            <span className="font-medium text-gray-700">{product.rating}</span>
                                        </div>

                                        <div className="flex items-center justify-between mb-4">
                                            <span className="text-2xl font-bold text-[#16a34a]">₹{product.price.toLocaleString('en-IN')}</span>
                                            <span className={`text-xs font-bold px-2 py-1 rounded-md ${product.stock === 'In Stock' ? 'bg-green-100 text-green-700' :
                                                    product.stock === 'Low Stock' ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'
                                                }`}>
                                                {product.stock}
                                            </span>
                                        </div>

                                        <button
                                            onClick={() => handleAddToCart(product)}
                                            disabled={product.stock === 'Out of Stock'}
                                            className={`w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${product.stock === 'Out of Stock'
                                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                    : 'bg-[#16a34a] text-white hover:bg-[#15803d] active:scale-95 shadow-md shadow-green-500/20'
                                                }`}
                                        >
                                            <ShoppingCart size={18} />
                                            {product.stock === 'Out of Stock' ? 'Out of Stock' : 'Add to Cart'}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-10 text-center md:hidden">
                            <button onClick={() => navigate('/products')} className="text-[#16a34a] font-semibold flex py-3 px-6 bg-green-50 rounded-xl mx-auto items-center gap-2">
                                View All Products <ArrowRight size={18} />
                            </button>
                        </div>
                    </div>
                </section>

                {/* WHY CHOOSE US */}
                <section className="py-20 bg-white border-t border-gray-100">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center max-w-2xl mx-auto mb-16">
                            <h2 className="text-3xl font-bold text-gray-900 font-jakarta mb-4">Why Das Enterprise?</h2>
                            <p className="text-gray-500 text-lg">We are committed to delivering the best quality products directly from farms and factories to your business.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {[
                                { icon: Truck, title: 'Fast Delivery', desc: 'Next-day delivery across the metro region for all orders.' },
                                { icon: ShieldCheck, title: 'Quality Assured', desc: 'Every product passes strict quality control checks.' },
                                { icon: Tag, title: 'Best Prices', desc: 'Unbeatable wholesale pricing direct from manufacturers.' },
                                { icon: Clock, title: '24/7 Support', desc: 'Our customer service team is always here to help you.' },
                            ].map((feature, i) => (
                                <div key={i} className="text-center p-6 rounded-2xl bg-gray-50 hover:bg-green-50 hover:scale-105 transition-all duration-300">
                                    <div className="w-16 h-16 bg-[#16a34a] text-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/20">
                                        <feature.icon size={32} />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                                    <p className="text-gray-500 leading-relaxed">{feature.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>

            {/* FOOTER */}
            <footer className="bg-[#0f1115] text-white pt-20 pb-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                        {/* Company Info */}
                        <div className="lg:col-span-1">
                            <Link to="/" className="flex items-center gap-2 mb-6">
                                <div className="bg-[#16a34a] p-1.5 rounded-lg text-white">
                                    <ChefHat size={20} />
                                </div>
                                <span className="font-bold text-xl tracking-tight">
                                    DAS <span className="text-[#16a34a]">Enterprise</span>
                                </span>
                            </Link>
                            <p className="text-gray-400 text-sm leading-relaxed mb-6">
                                Your trusted wholesale food distributor. Delivering premium ingredients to restaurants, cafes, and retailers since 2010.
                            </p>
                            <div className="flex gap-4">
                                {/* Social Icons - just decorative */}
                                {['Twitter', 'Facebook', 'Instagram', 'LinkedIn'].map((social) => (
                                    <a key={social} href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#16a34a] text-gray-400 hover:text-white transition-colors">
                                        <span className="sr-only">{social}</span>
                                        <div className="w-4 h-4 bg-current"></div>
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div>
                            <h4 className="text-lg font-bold mb-6 font-jakarta">Quick Links</h4>
                            <ul className="space-y-3 text-gray-400">
                                <li><Link to="/products" className="hover:text-white transition-colors">Shop All Products</Link></li>
                                <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
                                <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
                                <li><Link to="/faq" className="hover:text-white transition-colors">FAQs</Link></li>
                            </ul>
                        </div>

                        {/* Categories */}
                        <div>
                            <h4 className="text-lg font-bold mb-6 font-jakarta">Categories</h4>
                            <ul className="space-y-3 text-gray-400">
                                <li><Link to="/category/grains-rice" className="hover:text-white transition-colors">Grains & Rice</Link></li>
                                <li><Link to="/category/oils-fats" className="hover:text-white transition-colors">Oils & Fats</Link></li>
                                <li><Link to="/category/spices" className="hover:text-white transition-colors">Spices</Link></li>
                                <li><Link to="/category/dairy" className="hover:text-white transition-colors">Dairy Products</Link></li>
                            </ul>
                        </div>

                        {/* Contact */}
                        <div>
                            <h4 className="text-lg font-bold mb-6 font-jakarta">Contact Information</h4>
                            <ul className="space-y-4 text-gray-400">
                                <li className="flex gap-3">
                                    <span className="text-[#16a34a]">📍</span>
                                    <span>123 Wholesale Market Road, Industrial Area, Mumbai, 400001</span>
                                </li>
                                <li className="flex gap-3">
                                    <span className="text-[#16a34a]">📞</span>
                                    <span>+91 98765 43210</span>
                                </li>
                                <li className="flex gap-3">
                                    <span className="text-[#16a34a]">✉️</span>
                                    <span>sales@dasenterprise.in</span>

                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
                        <p>© {new Date().getFullYear()} Das Enterprise. All rights reserved.</p>
                        <div className="flex gap-6">
                            <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                            <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
                        </div>
                    </div>
                </div>
            </footer>

            {/* Login Modal Overlay */}
            <LoginModal
                isOpen={isLoginModalOpen}
                onClose={() => setIsLoginModalOpen(false)}
            />
        </div>
    );
};

export default LandingPage;

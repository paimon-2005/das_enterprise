import React from 'react';
import { ShoppingCart, Star, ArrowRight, Truck, ShieldCheck, Clock, ChefHat } from 'lucide-react';
import { motion } from 'framer-motion';

const Home = () => {
    return (
        <div className="font-inter">
            {/* Hero Section */}
            <section className="relative h-[80vh] flex items-center overflow-hidden bg-gray-900">
                <div className="absolute inset-0 opacity-40">
                    <img
                        src="https://images.unsplash.com/photo-1542831371-29b0f74f9713?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
                        alt="Background"
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="max-w-7xl mx-auto px-6 relative z-10 text-white">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="bg-primary-600 text-[10px] font-black uppercase tracking-[3px] px-3 py-1 rounded-full mb-6 inline-block">
                            Das Enterprise
                        </span>
                        <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
                            Fresh Ingredients <br />
                            <span className="text-primary-500">Delivered To You.</span>
                        </h1>
                        <p className="text-lg text-gray-300 max-w-2xl mb-10 leading-relaxed">
                            Serving over 500+ restaurants and 10,000+ happy homes with the finest quality grains, spices, oils, and dairy products.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <button className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-xl font-bold flex items-center gap-2 transition-all">
                                Shop Now <ArrowRight size={20} />
                            </button>
                            <button className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white px-8 py-4 rounded-xl font-bold transition-all border border-white/20">
                                View Categories
                            </button>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Features Stats */}
            <section className="bg-white py-12 border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="flex items-center gap-4">
                        <div className="bg-primary-50 p-4 rounded-2xl text-primary-600">
                            <Truck size={32} />
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-900">Same Day Delivery</h4>
                            <p className="text-sm text-gray-500">For orders before 12 PM</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="bg-blue-50 p-4 rounded-2xl text-blue-600">
                            <ShieldCheck size={32} />
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-900">Quality Guaranteed</h4>
                            <p className="text-sm text-gray-500">100% organic & certified</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="bg-purple-50 p-4 rounded-2xl text-purple-600">
                            <Clock size={32} />
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-900">24/7 Support</h4>
                            <p className="text-sm text-gray-500">Dedicated assistance team</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Categories */}
            <section className="py-24 bg-gray-50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex justify-between items-end mb-12">
                        <div>
                            <span className="text-primary-600 font-bold uppercase tracking-widest text-[10px]">What we offer</span>
                            <h2 className="text-3xl font-black text-gray-900 mt-2">Explore Categories</h2>
                        </div>
                        <button className="text-primary-600 font-bold flex items-center gap-1 hover:gap-2 transition-all">
                            View All <ArrowRight size={18} />
                        </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { name: 'Grains & Rice', img: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=400&q=80', count: '120+ Products' },
                            { name: 'Cooking Oils', img: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=400&q=80', count: '45+ Products' },
                            { name: 'Pure Spices', img: 'https://images.unsplash.com/photo-1532336414038-cf19250c5757?auto=format&fit=crop&w=400&q=80', count: '85+ Products' },
                            { name: 'Dairy Products', img: 'https://images.unsplash.com/photo-1550583724-125581cc2532?auto=format&fit=crop&w=400&q=80', count: '30+ Products' },
                        ].map((cat, i) => (
                            <motion.div
                                key={i}
                                whileHover={{ y: -10 }}
                                className="group cursor-pointer"
                            >
                                <div className="relative h-64 rounded-3xl overflow-hidden shadow-sm">
                                    <img src={cat.img} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                                    <div className="absolute bottom-6 left-6 text-white">
                                        <h4 className="text-xl font-bold">{cat.name}</h4>
                                        <p className="text-sm opacity-80 mt-1">{cat.count}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Promotional Section */}
            <section className="py-24">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="bg-gray-900 rounded-[3rem] p-8 md:p-16 flex flex-col md:flex-row items-center gap-12 overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-600/20 blur-[100px] rounded-full"></div>
                        <div className="flex-1 text-center md:text-left relative z-10">
                            <span className="text-primary-500 font-bold uppercase tracking-widest text-[10px]">Limited Offer</span>
                            <h2 className="text-4xl md:text-5xl font-black text-white mt-4 mb-6 leading-tight">
                                Get Extra 20% Off <br />
                                <span className="text-primary-500">On Your First Bulk Order</span>
                            </h2>
                            <p className="text-gray-400 mb-10 max-w-lg">
                                Use code "FRESH20" at checkout. Only applicable for new verified distributor accounts.
                            </p>
                            <button className="bg-primary-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-primary-700 transition-all">
                                Get Started Today
                            </button>
                        </div>
                        <div className="flex-1 relative z-10">
                            <div className="bg-white/5 p-4 rounded-3xl border border-white/10 backdrop-blur-md">
                                <img
                                    src="https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80"
                                    alt="Product"
                                    className="rounded-2xl shadow-2xl"
                                />
                                <div className="absolute -top-6 -right-6 bg-primary-500 text-white w-24 h-24 rounded-full flex flex-col items-center justify-center font-black rotate-12 shadow-xl border-4 border-gray-900">
                                    <span className="text-xl">20%</span>
                                    <span className="text-xs">OFF</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact / Footer Minimal */}
            <footer className="bg-white py-12 border-t border-gray-100 mt-24">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex items-center gap-3">
                        <div className="bg-primary-600 p-2 rounded-lg text-white">
                            <ChefHat size={24} />
                        </div>
                        <h2 className="text-2xl font-black text-gray-900">DAS Enterprise</h2>
                    </div>
                    <p className="text-sm text-gray-500">© 2026 DAS Enterprise E-Commerce. All rights reserved.</p>
                    <div className="flex gap-6">
                        <a href="#" className="text-sm font-bold text-gray-900 hover:text-primary-600 transition-colors">Privacy</a>
                        <a href="#" className="text-sm font-bold text-gray-900 hover:text-primary-600 transition-colors">Terms</a>
                        <a href="#" className="text-sm font-bold text-gray-900 hover:text-primary-600 transition-colors">Contact</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;

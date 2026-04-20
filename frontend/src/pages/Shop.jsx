import React, { useState, useEffect } from 'react';
import Navbar from '../components/layout/Navbar';
import { useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addItem } from '../features/cart/cartSlice';
import { ShoppingCart, Heart, Filter, ChevronDown, Star, Search, Loader2 } from 'lucide-react';
import { useGetProductsQuery } from '../features/products/productsApi';
import toast from 'react-hot-toast';

const CATEGORIES = ['All', 'Grains & Rice', 'Oils & Fats', 'Spices', 'Dairy', 'Beverages', 'Snacks', 'Condiments', 'Pulses'];

const Shop = () => {
    const dispatch = useDispatch();
    const [searchParams, setSearchParams] = useSearchParams();
    
    const urlCategory = searchParams.get('category');
    const urlSearch = searchParams.get('search') || '';
    
    const [selectedCategory, setSelectedCategory] = useState(urlCategory || 'All');
    const [searchQuery, setSearchQuery] = useState(urlSearch);
    const [inStockOnly, setInStockOnly] = useState(false);
    const [sortOption, setSortOption] = useState('newest');

    // Real API Query
    const { data: productsData, isLoading, isFetching } = useGetProductsQuery({
        search: searchQuery,
        category: selectedCategory === 'All' ? '' : selectedCategory,
        isActive: true, // Only show active products for customers
        sort: sortOption === 'price-low' ? 'price' : sortOption === 'price-high' ? '-price' : '-createdAt'
    });

    const products = productsData?.data || [];

    const handleAddToCart = (product) => {
        dispatch(addItem({
            ...product,
            id: product._id // Ensure consistency with cart slice expectation
        }));
        toast.success(`Added ${product.name} to cart!`, {
            style: { background: '#16a34a', color: '#fff' }
        });
    };

    const handleCategoryClick = (cat) => {
        setSelectedCategory(cat);
        if (cat === 'All') {
            searchParams.delete('category');
        } else {
            searchParams.set('category', cat);
        }
        setSearchParams(searchParams);
    };

    const handleSearchChange = (e) => {
        const val = e.target.value;
        setSearchQuery(val);
        if (val) {
            searchParams.set('search', val);
        } else {
            searchParams.delete('search');
        }
        setSearchParams(searchParams);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            <Navbar />
            
            <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
                
                <div className="mb-8">
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">Shop Our Products</h1>
                    <p className="text-gray-500 font-medium">Find the massive wholesale collection of all premium ingredients.</p>
                </div>

                <div className="flex flex-col md:flex-row gap-8">
                    {/* Filters Sidebar */}
                    <aside className="w-full md:w-64 flex-shrink-0 space-y-6">
                        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm sticky top-24">
                            <div className="flex items-center gap-2 font-black text-gray-900 mb-6 pb-4 border-b border-gray-100 uppercase tracking-widest text-xs">
                                <Filter size={16} />
                                <h2>Filters</h2>
                            </div>

                            <div className="mb-6">
                                <h3 className="text-[10px] font-black text-gray-400 mb-3 uppercase tracking-widest leading-none">Search</h3>
                                <div className="relative">
                                    <Search className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
                                    <input 
                                        type="text" 
                                        value={searchQuery}
                                        onChange={handleSearchChange}
                                        placeholder="Rice, Spices..."
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 pl-9 pr-3 text-sm focus:ring-[#16a34a] focus:border-[#16a34a] font-medium outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <div className="mb-6 pb-6 border-b border-gray-100">
                                <h3 className="text-[10px] font-black text-gray-400 mb-3 uppercase tracking-widest">Categories</h3>
                                <ul className="space-y-2">
                                    {CATEGORIES.map(cat => (
                                        <li key={cat}>
                                            <button 
                                                onClick={() => handleCategoryClick(cat)}
                                                className={`text-sm font-bold transition-all ${selectedCategory === cat ? 'text-[#16a34a] translate-x-1' : 'text-gray-500 hover:text-[#16a34a]'}`}
                                            >
                                                {cat}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div>
                                <h3 className="text-[10px] font-black text-gray-400 mb-3 uppercase tracking-widest">Availability</h3>
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <input 
                                        type="checkbox" 
                                        checked={inStockOnly}
                                        onChange={(e) => setInStockOnly(e.target.checked)}
                                        className="w-5 h-5 border-gray-300 rounded text-[#16a34a] focus:ring-[#16a34a]"
                                    />
                                    <span className="text-sm font-bold text-gray-600 group-hover:text-gray-900 transition-colors">In Stock Only</span>
                                </label>
                            </div>
                        </div>
                    </aside>

                    {/* Product Grid Area */}
                    <div className="flex-1 space-y-6">
                        {/* Toolbar */}
                        <div className="flex flex-col sm:flex-row justify-between items-center bg-white p-4 rounded-3xl border border-gray-100 shadow-sm gap-4">
                            <p className="text-sm text-gray-500 font-bold">
                                {isLoading ? 'Searching...' : (
                                    <>
                                        Showing <span className="text-gray-900 font-black">{products.length}</span> results
                                        {selectedCategory !== 'All' && <span> for <span className="text-gray-900 font-black">{selectedCategory}</span></span>}
                                    </>
                                )}
                            </p>

                            <div className="flex items-center gap-2">
                                <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Sort by:</span>
                                <div className="relative">
                                    <select 
                                        value={sortOption}
                                        onChange={(e) => setSortOption(e.target.value)}
                                        className="appearance-none bg-gray-50 border border-gray-100 text-gray-900 text-sm font-black rounded-xl py-2 pl-4 pr-10 focus:outline-none focus:ring-4 focus:ring-green-50 cursor-pointer transition-all"
                                    >
                                        <option value="newest">Newest</option>
                                        <option value="price-low">Price: Low to High</option>
                                        <option value="price-high">Price: High to Low</option>
                                    </select>
                                    <ChevronDown className="absolute right-3 top-2.5 text-gray-400 pointer-events-none" size={16} />
                                </div>
                            </div>
                        </div>

                        {/* Grid */}
                        {isLoading ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {Array(8).fill(0).map((_, i) => (
                                    <div key={i} className="bg-white rounded-3xl p-4 h-80 animate-pulse border border-gray-100">
                                        <div className="h-40 bg-gray-50 rounded-2xl mb-4"></div>
                                        <div className="h-4 bg-gray-50 rounded w-3/4 mb-2"></div>
                                        <div className="h-4 bg-gray-50 rounded w-1/2"></div>
                                    </div>
                                ))}
                            </div>
                        ) : products.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {products.map(product => (
                                    <div key={product._id} className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl border border-gray-100 transition-all group flex flex-col hover:-translate-y-1 duration-300">
                                        <div className="relative h-48 overflow-hidden bg-gray-50">
                                            <img 
                                                src={product.images?.[0] || 'https://via.placeholder.com/400'} 
                                                alt={product.name} 
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                            />
                                            <div className="absolute top-4 left-0">
                                                <span className="bg-[#16a34a] text-white text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-r-full shadow-lg">
                                                    {product.category}
                                                </span>
                                            </div>
                                            {product.isFeatured && (
                                                <div className="absolute top-4 right-4 bg-amber-400 text-white p-1.5 rounded-xl shadow-lg">
                                                    <Star size={14} fill="currentColor" />
                                                </div>
                                            )}
                                        </div>
                                        
                                        <div className="p-5 flex flex-col flex-1">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-1 text-amber-500">
                                                    <Star className="w-3.5 h-3.5" fill="currentColor" />
                                                    <span className="text-xs font-black">{product.ratings?.avg || 0}</span>
                                                </div>
                                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter italic">{product.unit}</span>
                                            </div>

                                            <h3 className="font-bold text-gray-900 text-base leading-tight mb-4 flex-1 group-hover:text-[#16a34a] transition-colors">{product.name}</h3>
                                            
                                            <div className="flex items-center justify-between mb-5">
                                                <div>
                                                    <p className="text-[10px] font-black text-gray-300 uppercase leading-none mb-1">Price</p>
                                                    <span className="text-2xl font-black text-[#16a34a]">₹{product.price.toLocaleString('en-IN')}</span>
                                                </div>
                                                {product.stock === 0 ? (
                                                    <span className="text-[10px] font-black text-red-500 bg-red-50 px-2 py-1 rounded uppercase tracking-widest border border-red-100">Sold Out</span>
                                                ) : product.stock <= 10 ? (
                                                    <span className="text-[10px] font-black text-amber-600 bg-amber-50 px-2 py-1 rounded uppercase tracking-widest border border-amber-100">Only {product.stock} left</span>
                                                ) : null}
                                            </div>
                                            
                                            <button 
                                                onClick={() => handleAddToCart(product)}
                                                disabled={product.stock === 0}
                                                className={`w-full py-4 rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${
                                                    product.stock === 0 
                                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                                    : 'bg-[#16a34a] text-white hover:bg-[#15803d] shadow-lg shadow-green-100 active:scale-95'
                                                }`}
                                            >
                                                <ShoppingCart size={16} />
                                                Add to Cart
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white border border-gray-100 rounded-3xl p-20 text-center shadow-sm">
                                <Search className="w-16 h-16 text-gray-100 mx-auto mb-6" />
                                <h3 className="text-2xl font-black text-gray-900 mb-2">No items found</h3>
                                <p className="text-gray-500 font-medium">Try adjusting your filters or search keywords.</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Shop;

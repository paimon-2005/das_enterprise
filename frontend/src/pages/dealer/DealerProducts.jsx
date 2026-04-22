import React, { useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-hot-toast';
import { 
    Filter,
    Search, 
    ShoppingCart, 
    Plus, 
    Minus, 
    X, 
    Trash2, 
    Package, 
    Info, 
    CreditCard,
    CheckCircle2,
    Store,
    MapPin,
    Phone,
    Loader2
} from 'lucide-react';

import { selectCurrentUser } from '../../features/auth/authSlice';
import { useCreateOrderMutation } from '../../features/orders/ordersApi';
import { useGetProductsQuery } from '../../features/products/productsApi';
const DealerProducts = () => {
    const user = useSelector(selectCurrentUser);
    const { data: productsData, isLoading } = useGetProductsQuery();
    const products = productsData?.data || [];
    const [createOrder, { isLoading: isOrdering }] = useCreateOrderMutation();

    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');
    const [cart, setCart] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [notes, setNotes] = useState('');

    // Precomputed categories from products
    const categories = useMemo(() => {
        if (!products) return ['All'];
        const unique = [...new Set(products.map(p => p.category))];
        return ['All', ...unique];
    }, [products]);

    // Filtered products
    const filteredProducts = useMemo(() => {
        if (!products) return [];
        return products.filter(p => {
            const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCat = activeCategory === 'All' || p.category === activeCategory;
            return matchesSearch && matchesCat && p.isActive;
        });
    }, [products, searchTerm, activeCategory]);

    // Cart Helper Functions
    const addToCart = (product, qty = 1) => {
        setCart(prev => {
            const existing = prev.find(item => item.product === product._id);
            if (existing) {
                return prev.map(item => 
                    item.product === product._id ? { ...item, quantity: item.quantity + qty } : item
                );
            }
            return [...prev, { 
                product: product._id, 
                productName: product.name, 
                price: product.price, 
                quantity: qty,
                image: product.images?.[0] || '',
                unit: product.unit
            }];
        });
        toast.success(`Added ${product.name} to cart`);
    };

    const updateQty = (id, newQty) => {
        if (newQty < 1) return removeFromCart(id);
        setCart(prev => prev.map(item => item.product === id ? { ...item, quantity: newQty } : item));
    };

    const removeFromCart = (id) => {
        setCart(prev => prev.filter(item => item.product !== id));
    };

    const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const tax = Math.round(subtotal * 0.18);
    const total = subtotal + tax;

    // Place Order Flow
    const handlePlaceOrder = async () => {
        if (cart.length === 0) return;
        
        try {
            await createOrder({
                items: cart.map(({ product, quantity }) => ({ product, quantity })),
                notes
            }).unwrap();
            
            toast.success("Order #PRD placed successfully!");
            setCart([]);
            setIsCartOpen(false);
            setNotes('');
        } catch (err) {
            toast.error(err?.data?.message || "Failed to place order");
        }
    };

    if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-[#0f1115]"><Loader2 className="w-10 h-10 text-[#16a34a] animate-spin" /></div>;

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 p-4 lg:p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Filters Sidebar */}
                    <aside className="w-full md:w-64 flex-shrink-0 space-y-6">
                        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm sticky top-24">
                            <div className="flex items-center gap-2 font-black text-gray-900 mb-6 pb-4 border-b border-gray-100 uppercase tracking-widest text-xs">
                                <Filter size={16} />
                                <h2>Market Filters</h2>
                            </div>

                            <div className="mb-6">
                                <h3 className="text-[10px] font-black text-gray-400 mb-3 uppercase tracking-widest leading-none">Search Products</h3>
                                <div className="relative">
                                    <Search className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
                                    <input 
                                        type="text" 
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        placeholder="Rice, Spices..."
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 pl-9 pr-3 text-sm focus:ring-[#16a34a] focus:border-[#16a34a] font-medium outline-none transition-all shadow-sm"
                                    />
                                </div>
                            </div>

                            <div className="mb-6 pb-6 border-b border-gray-100">
                                <h3 className="text-[10px] font-black text-gray-400 mb-3 uppercase tracking-widest">Categories</h3>
                                <ul className="space-y-2">
                                    {categories.map(cat => (
                                        <li key={cat}>
                                            <button 
                                                onClick={() => setActiveCategory(cat)}
                                                className={`text-sm font-bold transition-all ${activeCategory === cat ? 'text-[#16a34a] translate-x-1' : 'text-gray-500 hover:text-[#16a34a]'}`}
                                            >
                                                {cat}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div>
                                <h3 className="text-[10px] font-black text-gray-400 mb-3 uppercase tracking-widest">Dashboard Info</h3>
                                <div className="p-3 bg-green-50 rounded-xl border border-green-100">
                                    <p className="text-[10px] text-[#16a34a] font-bold uppercase mb-1">Your Region</p>
                                    <p className="text-xs font-black text-gray-900">{user?.area}</p>
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Product Grid Area */}
                    <div className="flex-1 space-y-6">
                        {/* Toolbar */}
                        <div className="flex flex-col sm:flex-row justify-between items-center bg-white p-4 rounded-3xl border border-gray-100 shadow-sm gap-4">
                            <p className="text-sm text-gray-500 font-bold">
                                Showing <span className="text-gray-900 font-black">{filteredProducts.length}</span> wholesale products
                            </p>
                            <div className="flex items-center gap-3">
                                {cart.length > 0 && (
                                    <button 
                                        onClick={() => setIsCartOpen(true)}
                                        className="flex items-center gap-2 bg-[#16a34a] text-white px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest animate-pulse"
                                    >
                                        <ShoppingCart size={14} /> {cart.length} Items in Cart
                                    </button>
                                )}
                            </div>
                        </div>

                        {filteredProducts.length > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-6">
                                {filteredProducts.map(product => (
                                    <div key={product._id} className="bg-white border border-gray-200 rounded-xl sm:rounded-2xl overflow-hidden group hover:border-[#16a34a]/30 transition-all shadow-sm flex flex-col">
                                        <div className="aspect-square bg-gray-50 relative overflow-hidden">
                                            {product.images?.[0] ? (
                                                <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-200">
                                                    <Package className="w-12 h-12" />
                                                </div>
                                            )}
                                            <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-md text-gray-900 text-[10px] font-black uppercase py-1 px-2.5 rounded-lg tracking-wider border border-gray-100">
                                                {product.category}
                                            </span>
                                        </div>
                                        <div className="p-3 sm:p-5 space-y-3 sm:space-y-4 flex-1 flex flex-col justify-between">
                                            <div className="space-y-1">
                                                <h3 className="font-bold text-xs sm:text-base text-gray-900 group-hover:text-[#16a34a] transition-colors line-clamp-2 sm:line-clamp-1 h-8 sm:h-auto">{product.name}</h3>
                                                <p className="text-gray-400 text-[8px] sm:text-[10px] font-bold uppercase tracking-widest">{product.unit || 'Standard Unit'}</p>
                                            </div>
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                                <span className="text-lg sm:text-2xl font-black text-[#16a34a]">₹{product.price}</span>
                                                <span className={`text-[8px] sm:text-[10px] font-bold uppercase px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-md border self-start sm:self-auto
                                                    ${product.stock > 10 ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-700 border-red-100'}`}>
                                                    {product.stock > 10 ? 'In Stock' : `Low`}
                                                </span>
                                            </div>
                                            <button
                                                onClick={() => addToCart(product)}
                                                disabled={product.stock <= 0}
                                                className="w-full bg-[#16a34a] hover:bg-[#15803d] disabled:bg-gray-100 text-white font-black py-2.5 sm:py-4 rounded-lg sm:rounded-xl flex items-center justify-center gap-1 sm:gap-2 transition-all shadow-lg shadow-green-100 uppercase text-[8px] sm:text-[10px] tracking-wider sm:tracking-[0.2em] mt-auto"
                                            >
                                                <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                                                Add
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white border border-gray-100 rounded-3xl p-20 text-center shadow-sm">
                                <Search className="w-16 h-16 text-gray-100 mx-auto mb-6" />
                                <h3 className="text-2xl font-black text-gray-900 mb-2">No wholesale items found</h3>
                                <p className="text-gray-500 font-medium italic">Try adjusting your filters or contact your distribution manager.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Floating Cart Button */}
            {cart.length > 0 && (
                <button
                    onClick={() => setIsCartOpen(true)}
                    className="fixed bottom-8 right-8 bg-[#16a34a] text-white p-5 rounded-2xl shadow-2xl shadow-green-900/40 hover:scale-105 transition-transform flex items-center gap-3 z-40"
                >
                    <div className="relative">
                        <ShoppingCart className="w-7 h-7" />
                        <span className="absolute -top-2 -right-2 bg-white text-[#16a34a] text-xs font-black rounded-full w-5 h-5 flex items-center justify-center">
                            {cart.length}
                        </span>
                    </div>
                    <div className="text-left hidden sm:block">
                        <p className="text-[10px] font-bold uppercase opacity-80 leading-none">Your Cart</p>
                        <p className="font-black text-lg">₹{total.toLocaleString('en-IN')}</p>
                    </div>
                </button>
            )}

            {/* Cart Sidebar */}
            {isCartOpen && (
                <>
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-all" onClick={() => setIsCartOpen(false)} />
                    <div className="fixed top-0 right-0 h-full w-full max-w-md bg-white border-l border-gray-200 shadow-2xl z-50 flex flex-col transition-all">
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                            <h2 className="text-xl font-bold flex items-center gap-2 text-gray-900">
                                <ShoppingCart className="text-[#16a34a]" />
                                Checkout Cart
                            </h2>
                            <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-gray-50 rounded-lg transition-colors">
                                <X className="w-6 h-6 text-gray-400" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {cart.map(item => (
                                <div key={item.product} className="flex gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                                    <div className="w-16 h-16 bg-white border border-gray-100 rounded-lg flex items-center justify-center shrink-0">
                                        <Package className="w-8 h-8 text-gray-200" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-bold text-gray-900 truncate">{item.productName}</h4>
                                        <p className="text-[#16a34a] font-bold mt-1">₹{item.price} <span className="text-gray-400 text-[10px] font-normal italic">/ {item.unit}</span></p>
                                        <div className="flex items-center gap-3 mt-3">
                                            <div className="flex items-center bg-white border border-gray-200 rounded-lg p-1">
                                                <button onClick={() => updateQty(item.product, item.quantity - 1)} className="p-1 hover:bg-gray-50 rounded text-gray-400 transition-colors"><Minus className="w-4 h-4" /></button>
                                                <span className="w-8 text-center font-bold text-sm text-gray-900">{item.quantity}</span>
                                                <button onClick={() => updateQty(item.product, item.quantity + 1)} className="p-1 hover:bg-gray-50 rounded text-gray-400 transition-colors"><Plus className="w-4 h-4" /></button>
                                            </div>
                                            <button onClick={() => removeFromCart(item.product)} className="text-gray-300 hover:text-red-500 transition-colors ml-auto"><Trash2 className="w-4 h-4" /></button>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            <div className="space-y-4 mt-8">
                                <label className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                    <Info className="w-4 h-4" />
                                    Special Instructions
                                </label>
                                <textarea 
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-gray-900 focus:border-[#16a34a] outline-none transition-all italic"
                                    placeholder="Add any notes for delivery..."
                                    rows="3"
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                />
                            </div>

                            {/* Shop Info Preview */}
                            <div className="bg-[#16a34a]/5 border border-[#16a34a]/20 p-5 rounded-2xl space-y-4">
                                <h3 className="text-sm font-bold text-[#16a34a] uppercase tracking-widest border-b border-[#16a34a]/20 pb-2">Your Shop Info</h3>
                                <div className="space-y-3">
                                    <div className="flex items-start gap-3">
                                        <Store className="w-4 h-4 text-gray-500 mt-1" />
                                        <div>
                                            <p className="text-[10px] text-gray-500 uppercase font-bold">Shop & Owner</p>
                                            <p className="text-sm font-bold">{user?.shopName} ({user?.name})</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <MapPin className="w-4 h-4 text-gray-400 mt-1" />
                                        <div>
                                            <p className="text-[10px] text-gray-400 uppercase font-bold">Delivery Address</p>
                                            <p className="text-sm font-bold leading-tight text-gray-900">
                                                {user?.shopAddress ? `${user.shopAddress}, ` : ''}{user?.area}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <CreditCard className="w-4 h-4 text-gray-500 mt-1" />
                                        <div>
                                            <p className="text-[10px] text-gray-500 uppercase font-bold">Payment Terms</p>
                                            <p className="text-sm font-bold uppercase text-[#16a34a]">{user?.paymentTerm}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-8 bg-gray-50 border-t border-gray-200 space-y-6">
                            <div className="space-y-2">
                                <div className="flex justify-between text-gray-500">
                                    <span>Subtotal</span>
                                    <span className="font-bold text-gray-900">₹{subtotal.toLocaleString('en-IN')}</span>
                                </div>
                                <div className="flex justify-between text-gray-500">
                                    <span>GST (18%)</span>
                                    <span className="font-bold text-gray-900">₹{tax.toLocaleString('en-IN')}</span>
                                </div>
                                <div className="flex justify-between text-xl font-black text-gray-900 pt-2 border-t border-gray-200">
                                    <span className="flex items-center gap-2">Total Amount</span>
                                    <span className="text-[#16a34a]">₹{total.toLocaleString('en-IN')}</span>
                                </div>
                            </div>

                            <button 
                                onClick={handlePlaceOrder}
                                disabled={isOrdering || cart.length === 0}
                                className="w-full bg-[#16a34a] hover:bg-[#15803d] text-white font-black py-5 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-xl shadow-green-500/20 disabled:bg-gray-200 disabled:text-gray-400"
                            >
                                {isOrdering ? <Loader2 className="animate-spin" /> : (
                                    <>
                                        <CheckCircle2 className="w-6 h-6" />
                                        Confirm & Place Order
                                    </>
                                )}
                            </button>
                            <p className="text-center text-[10px] text-gray-400 uppercase font-black tracking-widest">No hidden charges • Automatic billing</p>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default DealerProducts;

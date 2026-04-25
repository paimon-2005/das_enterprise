import React, { useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-hot-toast';
import {
    Filter, Search, ShoppingCart, Plus, Minus, X, Trash2,
    Package, Info, CreditCard, CheckCircle2, Store, MapPin, Loader2
} from 'lucide-react';
import { clsx } from 'clsx';
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

    const categories = useMemo(() => {
        if (!products) return ['All'];
        const unique = [...new Set(products.map(p => p.category))];
        return ['All', ...unique];
    }, [products]);

    const filteredProducts = useMemo(() => {
        if (!products) return [];
        return products.filter(p => {
            const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCat = activeCategory === 'All' || p.category === activeCategory;
            return matchesSearch && matchesCat && p.isActive;
        });
    }, [products, searchTerm, activeCategory]);

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
                unit: product.unit || 'Unit'
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

    const handlePlaceOrder = async () => {
        if (cart.length === 0) return;
        try {
            await createOrder({
                items: cart.map(({ product, quantity }) => ({ product, quantity })),
                notes
            }).unwrap();

            toast.success("Order placed successfully!");
            setCart([]);
            setIsCartOpen(false);
            setNotes('');
        } catch (err) {
            toast.error(err?.data?.message || "Failed to place order");
        }
    };

    if (isLoading) return (
        <div className="min-h-screen flex items-center justify-center bg-surface">
            <div className="text-center">
                <Loader2 className="w-10 h-10 text-primary-600 animate-spin mx-auto mb-3" />
                <p className="text-txt-secondary text-sm font-medium">Loading catalog…</p>
            </div>
        </div>
    );

    return (
        <div className="page-wrapper max-w-7xl mx-auto flex flex-col md:flex-row gap-6 items-start">

            {/* ── Filters Sidebar ─────────────────────────── */}
            <aside className="w-full md:w-64 shrink-0 bg-card border border-gray-100 rounded-xl p-5 shadow-card md:sticky md:top-24">
                <div className="flex items-center gap-2 text-yellow-700 font-semibold uppercase tracking-widest text-xs mb-5 pb-4 border-b border-gray-100">
                    <Filter size={15} />
                    <h2>Market Filters</h2>
                </div>

                <div className="mb-6">
                    <h3 className="text-[10px] font-semibold text-txt-secondary uppercase tracking-widest mb-2">Search</h3>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-txt-secondary w-4 h-4" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search products…"
                            className="input-field pl-9 !py-2 text-sm w-full"
                        />
                    </div>
                </div>

                <div className="mb-6">
                    <h3 className="text-[10px] font-semibold text-txt-secondary uppercase tracking-widest mb-2">Categories</h3>
                    <ul className="space-y-1">
                        {categories.map(cat => (
                            <li key={cat}>
                                <button
                                    onClick={() => setActiveCategory(cat)}
                                    className={clsx(
                                        'w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all',
                                        activeCategory === cat
                                            ? (cat === 'Oils & Fats' ? 'bg-primary-50 text-[#0000ff]' : 'bg-primary-50 text-primary-600')
                                            : (cat === 'Oils & Fats' ? 'text-gray-500 hover:bg-surface hover:text-[#0000ff]' : 'text-txt-secondary hover:bg-surface hover:text-txt-primary')
                                    )}
                                >
                                    {cat}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="pt-5 border-t border-gray-100">
                    <h3 className="text-[10px] font-semibold text-txt-secondary uppercase tracking-widest mb-2">Delivery Region</h3>
                    <div className="p-3 bg-surface rounded-lg border border-gray-100">
                        <p className="text-xs font-semibold text-txt-primary">{user?.area || 'Not Set'}</p>
                    </div>
                </div>
            </aside>

            {/* ── Main Catalog Area ───────────────────────── */}
            <div className="flex-1 w-full space-y-4">
                {/* Toolbar */}
                <div className="bg-card border border-gray-100 rounded-xl p-4 shadow-card flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-sm font-medium text-txt-secondary">
                        Showing <span className="font-bold text-txt-primary">{filteredProducts.length}</span> products
                    </p>
                    {cart.length > 0 && (
                        <button
                            onClick={() => setIsCartOpen(true)}
                            className="btn-accent inline-flex items-center gap-2 text-sm animate-pulse"
                        >
                            <ShoppingCart size={15} /> {cart.length} Items in Cart
                        </button>
                    )}
                </div>

                {/* Product Grid */}
                {filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {filteredProducts.map(product => (
                            <div key={product._id} className="bg-card border border-gray-100 rounded-xl overflow-hidden shadow-card hover:shadow-card2 hover:border-primary-200 transition-all group flex flex-col">
                                <div className="aspect-square bg-surface relative flex items-center justify-center p-4">
                                    {product.images?.[0] ? (
                                        <img src={product.images[0]} alt={product.name} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300" />
                                    ) : (
                                        <Package className="w-12 h-12 text-gray-300" />
                                    )}
                                    <span className={`absolute top-2 left-2 bg-white/90 backdrop-blur-sm text-[10px] font-semibold uppercase py-1 px-2 rounded-md shadow-sm ${product.category === 'Oils & Fats' ? 'text-[#0000ff]' : 'text-txt-primary'}`}>
                                        {product.category}
                                    </span>
                                </div>
                                <div className="p-4 flex-1 flex flex-col">
                                    <h3 className="font-semibold text-sm text-txt-primary leading-tight line-clamp-2 mb-1 group-hover:text-primary-700 transition-colors">
                                        {product.name}
                                    </h3>
                                    <p className="text-txt-secondary text-[10px] font-semibold uppercase tracking-wide mb-3">
                                        {product.unit || 'Unit'}
                                    </p>
                                    <div className="flex items-end justify-between mb-4 mt-auto">
                                        <span className="text-lg font-bold text-primary-600 leading-none">₹{product.price}</span>
                                        <span className={clsx(
                                            'text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded-md leading-none',
                                            product.stock > 10 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'
                                        )}>
                                            {product.stock > 10 ? 'In Stock' : 'Low'}
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => addToCart(product)}
                                        disabled={product.stock <= 0}
                                        className="w-full btn-primary !py-2 text-xs flex items-center justify-center gap-1.5"
                                    >
                                        <Plus className="w-3.5 h-3.5" /> Add
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-card border border-gray-100 rounded-xl p-16 text-center shadow-card">
                        <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-txt-primary mb-2">No products found</h3>
                        <p className="text-sm text-txt-secondary">Try adjusting your category or search filters.</p>
                    </div>
                )}
            </div>

            {/* ── Floating Cart Button ────────────────────── */}
            {cart.length > 0 && (
                <button
                    onClick={() => setIsCartOpen(true)}
                    className="fixed bottom-6 right-6 btn-accent !px-5 !py-4 shadow-xl flex items-center gap-3 z-40 rounded-2xl"
                >
                    <div className="relative">
                        <ShoppingCart className="w-6 h-6" />
                        <span className="absolute -top-2 -right-2 bg-white text-accent-500 text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-sm">
                            {cart.length}
                        </span>
                    </div>
                    <div className="text-left hidden sm:block">
                        <p className="text-[10px] font-semibold uppercase opacity-90 leading-none">Cart Total</p>
                        <p className="font-bold text-base mt-0.5 leading-none">₹{total.toLocaleString('en-IN')}</p>
                    </div>
                </button>
            )}

            {/* ── Cart Drawer ─────────────────────────────── */}
            {isCartOpen && (
                <>
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-opacity" onClick={() => setIsCartOpen(false)} />
                    <div className="fixed top-0 right-0 h-full w-full max-w-md bg-surface shadow-2xl z-50 flex flex-col animate-slide-in-right">
                        {/* Drawer Header */}
                        <div className="p-5 border-b border-gray-200 bg-card flex items-center justify-between">
                            <h2 className="text-lg font-bold flex items-center gap-2 text-txt-primary">
                                <ShoppingCart className="text-primary-600 w-5 h-5" /> Your Order
                            </h2>
                            <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-gray-100 rounded-lg text-txt-secondary transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Cart Items */}
                        <div className="flex-1 overflow-y-auto p-5 space-y-4">
                            {cart.map(item => (
                                <div key={item.product} className="flex gap-4 bg-card p-3 rounded-xl border border-gray-100 shadow-sm">
                                    <div className="w-16 h-16 bg-surface border border-gray-100 rounded-lg flex items-center justify-center shrink-0">
                                        {item.image ? (
                                            <img src={item.image} alt={item.productName} className="w-full h-full object-contain p-1" />
                                        ) : (
                                            <Package className="w-6 h-6 text-gray-300" />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                                        <div>
                                            <h4 className="font-semibold text-sm text-txt-primary truncate">{item.productName}</h4>
                                            <p className="text-primary-600 font-bold text-sm mt-0.5">
                                                ₹{item.price} <span className="text-txt-secondary text-[10px] font-medium">/ {item.unit}</span>
                                            </p>
                                        </div>
                                        <div className="flex items-center justify-between mt-2">
                                            <div className="flex items-center bg-surface border border-gray-200 rounded-lg p-0.5">
                                                <button onClick={() => updateQty(item.product, item.quantity - 1)} className="p-1 hover:bg-gray-200 rounded text-txt-secondary transition-colors"><Minus className="w-3.5 h-3.5" /></button>
                                                <span className="w-8 text-center font-semibold text-sm text-txt-primary">{item.quantity}</span>
                                                <button onClick={() => updateQty(item.product, item.quantity + 1)} className="p-1 hover:bg-gray-200 rounded text-txt-secondary transition-colors"><Plus className="w-3.5 h-3.5" /></button>
                                            </div>
                                            <button onClick={() => removeFromCart(item.product)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            <div className="mt-6">
                                <label className="text-xs font-semibold text-txt-secondary uppercase tracking-wide flex items-center gap-1.5 mb-2">
                                    <Info className="w-3.5 h-3.5" /> Order Notes
                                </label>
                                <textarea
                                    className="input-field w-full text-sm resize-none"
                                    placeholder="Any special delivery instructions?"
                                    rows="2"
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                />
                            </div>

                            {/* Info Box */}
                            <div className="bg-primary-50 border border-primary-100 p-4 rounded-xl space-y-3 mt-4">
                                <h3 className="text-xs font-semibold text-primary-700 uppercase tracking-wide border-b border-primary-100 pb-2">Delivery Details</h3>
                                <div className="space-y-2">
                                    <div className="flex items-start gap-2.5">
                                        <Store className="w-3.5 h-3.5 text-primary-600 mt-0.5" />
                                        <div>
                                            <p className="text-[10px] text-primary-600/80 uppercase font-semibold">Shop</p>
                                            <p className="text-xs font-bold text-primary-900">{user?.shopName}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2.5">
                                        <CreditCard className="w-3.5 h-3.5 text-primary-600 mt-0.5" />
                                        <div>
                                            <p className="text-[10px] text-primary-600/80 uppercase font-semibold">Terms</p>
                                            <p className="text-xs font-bold text-primary-900 uppercase">{user?.paymentTerm}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Drawer Footer */}
                        <div className="p-5 bg-card border-t border-gray-200">
                            <div className="space-y-2 mb-4">
                                <div className="flex justify-between text-sm text-txt-secondary">
                                    <span>Subtotal</span>
                                    <span className="font-semibold text-txt-primary">₹{subtotal.toLocaleString('en-IN')}</span>
                                </div>
                                <div className="flex justify-between text-sm text-txt-secondary">
                                    <span>GST (18%)</span>
                                    <span className="font-semibold text-txt-primary">₹{tax.toLocaleString('en-IN')}</span>
                                </div>
                                <div className="flex justify-between text-base font-bold text-txt-primary pt-2 border-t border-gray-100 mt-2">
                                    <span>Total Amount</span>
                                    <span className="text-primary-600">₹{total.toLocaleString('en-IN')}</span>
                                </div>
                            </div>

                            <button
                                onClick={handlePlaceOrder}
                                disabled={isOrdering || cart.length === 0}
                                className="w-full btn-primary !py-3 text-sm flex items-center justify-center gap-2"
                            >
                                {isOrdering ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                                    <>
                                        <CheckCircle2 className="w-4 h-4" /> Place Order
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default DealerProducts;

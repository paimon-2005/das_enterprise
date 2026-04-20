import React from 'react';
import Navbar from '../components/layout/Navbar';
import { useSelector, useDispatch } from 'react-redux';
import { selectCartItems, selectTotalAmount, removeItem, updateQuantity } from '../features/cart/cartSlice';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, ShieldCheck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Cart = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const cartItems = useSelector(selectCartItems);
    const subtotal = useSelector(selectTotalAmount);

    const gstAmount = subtotal * 0.18;
    const finalTotal = subtotal + gstAmount;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            <Navbar />
            
            <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
                
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 font-jakarta">Your Shopping Cart</h1>
                        <p className="text-gray-500 mt-1">Review your wholesale items before checkout.</p>
                    </div>
                </div>

                {cartItems.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center shadow-sm">
                        <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 text-[#16a34a]">
                            <ShoppingBag className="w-12 h-12" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-3 font-jakarta">Your cart is empty</h2>
                        <p className="text-gray-500 max-w-md mx-auto mb-8 text-lg">Looks like you haven't added any premium ingredients to your cart yet.</p>
                        <Link 
                            to="/products"
                            className="inline-flex items-center gap-2 bg-[#16a34a] hover:bg-[#15803d] text-white font-bold py-4 px-8 rounded-xl transition-all hover:scale-105 shadow-md shadow-green-500/20"
                        >
                            Start Shopping <ArrowRight size={18} />
                        </Link>
                    </div>
                ) : (
                    <div className="flex flex-col lg:flex-row gap-8">
                        
                        {/* Cart Items List */}
                        <div className="flex-1">
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                                
                                {/* Header */}
                                <div className="grid grid-cols-12 gap-4 p-6 border-b border-gray-100 text-sm font-bold text-gray-400 tracking-wider uppercase bg-gray-50/50">
                                    <div className="col-span-6">Product Details</div>
                                    <div className="col-span-3 text-center">Quantity</div>
                                    <div className="col-span-3 text-right">Total</div>
                                </div>

                                {/* Items */}
                                <div className="divide-y divide-gray-100">
                                    {cartItems.map((item) => (
                                        <div key={item.id} className="grid grid-cols-12 gap-4 p-6 items-center flex-wrap group transition-colors hover:bg-gray-50/50">
                                            
                                            {/* Product Column */}
                                            <div className="col-span-12 sm:col-span-6 flex items-center gap-4">
                                                <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200">
                                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-gray-900 leading-snug">{item.name}</h3>
                                                    <p className="text-[#16a34a] font-bold mt-1 text-sm">₹{item.price.toLocaleString('en-IN')}</p>
                                                    <button 
                                                        onClick={() => dispatch(removeItem(item.id))}
                                                        className="text-gray-400 hover:text-red-500 text-sm font-medium mt-2 flex items-center gap-1 transition-colors"
                                                    >
                                                        <Trash2 size={14} /> Remove
                                                    </button>
                                                </div>
                                            </div>
                                            
                                            {/* Quantity Column */}
                                            <div className="col-span-6 sm:col-span-3 flex justify-center mt-4 sm:mt-0">
                                                <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg p-1 shadow-inner h-10 w-28">
                                                    <button 
                                                        onClick={() => dispatch(updateQuantity({ id: item.id, quantity: Math.max(1, item.quantity - 1) }))}
                                                        className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-white rounded shadow-sm border border-transparent hover:border-gray-200 transition-all active:scale-95"
                                                    >
                                                        <Minus size={14} />
                                                    </button>
                                                    <span className="flex-1 text-center font-bold text-gray-900 text-sm w-8">
                                                        {item.quantity}
                                                    </span>
                                                    <button 
                                                        onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))}
                                                        className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-white rounded shadow-sm border border-transparent hover:border-gray-200 transition-all active:scale-95"
                                                    >
                                                        <Plus size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                            
                                            {/* Price Column */}
                                            <div className="col-span-6 sm:col-span-3 text-right mt-4 sm:mt-0">
                                                <span className="font-bold text-gray-900 text-lg">₹{item.totalPrice.toLocaleString('en-IN')}</span>
                                            </div>

                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Order Summary Panel */}
                        <div className="w-full lg:w-80 flex-shrink-0">
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-24">
                                <h2 className="text-xl font-bold text-gray-900 font-jakarta mb-6 pb-4 border-b border-gray-100">Order Summary</h2>
                                
                                <div className="space-y-4 mb-6 text-gray-600 font-medium">
                                    <div className="flex justify-between">
                                        <span>Subtotal ({cartItems.length} items)</span>
                                        <span className="font-bold text-gray-900">₹{subtotal.toLocaleString('en-IN')}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Tax (18% GST)</span>
                                        <span className="font-bold text-gray-900">₹{gstAmount.toLocaleString('en-IN')}</span>
                                    </div>
                                    <div className="flex justify-between text-[#16a34a]">
                                        <span>Shipping</span>
                                        <span className="font-bold">Free</span>
                                    </div>
                                </div>
                                
                                <div className="border-t border-gray-100 pt-4 mb-6">
                                    <div className="flex justify-between items-end">
                                        <span className="text-lg font-bold text-gray-900">Total</span>
                                        <span className="text-2xl font-black text-[#16a34a]">₹{finalTotal.toLocaleString('en-IN')}</span>
                                    </div>
                                </div>
                                
                                <button 
                                    onClick={() => navigate('/shop/checkout')}
                                    className="w-full py-4 bg-[#16a34a] hover:bg-[#15803d] text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-md shadow-green-500/20 active:scale-95 group"
                                >
                                    Proceed to Checkout <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </button>

                                
                                <div className="mt-4 flex items-center justify-center gap-2 text-xs font-semibold text-gray-400">
                                    <ShieldCheck size={14} /> 100% Secure Checkout Guaranteed
                                </div>
                            </div>
                        </div>

                    </div>
                )}
            </main>
        </div>
    );
};

export default Cart;

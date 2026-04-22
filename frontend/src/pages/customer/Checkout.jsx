import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { selectCartItems, selectTotalAmount, clearCart } from '../../features/cart/cartSlice';
import { useCreateOrderMutation } from '../../features/orders/ordersApi';
import { useGetMeQuery } from '../../features/auth/authApi';
import { 
    ShoppingBag, MapPin, CreditCard, Phone, User, 
    ArrowLeft, CheckCircle, Loader2, IndianRupee, Truck, ShieldCheck
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const Checkout = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const cartItems = useSelector(selectCartItems);
    const subtotal = useSelector(selectTotalAmount);
    const { data: userData } = useGetMeQuery();
    const [createOrder, { isLoading: isCreating }] = useCreateOrderMutation();

    const user = userData?.user;
    const isDealer = user?.role === 'dealer';

    const [paymentMethod, setPaymentMethod] = useState(isDealer ? 'credit' : 'cash');
    const [shippingAddress, setShippingAddress] = useState({
        street: isDealer ? 'Business Address' : '',
        city: 'Mumbai',
        state: 'Maharashtra',
        zipCode: '400001',
        country: 'India'
    });

    const gstAmount = subtotal * 0.18;
    const shippingPrice = 0;
    const totalPrice = subtotal + gstAmount + shippingPrice;

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        
        if (cartItems.length === 0) {
            return toast.error('Your cart is empty');
        }

        try {
            const orderData = {
                orderItems: cartItems.map(item => ({
                    name: item.name,
                    qty: item.quantity,
                    image: item.image,
                    price: item.price,
                    unit: 'kg', // default
                    product: item.id
                })),
                shippingAddress,
                paymentMethod,
                itemsPrice: subtotal,
                taxPrice: gstAmount,
                shippingPrice,
                totalPrice,
                notes: isDealer ? `Wholesale order for ${user.shopName}` : ''
            };

            const res = await createOrder(orderData).unwrap();
            toast.success('Order placed successfully!');
            dispatch(clearCart());
            navigate(`/dealer/order-success/${res.order._id}`);
        } catch (err) {
            toast.error(err?.data?.message || 'Failed to place order');
        }
    };

    if (!user) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary-600" /></div>;

    return (
        <div className="min-h-screen bg-[#f8fafc] font-jakarta pb-20">
            {/* Header */}
            <header className="bg-white border-b border-gray-100 sticky top-0 z-30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                            <ArrowLeft size={20} className="text-gray-500" />
                        </button>
                        <h1 className="text-xl font-black text-gray-900 tracking-tight">Checkout</h1>
                    </div>
                    <Link to="/products" className="text-primary-600 font-bold text-sm">Continue Shopping</Link>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* Left Column - Details */}
                    <div className="lg:col-span-8 space-y-6">
                        {/* Shop/Profile Snapshot */}
                        <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 overflow-hidden relative group">
                            <div className="absolute top-0 right-0 p-8 text-gray-50 opacity-10 group-hover:scale-110 transition-transform duration-500">
                                <User size={120} />
                            </div>
                            <div className="flex items-center gap-4 mb-8">
                                <div className="bg-primary-50 text-primary-600 p-3 rounded-2xl">
                                    <ShoppingBag size={24} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">Ordering Account</h2>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{isDealer ? 'Wholesale Dealer Account' : 'Retail Customer Account'}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 ring-1 ring-gray-50 p-6 rounded-3xl bg-gray-50/50">
                                <div className="space-y-4">
                                    <div className="flex gap-3">
                                        <div className="text-gray-400 mt-1"><User size={18} /></div>
                                        <div>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Full Name</p>
                                            <p className="text-sm font-black text-gray-900">{user.name}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        <div className="text-gray-400 mt-1"><Phone size={18} /></div>
                                        <div>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Contact Number</p>
                                            <p className="text-sm font-black text-gray-900">{user.phone || '9876543210'}</p>
                                        </div>
                                    </div>
                                </div>
                                {isDealer && (
                                    <div className="space-y-4 border-l border-gray-100 pl-8">
                                        <div className="flex gap-3">
                                            <div className="text-primary-600 mt-1"><CheckCircle size={18} /></div>
                                            <div>
                                                <p className="text-[10px] font-bold text-primary-600 uppercase tracking-widest">Shop Reference</p>
                                                <p className="text-sm font-black text-gray-900 uppercase">{user.shopName}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-3">
                                            <div className="text-gray-400 mt-1"><MapPin size={18} /></div>
                                            <div>
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Delivery Area</p>
                                                <p className="text-sm font-bold text-gray-600 uppercase">Snapshot from Profile</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Shipping Address */}
                        <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100">
                             <div className="flex items-center gap-4 mb-8">
                                <div className="bg-blue-50 text-blue-600 p-3 rounded-2xl">
                                    <MapPin size={24} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">Delivery Address</h2>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Where should we deliver?</p>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block ml-1">Street / Landmark</label>
                                    <input 
                                        type="text" 
                                        className="w-full bg-gray-50 border-none rounded-2xl p-4 text-gray-900 focus:ring-2 focus:ring-primary-600 transition-all font-bold"
                                        placeholder="Enter complete address"
                                        value={shippingAddress.street}
                                        onChange={(e) => setShippingAddress({...shippingAddress, street: e.target.value})}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block ml-1">City</label>
                                        <input 
                                            type="text" 
                                            className="w-full bg-gray-50 border-none rounded-2xl p-4 text-gray-900 focus:ring-2 focus:ring-primary-600 transition-all font-bold"
                                            value={shippingAddress.city}
                                            onChange={(e) => setShippingAddress({...shippingAddress, city: e.target.value})}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block ml-1">Zip Code</label>
                                        <input 
                                            type="text" 
                                            className="w-full bg-gray-50 border-none rounded-2xl p-4 text-gray-900 focus:ring-2 focus:ring-primary-600 transition-all font-bold"
                                            value={shippingAddress.zipCode}
                                            onChange={(e) => setShippingAddress({...shippingAddress, zipCode: e.target.value})}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Payment Method */}
                        <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100">
                             <div className="flex items-center gap-4 mb-8">
                                <div className="bg-purple-50 text-purple-600 p-3 rounded-2xl">
                                    <CreditCard size={24} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">Payment Selection</h2>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Secure transaction methods</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {isDealer && (
                                    <button 
                                        type="button"
                                        onClick={() => setPaymentMethod('credit')}
                                        className={`p-6 rounded-[2rem] border-2 text-left transition-all ${paymentMethod === 'credit' ? 'border-primary-600 bg-primary-50' : 'border-gray-50 hover:bg-gray-50'}`}
                                    >
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="p-3 bg-white rounded-2xl text-primary-600 shadow-sm"><IndianRupee size={20} /></div>
                                            {paymentMethod === 'credit' && <CheckCircle size={18} className="text-primary-600" />}
                                        </div>
                                        <h3 className="font-black text-gray-900 uppercase text-xs tracking-widest">Business Credit</h3>
                                        <p className="text-[10px] text-gray-500 mt-1 font-bold">Add to my monthly due statement</p>
                                    </button>
                                )}
                                <button 
                                    type="button"
                                    onClick={() => setPaymentMethod('cash')}
                                    className={`p-6 rounded-[2rem] border-2 text-left transition-all ${paymentMethod === 'cash' ? 'border-primary-600 bg-primary-50' : 'border-gray-50 hover:bg-gray-50'}`}
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="p-3 bg-white rounded-2xl text-primary-600 shadow-sm"><Truck size={20} /></div>
                                        {paymentMethod === 'cash' && <CheckCircle size={18} className="text-primary-600" />}
                                    </div>
                                    <h3 className="font-black text-gray-900 uppercase text-xs tracking-widest">Cash on Delivery</h3>
                                    <p className="text-[10px] text-gray-500 mt-1 font-bold">Pay upon receiving the goods</p>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Summary */}
                    <div className="lg:col-span-4 sticky top-24">
                        <div className="bg-gray-900 text-white rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
                            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-primary-600/20 blur-[60px] rounded-full" />
                            
                            <h2 className="text-xl font-bold mb-8 relative">Order Summary</h2>
                            
                            <div className="space-y-4 mb-8 relative">
                                {cartItems.map((item) => (
                                    <div key={item.id} className="flex justify-between text-sm">
                                        <span className="text-gray-400 font-medium">{item.quantity}x {item.name}</span>
                                        <span className="font-bold">₹{item.totalPrice.toLocaleString('en-IN')}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-4 pt-8 border-t border-white/10 mb-8 relative">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Subtotal</span>
                                    <span className="font-bold">₹{subtotal.toLocaleString('en-IN')}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">GST (18%)</span>
                                    <span className="font-bold">₹{gstAmount.toLocaleString('en-IN')}</span>
                                </div>
                                <div className="flex justify-between items-end pt-4">
                                    <span className="text-lg font-black tracking-tight text-primary-400">Total Payable</span>
                                    <span className="text-3xl font-black">₹{totalPrice.toLocaleString('en-IN')}</span>
                                </div>
                            </div>

                            <button 
                                onClick={handlePlaceOrder}
                                disabled={isCreating}
                                className="w-full bg-primary-600 hover:bg-primary-700 text-white py-5 rounded-3xl font-black transition-all shadow-xl shadow-primary-900/40 active:scale-95 flex items-center justify-center gap-2"
                            >
                                {isCreating ? <Loader2 className="animate-spin" /> : 'Confirm & Place Order'}
                            </button>

                            <div className="mt-8 pt-8 border-t border-white/5 flex items-center justify-center gap-3 text-gray-500">
                                <ShieldCheck size={18} />
                                <span className="text-[10px] font-black uppercase tracking-widest">Premium Business Guarantee</span>
                            </div>
                        </div>

                        {/* Notice Card */}
                        {isDealer && paymentMethod === 'credit' && (
                            <div className="mt-6 bg-amber-50 border border-amber-100 p-6 rounded-[2rem] flex gap-4">
                                <div className="text-amber-500 mt-1"><CheckCircle size={18} /></div>
                                <p className="text-[11px] font-bold text-amber-700 leading-relaxed uppercase tracking-tight">
                                    Note: This order will be recorded against your business credit limit. Settlement is required as per your weekly terms.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Checkout;

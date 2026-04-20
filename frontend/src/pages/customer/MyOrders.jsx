import React from 'react';
import { useGetMyOrdersQuery } from '../../features/orders/ordersApi';
import { 
    ShoppingBag, Calendar, IndianRupee, Clock, ChevronRight, 
    CheckCircle, Truck, Package, SearchX, Loader2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';

const MyOrders = () => {
    const navigate = useNavigate();
    const { data: result, isLoading } = useGetMyOrdersQuery();
    const orders = result?.data || [];

    const getStatusStyle = (status) => {
        switch (status?.toLowerCase()) {
            case 'pending': return 'bg-amber-100 text-amber-700';
            case 'delivered': return 'bg-green-100 text-green-700';
            case 'cancelled': return 'bg-red-100 text-red-700';
            default: return 'bg-blue-100 text-blue-700';
        }
    };

    if (isLoading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary-600" /></div>;

    return (
        <div className="max-w-5xl mx-auto px-4 py-10 font-jakarta">
            <div className="mb-10">
                <h1 className="text-3xl font-black text-gray-900 tracking-tight">Purchase History</h1>
                <p className="text-gray-500 mt-1 font-medium">Track and manage your wholesale distribution orders.</p>
            </div>

            {orders.length === 0 ? (
                <div className="bg-white rounded-[2.5rem] border border-gray-100 p-20 text-center shadow-sm">
                    <SearchX className="w-16 h-16 text-gray-200 mx-auto mb-6" />
                    <h2 className="text-xl font-bold text-gray-900 mb-2">No orders found</h2>
                    <p className="text-gray-400 mb-8 max-w-xs mx-auto text-sm">You haven't placed any orders yet. Start stocking up your shop today!</p>
                    <button 
                        onClick={() => navigate('/products')}
                        className="bg-primary-600 text-white px-8 py-3 rounded-2xl font-black transition-all hover:scale-105 active:scale-95 shadow-lg shadow-primary-900/20"
                    >
                        Browse Inventory
                    </button>
                </div>
            ) : (
                <div className="space-y-6">
                    {orders.map((order, i) => (
                        <motion.div 
                            key={order._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-white rounded-[2rem] border border-gray-100 p-6 hover:shadow-xl transition-all group overflow-hidden relative cursor-default"
                        >
                            <div className="flex flex-wrap items-center justify-between gap-6 relative z-10">
                                <div className="flex items-center gap-6">
                                    <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-primary-600 shadow-inner group-hover:scale-110 transition-transform">
                                        <ShoppingBag size={24} />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            <span className="font-black text-gray-900 uppercase">#{order._id.slice(-6)}</span>
                                            <span className={clsx("px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest", getStatusStyle(order.orderStatus))}>
                                                {order.orderStatus}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                            <div className="flex items-center gap-1"><Calendar size={12} /> {new Date(order.createdAt).toLocaleDateString('en-GB')}</div>
                                            <div className="flex items-center gap-1"><Package size={12} /> {order.orderItems.length} Items</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-8">
                                    <div className="text-right">
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Order Amount</p>
                                        <p className="text-2xl font-black text-gray-900">₹{order.totalPrice.toLocaleString('en-IN')}</p>
                                    </div>
                                    <button className="bg-gray-50 p-3 rounded-2xl text-gray-400 group-hover:bg-primary-600 group-hover:text-white group-hover:shadow-lg transition-all">
                                        <ChevronRight size={20} />
                                    </button>
                                </div>
                            </div>

                            {/* Mini Items Preview */}
                            <div className="mt-6 pt-6 border-t border-gray-50 flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                                {order.orderItems.map((item, idx) => (
                                    <div key={idx} className="flex-shrink-0 w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 overflow-hidden" title={item.name}>
                                        <img src={item.image} className="w-full h-full object-cover" alt="" />
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyOrders;

import React, { useState } from 'react';
import { 
    Search, 
    Calendar, 
    Filter, 
    ExternalLink, 
    Printer, 
    CheckCircle, 
    Truck, 
    ShoppingBag, 
    Clock, 
    XCircle,
    ChevronRight,
    SearchX,
    Loader2,
    Phone,
    Smartphone
} from 'lucide-react';


import { useGetAdminOrdersQuery, useUpdateOrderStatusMutation, useGetAdminStatsQuery } from '../../features/admin/adminApi';

import { clsx } from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

const Orders = () => {
    const { data: ordersData, isLoading: ordersLoading } = useGetAdminOrdersQuery();
    const { data: statsData } = useGetAdminStatsQuery();
    const [updateStatus] = useUpdateOrderStatusMutation();
    const [selectedOrder, setSelectedOrder] = useState(null);

    const orders = ordersData?.data || [];
    const stats = statsData?.data || {};

    const getStatusConfig = (status) => {
        switch (status?.toLowerCase()) {
            case 'pending': return { label: 'Pending', color: 'bg-amber-100 text-amber-700', icon: <Clock size={12} /> };
            case 'confirmed': return { label: 'Confirmed', color: 'bg-blue-100 text-blue-700', icon: <CheckCircle size={12} /> };
            case 'processing': return { label: 'Processing', color: 'bg-purple-100 text-purple-700', icon: <ShoppingBag size={12} /> };
            case 'shipped': return { label: 'Shipped', color: 'bg-cyan-100 text-cyan-700', icon: <Truck size={12} /> };
            case 'delivered': return { label: 'Delivered', color: 'bg-green-100 text-green-700', icon: <CheckCircle size={12} /> };
            case 'cancelled': return { label: 'Cancelled', color: 'bg-red-100 text-red-700', icon: <XCircle size={12} /> };
            default: return { label: status || 'Unknown', color: 'bg-gray-100 text-gray-700', icon: null };
        }
    };

    if (ordersLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                <Loader2 className="animate-spin text-primary-600" size={40} />
                <p className="text-gray-500 font-bold animate-pulse">Fetching Orders...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Order Management</h2>
                    <p className="text-sm text-gray-500 mt-1">Manage, filter and update distributor orders</p>
                </div>
                <div className="flex gap-2">
                    <button className="bg-white border border-gray-200 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-gray-50 transition-all">
                        <Calendar size={18} /> {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}
                    </button>
                    <button className="bg-white border border-gray-200 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-gray-50 transition-all">
                        <Filter size={18} /> Filters
                    </button>
                </div>
            </div>

            {/* Order Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {[
                    { label: 'Total Orders', value: stats.totalOrders || orders.length, color: 'text-gray-900' },
                    { label: 'Pending', value: orders.filter(o => o.orderStatus === 'pending').length, color: 'text-amber-600' },
                    { label: 'Processing', value: orders.filter(o => o.orderStatus === 'processing').length, color: 'text-purple-600' },
                    { label: 'Shipped', value: orders.filter(o => o.orderStatus === 'shipped').length, color: 'text-cyan-600' },
                    { label: 'Revenue Today', value: `₹${(stats.totalRevenue || 0).toLocaleString('en-IN')}`, color: 'text-primary-600' },
                ].map((stat) => (
                    <div key={stat.label} className="card !p-4">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{stat.label}</p>
                        <p className={clsx("text-xl font-black mt-1", stat.color)}>{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* Filter Bar */}
            <div className="card !p-4 flex items-center gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search by Order ID or Customer..." 
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-lg outline-none focus:ring-2 focus:ring-primary-100 transition-all font-medium text-sm"
                    />
                </div>
                <select className="bg-gray-50 border border-gray-100 rounded-lg px-4 py-2 text-sm font-medium outline-none">
                    <option>All Statuses</option>
                    <option>Pending</option>
                    <option>Processing</option>
                    <option>Delivered</option>
                </select>
            </div>

            {/* Orders Content */}
            <div className="card !p-0">
                {/* Desktop Table View */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                                <th className="px-6 py-4">Order Details</th>
                                <th className="px-6 py-4">Customer</th>
                                <th className="px-6 py-4">Items / Total</th>
                                <th className="px-6 py-4">Payment</th>
                                <th className="px-6 py-4">Order Status</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {orders.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="px-6 py-20 text-center text-gray-400 font-bold">No orders found in database.</td>
                                </tr>
                            ) : orders.map((order) => {
                                const status = getStatusConfig(order.orderStatus);
                                return (
                                    <tr 
                                        key={order._id} 
                                        onClick={() => setSelectedOrder(order)}
                                        className="hover:bg-gray-50 cursor-pointer transition-colors"
                                    >
                                        <td className="px-6 py-4">
                                            <p className="font-bold text-primary-600 text-sm">#{order._id.slice(-6).toUpperCase()}</p>
                                            <p className="text-[10px] text-gray-400 mt-1 uppercase font-bold tracking-tighter">via {order.paymentMethod || 'Stripe'}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className={clsx(
                                                    "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold uppercase",
                                                    order.userModel === 'Dealer' ? "bg-primary-100 text-primary-600" : "bg-gray-200 text-gray-500"
                                                )}>
                                                    {(order.shopName || order.user?.name || 'G').charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-gray-900">{order.shopName || order.user?.name || 'Guest User'}</p>
                                                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">
                                                        {order.areaName || order.user?.email || 'Direct Account'}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-6 py-4">
                                            <p className="text-sm font-semibold text-gray-900">₹{order.totalPrice?.toLocaleString('en-IN')}</p>
                                            <p className="text-xs text-gray-500">{order.orderItems?.length || 0} items</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={clsx(
                                                "px-2 py-0.5 rounded text-[10px] font-bold uppercase",
                                                order.isPaid ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                                            )}>
                                                {order.isPaid ? 'Paid' : 'Unpaid'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div 
                                                className={clsx("px-3 py-1 rounded-full text-[10px] font-bold uppercase flex items-center gap-1 w-fit", status.color)}
                                            >
                                                {status.icon} {status.label}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-xs font-bold text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 text-right">
                                            <ChevronRight className="text-gray-300" size={18} />
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Card View */}
                <div className="md:hidden divide-y divide-gray-100">
                    {orders.length === 0 ? (
                        <div className="py-20 text-center text-gray-400 font-bold">No orders found.</div>
                    ) : orders.map((order) => {
                        const status = getStatusConfig(order.orderStatus);
                        return (
                            <div 
                                key={order._id} 
                                onClick={() => setSelectedOrder(order)}
                                className="p-4 active:bg-gray-50 transition-colors space-y-4"
                            >
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-xs font-bold text-primary-600">#{order._id.slice(-6).toUpperCase()}</p>
                                        <p className="text-lg font-black text-gray-900 mt-1">₹{order.totalPrice?.toLocaleString('en-IN')}</p>
                                    </div>
                                    <div 
                                        className={clsx("px-3 py-1 rounded-full text-[10px] font-bold uppercase flex items-center gap-1", status.color)}
                                    >
                                        {status.icon} {status.label}
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-400 uppercase">
                                        {order.user?.name?.charAt(0) || 'G'}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-800">{order.user?.name || 'Guest'}</p>
                                        <p className="text-[10px] text-gray-400">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>


            {/* Slide-over Placeholder */}
            {selectedOrder && (
                <div className="fixed inset-0 z-[100] flex justify-end">
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedOrder(null)}
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                    />
                    <motion.div 
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        className="relative w-full max-w-lg bg-white h-full shadow-2xl flex flex-col"
                    >
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                            <h3 className="text-xl font-black text-gray-900">Order #{selectedOrder._id.slice(-6).toUpperCase()}</h3>
                            <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-gray-50 rounded-full">
                                <XCircle className="text-gray-400" />
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-6 space-y-8">
                            {/* Order Info */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-gray-50 rounded-xl">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Status</p>
                                    <span className={clsx("px-2 py-0.5 rounded text-xs font-bold uppercase", getStatusConfig(selectedOrder.orderStatus).color)}>
                                        {selectedOrder.orderStatus}
                                    </span>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-xl">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Placed On</p>
                                    <p className="text-sm font-bold">{new Date(selectedOrder.createdAt).toLocaleString()}</p>
                                </div>
                            </div>

                            {/* Items List */}
                            <div>
                                <h4 className="font-black text-gray-900 mb-4 uppercase text-xs tracking-widest">Items List</h4>
                                <div className="space-y-4">
                                    {selectedOrder.orderItems?.map((item, idx) => (
                                        <div key={idx} className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                                                {item.image ? <img src={item.image} className="w-full h-full object-cover" alt="" /> : <ShoppingBag className="text-gray-400" size={20} />}
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm font-bold text-gray-900">{item.name}</p>
                                                <p className="text-xs text-gray-500">{item.qty} x ₹{item.price}</p>
                                            </div>
                                            <p className="text-sm font-bold">₹{item.qty * item.price}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Address & Contact */}
                            <div className={clsx(
                                "p-6 rounded-3xl shadow-xl transition-all",
                                selectedOrder.userModel === 'Dealer' ? "bg-gray-900 shadow-gray-200" : "bg-primary-600 shadow-primary-100"
                            )}>
                                <h4 className={clsx(
                                    "font-bold uppercase text-[10px] mb-4 tracking-widest flex items-center gap-2",
                                    selectedOrder.userModel === 'Dealer' ? "text-gray-400" : "text-primary-200"
                                )}>
                                    <Smartphone size={14} /> {selectedOrder.userModel === 'Dealer' ? 'Verified Shop Profile' : 'Delivery & Contact'}
                                </h4>
                                <div className="space-y-4 text-white">
                                    {selectedOrder.userModel === 'Dealer' ? (
                                        <div>
                                            <p className="font-black text-xl leading-tight">{selectedOrder.shopName}</p>
                                            <p className="text-xs font-bold text-primary-400 uppercase tracking-widest mt-1">Owner: {selectedOrder.ownerName}</p>
                                            
                                            <div className="mt-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                                                <p className="text-[10px] text-gray-500 font-bold uppercase mb-2">Delivery Address</p>
                                                <p className="text-sm opacity-90 leading-relaxed italic">
                                                    "{selectedOrder.shippingAddress?.street}, {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.zipCode}"
                                                </p>
                                                <div className="mt-3 flex items-center gap-2">
                                                    <MapPin size={12} className="text-primary-500" />
                                                    <span className="text-xs font-black uppercase tracking-widest text-primary-500">{selectedOrder.areaName}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div>
                                            <p className="font-black text-lg">{selectedOrder.user?.name}</p>
                                            <p className="text-sm opacity-90 mt-1 leading-relaxed">
                                                {selectedOrder.shippingAddress?.street}, {selectedOrder.shippingAddress?.city}<br />
                                                {selectedOrder.shippingAddress?.zipCode}, {selectedOrder.shippingAddress?.country}
                                            </p>
                                        </div>
                                    )}
                                    
                                    <div className={clsx(
                                        "pt-4 flex flex-wrap gap-4 border-t",
                                        selectedOrder.userModel === 'Dealer' ? "border-white/10" : "border-primary-500/50"
                                    )}>
                                        <div className="flex items-center gap-2">
                                            <Phone size={14} className={selectedOrder.userModel === 'Dealer' ? "text-primary-400" : "text-primary-200"} />
                                            <span className="text-sm font-bold">{selectedOrder.user?.phone || 'No phone provided'}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <CheckCircle size={14} className={selectedOrder.userModel === 'Dealer' ? "text-primary-400" : "text-primary-200"} />
                                            <span className="text-sm font-bold capitalize">{selectedOrder.paymentMethod}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>


                        </div>
                        <div className="p-6 border-t border-gray-100 flex gap-4 bg-gray-50">
                            <select 
                                className="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-2 font-bold text-sm outline-none"
                                value={selectedOrder.orderStatus}
                                onChange={(e) => updateStatus({ id: selectedOrder._id, status: e.target.value })}
                            >
                                <option value="pending">Pending</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="processing">Processing</option>
                                <option value="shipped">Shipped</option>
                                <option value="delivered">Delivered</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                            <button className="p-3 border border-gray-200 rounded-xl bg-white hover:bg-gray-100 transition-all">
                                <Printer size={20} className="text-gray-500" />
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};


export default Orders;

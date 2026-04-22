import React, { useState } from 'react';
import { useGetMyOrdersQuery } from '../../features/orders/ordersApi';
import { 
    Package, 
    Calendar, 
    ChevronRight, 
    Search,
    Clock,
    CheckCircle2,
    Truck,
    XCircle,
    Loader2,
    ShoppingBag
} from 'lucide-react';

const DealerOrders = () => {
    const { data: orderData, isLoading } = useGetMyOrdersQuery();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');

    const orders = orderData?.orders || [];

    const filteredOrders = orders.filter(order => {
        const matchesSearch = order._id.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'All' || order.orderStatus === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const getStatusStyle = (status) => {
        switch (status) {
            case 'pending': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
            case 'confirmed': return 'bg-blue-50 text-blue-700 border-blue-200';
            case 'processing': return 'bg-indigo-50 text-indigo-700 border-indigo-200';
            case 'dispatched': return 'bg-orange-50 text-orange-700 border-orange-200';
            case 'delivered': return 'bg-green-50 text-green-700 border-green-200';
            case 'cancelled': return 'bg-red-50 text-red-700 border-red-200';
            default: return 'bg-gray-50 text-gray-700 border-gray-200';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'pending': return <Clock className="w-4 h-4" />;
            case 'confirmed': case 'processing': return <Package className="w-4 h-4" />;
            case 'dispatched': return <Truck className="w-4 h-4" />;
            case 'delivered': return <CheckCircle2 className="w-4 h-4" />;
            case 'cancelled': return <XCircle className="w-4 h-4" />;
            default: return null;
        }
    };

    if (isLoading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
                <Loader2 className="w-12 h-12 text-[#16a34a] animate-spin mx-auto mb-4" />
                <p className="text-gray-500 font-medium">Loading your orders...</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 p-4 lg:p-8 space-y-6">
            <div className="max-w-6xl mx-auto space-y-6">
                
                {/* Page Header */}
                <div className="bg-white border-2 border-gray-100 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Your Orders</h1>
                        <p className="text-gray-400 font-medium mt-1">{orders.length} total orders placed</p>
                    </div>
                    
                    {/* Filters */}
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative">
                            <Search className="absolute left-3.5 top-3 w-5 h-5 text-gray-400" />
                            <input 
                                type="text"
                                placeholder="Search by Order ID..."
                                className="bg-gray-50 border-2 border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-[#16a34a] w-full sm:w-56 font-medium"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <select 
                            className="bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-[#16a34a] font-bold cursor-pointer"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="All">All Status</option>
                            {['pending', 'confirmed', 'processing', 'dispatched', 'delivered', 'cancelled'].map(s => (
                                <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Status Quick Filters */}
                <div className="flex gap-2 overflow-x-auto pb-1">
                    {['All', 'pending', 'confirmed', 'dispatched', 'delivered'].map(s => (
                        <button
                            key={s}
                            onClick={() => setStatusFilter(s)}
                            className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap border-2 transition-all ${
                                statusFilter === s 
                                    ? 'bg-[#16a34a] text-white border-[#16a34a] shadow-md shadow-green-200' 
                                    : 'bg-white text-gray-500 border-gray-200 hover:border-[#16a34a] hover:text-[#16a34a]'
                            }`}
                        >
                            {s === 'All' ? 'All Orders' : s.charAt(0).toUpperCase() + s.slice(1)}
                        </button>
                    ))}
                </div>

                {/* Orders List */}
                <div className="space-y-4">
                    {filteredOrders.map(order => (
                        <div key={order._id} className="bg-white border-2 border-gray-100 rounded-2xl overflow-hidden hover:border-[#16a34a]/40 hover:shadow-md transition-all">
                            
                            {/* Order Header */}
                            <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center border border-green-100 shrink-0">
                                        <Package className="w-6 h-6 text-[#16a34a]" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-gray-400 font-black tracking-widest uppercase">Order ID</p>
                                        <h3 className="text-sm font-black text-gray-900 font-mono">{order._id.slice(-10).toUpperCase()}</h3>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black uppercase border-2 ${getStatusStyle(order.orderStatus)}`}>
                                        {getStatusIcon(order.orderStatus)}
                                        {order.orderStatus}
                                    </span>
                                    <p className="text-2xl font-black text-[#16a34a]">₹{order.totalPrice.toLocaleString('en-IN')}</p>
                                </div>
                            </div>

                            {/* Order Details Grid */}
                            <div className="p-5 grid grid-cols-2 sm:grid-cols-4 gap-4">
                                <div className="bg-gray-50 p-3 rounded-xl">
                                    <p className="text-[10px] text-gray-400 font-black tracking-widest uppercase mb-1">Placed On</p>
                                    <div className="flex items-center gap-1.5 text-sm text-gray-800 font-bold">
                                        <Calendar className="w-3.5 h-3.5 text-[#16a34a]" />
                                        {new Date(order.createdAt).toLocaleDateString('en-IN')}
                                    </div>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-xl">
                                    <p className="text-[10px] text-gray-400 font-black tracking-widest uppercase mb-1">Items</p>
                                    <p className="text-sm text-gray-800 font-bold">{order.items.length} Products</p>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-xl">
                                    <p className="text-[10px] text-gray-400 font-black tracking-widest uppercase mb-1">Payment</p>
                                    <p className="text-sm text-gray-800 font-black uppercase">{order.paymentTerm}</p>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-xl">
                                    <p className="text-[10px] text-gray-400 font-black tracking-widest uppercase mb-1">Paid?</p>
                                    {order.isPaid ? (
                                        <span className="text-green-600 flex items-center gap-1 text-sm font-bold">
                                            <CheckCircle2 className="w-4 h-4" /> Paid
                                        </span>
                                    ) : (
                                        <span className="text-red-500 flex items-center gap-1 text-sm font-bold">
                                            <Clock className="w-4 h-4" /> {order.paymentStatus}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Items Summary Footer */}
                            <div className="bg-gray-50 px-5 py-3 border-t border-gray-100 flex items-center justify-between">
                                <p className="text-xs text-gray-500 font-medium leading-relaxed">
                                    <span className="font-bold text-gray-700">Items: </span>
                                    {order.items.map(i => `${i.productName} (x${i.quantity})`).join(', ')}
                                </p>
                                <button className="text-[#16a34a] text-xs font-black flex items-center gap-1 ml-4 whitespace-nowrap hover:underline">
                                    Track Order <ChevronRight className="w-3 h-3" />
                                </button>
                            </div>
                        </div>
                    ))}

                    {filteredOrders.length === 0 && (
                        <div className="text-center py-20 bg-white border-2 border-dashed border-gray-200 rounded-2xl">
                            <ShoppingBag className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                            <h3 className="text-lg font-black text-gray-500 mb-1">No orders found</h3>
                            <p className="text-gray-400 font-medium">No orders matching your filters.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DealerOrders;

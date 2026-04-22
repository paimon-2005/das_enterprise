import React, { useState } from 'react';
import { 
    Search, 
    Filter, 
    ChevronRight, 
    Calendar,
    ShoppingBag,
    Eye,
    CheckCircle2,
    Clock,
    X,
    Loader2,
    Package,
    Truck,
    XCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { 
    useGetAllOrdersQuery, 
    useUpdateOrderStatusMutation, 
    useUpdatePaymentStatusMutation 
} from '../../features/orders/ordersApi';

const AdminOrders = () => {
    const [filters, setFilters] = useState({
        status: '',
        area: '',
        paymentTerm: '',
    });
    const [searchTerm, setSearchTerm] = useState('');

    const { data: orderData, isLoading } = useGetAllOrdersQuery(filters);
    const [updateStatus] = useUpdateOrderStatusMutation();
    const [updatePayment] = useUpdatePaymentStatusMutation();

    // Static hardcoded delivery areas — max 60 shops, admin knows them all
    const AREAS = ['Mogra', 'Jirat', 'Kuntighat'];

    const orders = orderData?.orders || [];
    
    // Client-side search for shop name
    const filteredOrders = orders.filter(o => 
        o.shopName.toLowerCase().includes(searchTerm.toLowerCase()) || 
        o._id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleStatusChange = async (id, status) => {
        try {
            await updateStatus({ id, status }).unwrap();
            toast.success(`Order marked as ${status}`);
        } catch (err) {
            toast.error(err?.data?.message || 'Update failed');
        }
    };

    const handlePaymentChange = async (id, status) => {
        try {
            await updatePayment({ id, status }).unwrap();
            toast.success(`Payment status: ${status}`);
        } catch (err) {
            toast.error(err?.data?.message || 'Update failed');
        }
    };

    const getStatusBadge = (status) => {
        const styles = {
            pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
            confirmed: 'bg-blue-50 text-blue-700 border-blue-200',
            processing: 'bg-indigo-50 text-indigo-700 border-indigo-200',
            dispatched: 'bg-orange-50 text-orange-700 border-orange-200',
            delivered: 'bg-green-50 text-green-700 border-green-200',
            cancelled: 'bg-red-50 text-red-700 border-red-200',
        };
        return `inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] uppercase font-black border ${styles[status] || 'bg-gray-50 text-gray-500 border-gray-200'}`;
    };

    if (isLoading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
                <Loader2 className="w-12 h-12 text-[#16a34a] animate-spin mx-auto mb-4" />
                <p className="text-gray-500 font-medium">Loading orders...</p>
            </div>
        </div>
    );

    return (
        <div className="p-6 lg:p-8 space-y-6 bg-gray-50 min-h-screen">
            
            {/* Page Header */}
            <div className="bg-white border-2 border-gray-100 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
                <div>
                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Admin</p>
                    <h1 className="text-3xl font-black text-gray-900">
                        Order <span className="text-[#16a34a]">Management</span>
                    </h1>
                    <p className="text-gray-400 text-sm font-medium mt-1">{filteredOrders.length} orders found</p>
                </div>
                <div className="relative">
                    <Search className="absolute left-3.5 top-3 w-5 h-5 text-gray-400" />
                    <input 
                        type="text"
                        placeholder="Shop name or Order ID..."
                        className="bg-gray-50 border-2 border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-[#16a34a] w-full md:w-72 font-medium"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Filter Bar */}
            <div className="bg-white border-2 border-gray-100 p-4 rounded-2xl flex flex-wrap gap-3 items-center shadow-sm">
                <div className="flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-widest">
                    <Filter className="w-4 h-4" /> Filters:
                </div>
                
                <select 
                    className="bg-gray-50 border-2 border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 outline-none focus:border-[#16a34a] font-bold cursor-pointer"
                    value={filters.status}
                    onChange={(e) => setFilters(f => ({...f, status: e.target.value}))}
                >
                    <option value="">Status: All</option>
                    {['pending', 'confirmed', 'processing', 'dispatched', 'delivered', 'cancelled'].map(s => 
                        <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                    )}
                </select>

                <select 
                    className="bg-gray-50 border-2 border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 outline-none focus:border-[#16a34a] font-bold cursor-pointer"
                    value={filters.area}
                    onChange={(e) => setFilters(f => ({...f, area: e.target.value}))}
                >
                    <option value="">Area: All</option>
                    {AREAS.map(a => <option key={a} value={a}>{a}</option>)}
                </select>

                <select 
                    className="bg-gray-50 border-2 border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 outline-none focus:border-[#16a34a] font-bold cursor-pointer"
                    value={filters.paymentTerm}
                    onChange={(e) => setFilters(f => ({...f, paymentTerm: e.target.value}))}
                >
                    <option value="">Payment: All</option>
                    {['cash', 'credit', 'weekly'].map(t => 
                        <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                    )}
                </select>

                {(filters.status || filters.area || filters.paymentTerm) && (
                    <button 
                        onClick={() => setFilters({status: '', area: '', paymentTerm: ''})}
                        className="text-gray-400 hover:text-red-500 text-xs font-bold flex items-center gap-1.5 bg-red-50 px-3 py-2 rounded-xl border border-red-100 hover:border-red-200 transition-all"
                    >
                        <X className="w-3.5 h-3.5" /> Clear filters
                    </button>
                )}
            </div>

            {/* Orders Table */}
            <div className="bg-white border-2 border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-xs font-black text-gray-500 uppercase tracking-wider border-b-2 border-gray-100">
                            <tr>
                                <th className="px-6 py-4">Order Detail</th>
                                <th className="px-6 py-4">Shop &amp; Area</th>
                                <th className="px-6 py-4">Total Amount</th>
                                <th className="px-6 py-4">Payment</th>
                                <th className="px-6 py-4">Order Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y-2 divide-gray-50">
                            {filteredOrders.map(order => (
                                <tr key={order._id} className="hover:bg-green-50/30 group transition-all">
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="text-xs font-black text-gray-800 uppercase tracking-wider font-mono">
                                                #{order._id.substring(18)}
                                            </span>
                                            <span className="text-xs text-gray-400 font-medium flex items-center gap-1 mt-1">
                                                <Calendar className="w-3 h-3" /> {new Date(order.createdAt).toLocaleDateString('en-IN')}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-black text-gray-900">{order.shopName}</span>
                                            <span className="text-xs font-bold text-[#16a34a] uppercase tracking-wider mt-0.5">{order.area}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="text-base font-black text-[#16a34a]">₹{order.totalPrice.toLocaleString('en-IN')}</span>
                                            <span className="text-xs text-gray-400 font-medium mt-0.5">{order.items.length} product(s)</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <select 
                                            value={order.paymentStatus}
                                            onChange={(e) => handlePaymentChange(order._id, e.target.value)}
                                            className={`text-xs font-black uppercase rounded-lg px-2.5 py-1.5 border-2 cursor-pointer outline-none transition-all ${
                                                order.paymentStatus === 'paid' 
                                                    ? 'text-green-700 bg-green-50 border-green-200' 
                                                    : 'text-orange-700 bg-orange-50 border-orange-200'
                                            }`}
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="partial">Partial</option>
                                            <option value="paid">Paid</option>
                                        </select>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className={getStatusBadge(order.orderStatus)}>
                                                {order.orderStatus}
                                            </span>
                                            <select 
                                                className="bg-gray-50 border-2 border-gray-200 rounded-lg px-2 py-1 text-xs text-gray-600 font-bold opacity-0 group-hover:opacity-100 transition-opacity outline-none focus:border-[#16a34a] cursor-pointer"
                                                value={order.orderStatus}
                                                onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                            >
                                                <option value="">Update Status</option>
                                                {['pending', 'confirmed', 'processing', 'dispatched', 'delivered', 'cancelled'].map(s => 
                                                    <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                                                )}
                                            </select>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <Link 
                                            to={`/admin/orders/${order._id}`} 
                                            className="text-gray-400 hover:text-[#16a34a] transition-colors p-2.5 rounded-xl hover:bg-green-50 inline-block border-2 border-gray-100 hover:border-green-100"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {filteredOrders.length === 0 && !isLoading && (
                        <div className="p-20 text-center space-y-4">
                            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto">
                                <ShoppingBag className="w-8 h-8 text-gray-300" />
                            </div>
                            <p className="text-gray-400 font-medium">No orders found matching your criteria.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminOrders;

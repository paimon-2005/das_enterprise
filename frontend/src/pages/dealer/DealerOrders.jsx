import React, { useState } from 'react';
import { useGetMyOrdersQuery } from '../../features/orders/ordersApi';
import {
    Package, Calendar, ChevronRight, Search, Clock,
    CheckCircle2, Truck, XCircle, Loader2, ShoppingBag, Filter,
} from 'lucide-react';
import { clsx } from 'clsx';

const STATUS_BADGE = {
    pending: 'badge-yellow',
    confirmed: 'badge-blue',
    processing: 'badge-blue',
    dispatched: 'badge-orange',
    delivered: 'badge-green',
    cancelled: 'badge-red',
};

const STATUS_ICON = {
    pending: <Clock className="w-3.5 h-3.5" />,
    confirmed: <Package className="w-3.5 h-3.5" />,
    processing: <Package className="w-3.5 h-3.5" />,
    dispatched: <Truck className="w-3.5 h-3.5" />,
    delivered: <CheckCircle2 className="w-3.5 h-3.5" />,
    cancelled: <XCircle className="w-3.5 h-3.5" />,
};

const PAYMENT_BADGE = {
    paid: 'badge-green',
    partial: 'badge-yellow',
    pending: 'badge-orange',
};

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

    if (isLoading) return (
        <div className="min-h-screen flex items-center justify-center bg-surface">
            <div className="text-center">
                <Loader2 className="w-10 h-10 text-primary-600 animate-spin mx-auto mb-3" />
                <p className="text-txt-secondary text-sm font-medium">Loading your orders…</p>
            </div>
        </div>
    );

    return (
        <div className="page-wrapper max-w-5xl mx-auto">

            {/* Page header */}
            <div className="page-header !bg-[#1a5fad]">
                <div>
                    <p className="text-[11px] font-semibold text-white/80 uppercase tracking-widest mb-1">Dealer Portal</p>
                    <h1 className="text-2xl font-bold text-white">Order History</h1>
                    <p className="text-sm text-white/90 mt-0.5">{orders.length} total orders placed</p>
                </div>
                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
                    <input
                        type="text"
                        placeholder="Search by Order ID…"
                        className="input-field pl-9 w-56 border-none"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Status quick filters */}
            <div className="flex gap-2 overflow-x-auto pb-1">
                {['All', 'pending', 'confirmed', 'dispatched', 'delivered', 'cancelled'].map(s => (
                    <button
                        key={s}
                        onClick={() => setStatusFilter(s)}
                        className={clsx(
                            'px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap border transition-all',
                            statusFilter === s
                                ? 'bg-primary-600 text-white border-primary-600 shadow-sm'
                                : 'bg-card text-txt-secondary border-gray-200 hover:border-primary-300 hover:text-primary-600',
                        )}
                    >
                        {s === 'All' ? 'All Orders' : s.charAt(0).toUpperCase() + s.slice(1)}
                    </button>
                ))}
            </div>

            {/* Orders list */}
            <div className="space-y-3">
                {filteredOrders.map(order => (
                    <div
                        key={order._id}
                        className="bg-card border border-gray-100 rounded-xl overflow-hidden shadow-card hover:border-primary-200 hover:shadow-card2 transition-all"
                    >
                        {/* Order header */}
                        <div className="px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center border border-primary-100 shrink-0">
                                    <Package className="w-5 h-5 text-primary-600" />
                                </div>
                                <div>
                                    <p className="text-[10px] text-txt-secondary font-medium uppercase tracking-widest">Order ID</p>
                                    <h3 className="text-sm font-bold text-txt-primary font-mono">{order._id.slice(-10).toUpperCase()}</h3>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className={clsx(STATUS_BADGE[order.orderStatus] || 'badge-gray', 'inline-flex items-center gap-1')}>
                                    {STATUS_ICON[order.orderStatus]}
                                    {order.orderStatus}
                                </span>
                                <span className="text-xl font-bold text-primary-600">
                                    ₹{order.totalPrice.toLocaleString('en-IN')}
                                </span>
                            </div>
                        </div>

                        {/* Order meta grid */}
                        <div className="px-5 py-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {[
                                { label: 'Placed On', value: new Date(order.createdAt).toLocaleDateString('en-IN') },
                                { label: 'Items', value: `${order.items.length} Products` },
                                { label: 'Payment Term', value: order.paymentTerm },
                                { label: 'Payment', value: order.paymentStatus, badge: PAYMENT_BADGE[order.paymentStatus] },
                            ].map(meta => (
                                <div key={meta.label} className="bg-surface border border-gray-100 rounded-lg p-3">
                                    <p className="text-[10px] text-txt-secondary font-medium uppercase tracking-wide mb-1">{meta.label}</p>
                                    {meta.badge ? (
                                        <span className={meta.badge}>{meta.value}</span>
                                    ) : (
                                        <p className="text-sm font-semibold text-txt-primary">{meta.value}</p>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Items summary footer */}
                        <div className="bg-surface px-5 py-3 border-t border-gray-100 flex items-center justify-between">
                            <p className="text-xs text-txt-secondary leading-relaxed truncate max-w-[70%]">
                                <span className="font-semibold text-txt-primary">Items: </span>
                                {order.items.map(i => `${i.productName} (x${i.quantity})`).join(', ')}
                            </p>
                            <button className="text-primary-600 text-xs font-semibold flex items-center gap-1 hover:text-primary-700 transition-colors whitespace-nowrap ml-4">
                                Track <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    </div>
                ))}

                {/* Empty state */}
                {filteredOrders.length === 0 && (
                    <div className="text-center py-20 bg-card border border-dashed border-gray-200 rounded-xl">
                        <ShoppingBag className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                        <h3 className="text-base font-semibold text-txt-secondary mb-1">No orders found</h3>
                        <p className="text-sm text-txt-secondary">No orders matching your filters.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DealerOrders;

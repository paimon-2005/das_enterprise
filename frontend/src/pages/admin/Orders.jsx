import React, { useState } from 'react';
import {
    Search,
    Filter,
    Calendar,
    ShoppingBag,
    Eye,
    X,
    Loader2,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import {
    useGetAllOrdersQuery,
    useUpdateOrderStatusMutation,
    useUpdatePaymentStatusMutation,
} from '../../features/orders/ordersApi';
import { clsx } from 'clsx';

// ── Static area list (max 60 shops, admin knows them) ─────────
const AREAS = ['Mogra', 'Jirat', 'Kuntighat'];

// ── Status badge mapper ───────────────────────────────────────
const STATUS_BADGE = {
    pending:    'badge-yellow',
    confirmed:  'badge-blue',
    processing: 'badge-blue',
    dispatched: 'badge-orange',
    delivered:  'badge-green',
    cancelled:  'badge-red',
};

// ── Payment badge mapper ──────────────────────────────────────
const PAYMENT_BADGE = {
    paid:    'badge-green',
    partial: 'badge-yellow',
    pending: 'badge-orange',
};

// ─────────────────────────────────────────────────────────────
const AdminOrders = () => {
    const [filters, setFilters]       = useState({ status: '', area: '', paymentTerm: '' });
    const [searchTerm, setSearchTerm] = useState('');

    const { data: orderData, isLoading } = useGetAllOrdersQuery(filters);
    const [updateStatus]  = useUpdateOrderStatusMutation();
    const [updatePayment] = useUpdatePaymentStatusMutation();

    const orders = orderData?.orders || [];
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

    if (isLoading) return (
        <div className="min-h-screen flex items-center justify-center bg-surface">
            <div className="text-center">
                <Loader2 className="w-10 h-10 text-primary-600 animate-spin mx-auto mb-3" />
                <p className="text-txt-secondary text-sm font-medium">Loading orders…</p>
            </div>
        </div>
    );

    return (
        <div className="page-wrapper">

            {/* ── Page header ─────────────────────────────── */}
            <div className="page-header">
                <div>
                    <p className="text-[11px] font-semibold text-txt-secondary uppercase tracking-widest mb-1">
                        Admin
                    </p>
                    <h1 className="text-2xl font-bold text-txt-primary">Order Management</h1>
                    <p className="text-sm text-txt-secondary mt-0.5">
                        {filteredOrders.length} order{filteredOrders.length !== 1 ? 's' : ''} found
                    </p>
                </div>

                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-txt-secondary" size={15} />
                    <input
                        type="text"
                        placeholder="Shop name or Order ID…"
                        className="input-field pl-9 w-64"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* ── Filter bar ──────────────────────────────── */}
            <div className="bg-card border border-gray-100 rounded-xl px-4 py-3 flex flex-wrap gap-3 items-center shadow-card">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-txt-secondary uppercase tracking-wide">
                    <Filter size={13} /> Filters
                </div>

                <select
                    className="input-field !w-auto !py-1.5 cursor-pointer text-xs font-medium"
                    value={filters.status}
                    onChange={e => setFilters(f => ({ ...f, status: e.target.value }))}
                >
                    <option value="">Status: All</option>
                    {['pending', 'confirmed', 'processing', 'dispatched', 'delivered', 'cancelled'].map(s => (
                        <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                    ))}
                </select>

                <select
                    className="input-field !w-auto !py-1.5 cursor-pointer text-xs font-medium"
                    value={filters.area}
                    onChange={e => setFilters(f => ({ ...f, area: e.target.value }))}
                >
                    <option value="">Area: All</option>
                    {AREAS.map(a => <option key={a} value={a}>{a}</option>)}
                </select>

                <select
                    className="input-field !w-auto !py-1.5 cursor-pointer text-xs font-medium"
                    value={filters.paymentTerm}
                    onChange={e => setFilters(f => ({ ...f, paymentTerm: e.target.value }))}
                >
                    <option value="">Payment: All</option>
                    {['cash', 'credit', 'weekly'].map(t => (
                        <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                    ))}
                </select>

                {(filters.status || filters.area || filters.paymentTerm) && (
                    <button
                        onClick={() => setFilters({ status: '', area: '', paymentTerm: '' })}
                        className="flex items-center gap-1 text-xs font-semibold text-red-500 hover:text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg border border-red-100 transition-all"
                    >
                        <X size={12} /> Clear filters
                    </button>
                )}
            </div>

            {/* ── Orders table ────────────────────────────── */}
            <div className="bg-card border border-gray-100 rounded-xl overflow-hidden shadow-card">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-surface border-b border-gray-200">
                            <tr>
                                {['Order', 'Shop & Area', 'Amount', 'Payment', 'Status', ''].map(h => (
                                    <th
                                        key={h}
                                        className="px-5 py-3.5 text-[11px] font-semibold text-txt-secondary uppercase tracking-wider whitespace-nowrap"
                                    >
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredOrders.map(order => (
                                <tr key={order._id} className="admin-table-row group">

                                    {/* Order ID + date */}
                                    <td className="px-5 py-4">
                                        <p className="font-mono text-xs font-semibold text-txt-primary">
                                            #{order._id.substring(18)}
                                        </p>
                                        <p className="text-xs text-txt-secondary flex items-center gap-1 mt-0.5">
                                            <Calendar size={11} />
                                            {new Date(order.createdAt).toLocaleDateString('en-IN')}
                                        </p>
                                    </td>

                                    {/* Shop & area */}
                                    <td className="px-5 py-4">
                                        <p className="font-semibold text-txt-primary text-sm">{order.shopName}</p>
                                        <p className="text-xs text-primary-600 font-medium mt-0.5 uppercase tracking-wide">
                                            {order.area}
                                        </p>
                                    </td>

                                    {/* Amount */}
                                    <td className="px-5 py-4">
                                        <p className="font-bold text-txt-primary">
                                            ₹{order.totalPrice.toLocaleString('en-IN')}
                                        </p>
                                        <p className="text-xs text-txt-secondary mt-0.5">
                                            {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                                        </p>
                                    </td>

                                    {/* Payment status (inline select) */}
                                    <td className="px-5 py-4">
                                        <select
                                            value={order.paymentStatus}
                                            onChange={e => handlePaymentChange(order._id, e.target.value)}
                                            className={clsx(
                                                'text-[11px] font-semibold uppercase rounded-md px-2 py-1 border cursor-pointer outline-none transition-all',
                                                order.paymentStatus === 'paid'
                                                    ? 'bg-green-50 text-green-700 border-green-200'
                                                    : order.paymentStatus === 'partial'
                                                        ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
                                                        : 'bg-orange-50 text-orange-700 border-orange-200',
                                            )}
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="partial">Partial</option>
                                            <option value="paid">Paid</option>
                                        </select>
                                    </td>

                                    {/* Order status badge + change select */}
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className={STATUS_BADGE[order.orderStatus] || 'badge-gray'}>
                                                {order.orderStatus}
                                            </span>
                                            <select
                                                className="opacity-0 group-hover:opacity-100 transition-opacity
                                                           text-[11px] font-semibold bg-surface border border-gray-200 rounded-md px-2 py-1
                                                           outline-none focus:border-primary-600 cursor-pointer text-txt-secondary"
                                                value={order.orderStatus}
                                                onChange={e => handleStatusChange(order._id, e.target.value)}
                                            >
                                                <option value="">Update</option>
                                                {['pending', 'confirmed', 'processing', 'dispatched', 'delivered', 'cancelled'].map(s => (
                                                    <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </td>

                                    {/* View button */}
                                    <td className="px-5 py-4 text-right">
                                        <Link
                                            to={`/admin/orders/${order._id}`}
                                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-txt-secondary
                                                       hover:text-primary-700 bg-surface hover:bg-primary-50 border border-gray-200
                                                       hover:border-primary-300 px-3 py-1.5 rounded-lg transition-all"
                                        >
                                            <Eye size={13} /> View
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Empty state */}
                    {filteredOrders.length === 0 && !isLoading && (
                        <div className="py-20 text-center">
                            <div className="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                                <ShoppingBag className="w-7 h-7 text-gray-300" />
                            </div>
                            <p className="text-txt-secondary text-sm font-medium">No orders match your filters.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminOrders;

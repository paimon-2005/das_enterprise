import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { selectCurrentUser } from '../../features/auth/authSlice';
import { useGetMyOrdersQuery } from '../../features/orders/ordersApi';
import {
    ShoppingBag, Clock, CreditCard, TrendingUp, ArrowRight,
    Store, MapPin, AlertCircle, Package, Calendar, Loader2,
} from 'lucide-react';
import { clsx } from 'clsx';

const STATUS_CLASS = {
    pending: 'badge-yellow', confirmed: 'badge-blue', processing: 'badge-blue',
    dispatched: 'badge-orange', delivered: 'badge-green', cancelled: 'badge-red',
};

const DealerDashboard = () => {
    const user = useSelector(selectCurrentUser);
    const { data: orderData, isLoading } = useGetMyOrdersQuery();
    const orders = orderData?.orders || [];
    const pendingOrders = orders.filter(o => o.orderStatus === 'pending').length;
    const totalSpent = orders.reduce((acc, curr) => acc + curr.totalPrice, 0);

    const kpiCards = [
        { label: 'Total Orders',   value: isLoading ? '—' : orders.length,                              icon: <ShoppingBag size={18}/>, accent: 'bg-blue-50',    iconColor: 'text-blue-600',    border: 'border-l-4 border-l-blue-500' },
        { label: 'Pending Orders', value: isLoading ? '—' : pendingOrders,                              icon: <Clock       size={18}/>, accent: 'bg-yellow-50',  iconColor: 'text-yellow-600',  border: 'border-l-4 border-l-yellow-400' },
        { label: 'Total Spent',    value: isLoading ? '—' : `₹${totalSpent.toLocaleString('en-IN')}`,  icon: <TrendingUp  size={18}/>, accent: 'bg-primary-50', iconColor: 'text-primary-600', border: 'border-l-4 border-l-primary-600' },
        { label: 'Current Due',    value: `₹${(user?.currentDue || 0).toLocaleString('en-IN')}`,       icon: <CreditCard  size={18}/>, accent: 'bg-red-50',     iconColor: 'text-red-500',     border: 'border-l-4 border-l-red-500', warning: user?.currentDue > user?.creditLimit },
    ];

    const quickActions = [
        { label: 'Order Products', sub: 'Browse wholesale catalogue', to: '/dealer/products', icon: <ShoppingBag size={20}/>, accent: 'bg-primary-50', iconColor: 'text-primary-600' },
        { label: 'Order History',  sub: 'Track all your orders',      to: '/dealer/orders',   icon: <Package     size={20}/>, accent: 'bg-blue-50',   iconColor: 'text-blue-600'    },
        { label: 'Shop Profile',   sub: 'View your shop details',     to: '/dealer/profile',  icon: <Store       size={20}/>, accent: 'bg-indigo-50', iconColor: 'text-indigo-600'  },
    ];

    return (
        <div className="page-wrapper max-w-7xl mx-auto">

            {/* Welcome banner */}
            <div className="bg-primary-800 rounded-xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md">
                <div>
                    <p className="text-primary-300 text-xs font-medium uppercase tracking-widest mb-1">Welcome back</p>
                    <h1 className="text-white text-2xl font-bold tracking-tight">{user?.shopName || 'Your Shop'}</h1>
                    <div className="flex flex-wrap items-center gap-4 mt-2">
                        <span className="flex items-center gap-1.5 text-primary-200 text-sm"><MapPin className="w-3.5 h-3.5" /> {user?.area || 'Area'}</span>
                        <span className="flex items-center gap-1.5 text-primary-200 text-sm"><Store className="w-3.5 h-3.5" /> {user?.name} (Owner)</span>
                    </div>
                </div>
                <Link to="/dealer/products" className="btn-accent inline-flex items-center gap-2 text-sm whitespace-nowrap shrink-0">
                    <ShoppingBag className="w-4 h-4" /> Browse & Order <ArrowRight className="w-4 h-4" />
                </Link>
            </div>

            {/* KPI cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {kpiCards.map((card, i) => (
                    <div key={i} className={clsx('bg-card border border-gray-100 rounded-xl p-5 shadow-card hover:shadow-card2 hover:-translate-y-0.5 transition-all', card.border)}>
                        <div className={clsx('w-9 h-9 rounded-lg flex items-center justify-center mb-4', card.accent)}>
                            <span className={card.iconColor}>{card.icon}</span>
                        </div>
                        <p className="text-txt-secondary text-[11px] font-medium uppercase tracking-wide">{card.label}</p>
                        <h3 className="text-xl font-bold text-txt-primary mt-1">{card.value}</h3>
                        {card.warning && (
                            <div className="flex items-center gap-1 mt-2 text-xs text-red-500 font-medium">
                                <AlertCircle className="w-3 h-3" /> Over credit limit
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Quick actions */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {quickActions.map((action) => (
                    <Link key={action.to} to={action.to}
                        className="bg-card border border-gray-100 rounded-xl p-5 flex items-center gap-4 hover:border-primary-300 hover:shadow-card2 hover:-translate-y-0.5 transition-all group">
                        <div className={clsx('w-12 h-12 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-primary-600 transition-colors', action.accent)}>
                            <span className={clsx(action.iconColor, 'group-hover:text-white transition-colors')}>{action.icon}</span>
                        </div>
                        <div>
                            <p className="font-semibold text-txt-primary text-sm">{action.label}</p>
                            <p className="text-txt-secondary text-xs mt-0.5">{action.sub}</p>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Recent orders */}
            <div className="bg-card border border-gray-100 rounded-xl overflow-hidden shadow-card">
                <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                    <h2 className="text-sm font-semibold text-txt-primary">Recent Orders</h2>
                    <Link to="/dealer/orders" className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary-600 bg-primary-50 hover:bg-primary-100 px-3 py-1.5 rounded-lg border border-primary-100 transition-all">
                        View All <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                </div>
                {isLoading ? (
                    <div className="py-16 flex items-center justify-center"><Loader2 className="w-8 h-8 text-primary-600 animate-spin" /></div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-[#C5E1A5]">
                                <tr>{[
                                    { label: 'Date', color: 'text-blue-700', align: 'text-left', width: 'w-[20%]' },
                                    { label: 'Items', color: 'text-yellow-800', align: 'text-left', width: 'w-[45%]' },
                                    { label: 'Amount', color: 'text-green-800', align: 'text-right', width: 'w-[15%]' },
                                    { label: 'Status', color: 'text-red-700', align: 'text-right', width: 'w-[20%]' }
                                ].map(h => (
                                    <th key={h.label} className={clsx("px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider", h.color, h.align, h.width)}>{h.label}</th>
                                ))}</tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {orders.slice(0, 5).map((order) => (
                                    <tr key={order._id} className="admin-table-row">
                                        <td className="px-5 py-4 whitespace-nowrap text-xs text-txt-secondary text-left">
                                            <span className="flex items-center gap-1.5"><Calendar size={11}/> {new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                                        </td>
                                        <td className="px-5 py-4 text-xs text-txt-secondary max-w-[200px] truncate text-left">
                                            {order.items.map(i => `${i.productName} x${i.quantity}`).join(', ')}
                                        </td>
                                        <td className="px-5 py-4 font-bold text-txt-primary text-right">₹{order.totalPrice.toLocaleString('en-IN')}</td>
                                        <td className="px-5 py-4 text-right"><span className={STATUS_CLASS[order.orderStatus] || 'badge-gray'}>{order.orderStatus}</span></td>
                                    </tr>
                                ))}
                                {orders.length === 0 && (
                                    <tr><td colSpan="4" className="px-5 py-16 text-center">
                                        <ShoppingBag className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                                        <p className="text-txt-secondary text-sm mb-4">No orders yet.</p>
                                        <Link to="/dealer/products" className="btn-primary inline-flex items-center gap-2 text-sm">Browse Products <ArrowRight className="w-4 h-4"/></Link>
                                    </td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DealerDashboard;

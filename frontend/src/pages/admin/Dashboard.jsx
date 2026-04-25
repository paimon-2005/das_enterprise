import React from 'react';
import { useGetDashboardStatsQuery } from '../../features/admin/adminApi';
import {
    IndianRupee,
    ShoppingBag,
    Store,
    AlertTriangle,
    TrendingUp,
    BadgeAlert,
    Clock,
    CheckCircle2,
    Loader2,
    ArrowRight,
    Package,
    MapPin,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { clsx } from 'clsx';

// ── Stat card data ────────────────────────────────────────────
const buildCards = (stats) => [
    {
        label:      'Total Revenue',
        value:      `₹${(stats?.totalRevenue || 0).toLocaleString('en-IN')}`,
        icon:       <TrendingUp size={18} />,
        iconColor:  'text-primary-600',
        accent:     'bg-primary-50',
        border:     'border-l-4 border-l-primary-600',
    },
    {
        label:      'Total Orders',
        value:      stats?.totalOrders || 0,
        icon:       <ShoppingBag size={18} />,
        iconColor:  'text-blue-600',
        accent:     'bg-blue-50',
        border:     'border-l-4 border-l-blue-500',
    },
    {
        label:      'Active Shops',
        value:      stats?.totalShops || 0,
        icon:       <Store size={18} />,
        iconColor:  'text-indigo-600',
        accent:     'bg-indigo-50',
        border:     'border-l-4 border-l-indigo-500',
    },
    {
        label:      'Pending Orders',
        value:      stats?.pendingOrders || 0,
        icon:       <Clock size={18} />,
        iconColor:  'text-yellow-600',
        accent:     'bg-yellow-50',
        border:     'border-l-4 border-l-yellow-400',
    },
    {
        label:      'Total Dues',
        value:      `₹${(stats?.totalDues || 0).toLocaleString('en-IN')}`,
        icon:       <IndianRupee size={18} />,
        iconColor:  'text-red-600',
        accent:     'bg-red-50',
        border:     'border-l-4 border-l-red-500',
    },
    {
        label:      'Low Stock Items',
        value:      stats?.lowStockProducts || 0,
        icon:       <AlertTriangle size={18} />,
        iconColor:  'text-accent-500',
        accent:     'bg-orange-50',
        border:     'border-l-4 border-l-accent-500',
    },
];

// ── Quick actions ─────────────────────────────────────────────
const QUICK_ACTIONS = [
    { label: 'View Orders',        to: '/admin/orders',   icon: <ShoppingBag size={20} />, iconColor: 'text-blue-600',    accent: 'bg-blue-50'   },
    { label: 'Manage Shops',       to: '/admin/shops',    icon: <Store       size={20} />, iconColor: 'text-indigo-600', accent: 'bg-indigo-50' },
    { label: 'Stock Management',   to: '/admin/stock',    icon: <Package     size={20} />, iconColor: 'text-accent-500', accent: 'bg-orange-50' },
    { label: 'Delivery Areas',     to: '/admin/areas',    icon: <MapPin      size={20} />, iconColor: 'text-primary-600', accent: 'bg-primary-50' },
];

// ──────────────────────────────────────────────────────────────
const AdminDashboard = () => {
    const { data: statsData, isLoading } = useGetDashboardStatsQuery();
    const stats = statsData?.stats;
    const cards = buildCards(stats);

    if (isLoading) return (
        <div className="min-h-screen flex items-center justify-center bg-surface">
            <div className="text-center">
                <Loader2 className="w-10 h-10 text-primary-600 animate-spin mx-auto mb-3" />
                <p className="text-txt-secondary text-sm font-medium">Loading dashboard…</p>
            </div>
        </div>
    );

    return (
        <div className="page-wrapper">

            {/* ── Page header ──────────────────────────────── */}
            <div className="page-header">
                <div>
                    <p className="text-[11px] font-semibold text-txt-secondary uppercase tracking-widest mb-1">
                        Admin Panel
                    </p>
                    <h1 className="text-2xl font-bold text-txt-primary">
                        Enterprise Overview
                    </h1>
                    <p className="text-sm text-txt-secondary mt-0.5">
                        Real-time operational statistics
                    </p>
                </div>
                <div className="flex items-center gap-2 bg-green-50 border border-green-200 px-3 py-1.5 rounded-lg">
                    <CheckCircle2 className="w-4 h-4 text-primary-600" />
                    <span className="text-sm font-semibold text-primary-700">System Online</span>
                </div>
            </div>

            {/* ── KPI summary cards ─────────────────────────── */}
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4">
                {cards.map((card, i) => (
                    <div
                        key={i}
                        className={clsx(
                            'bg-card rounded-xl p-5 shadow-card hover:shadow-card2 hover:-translate-y-0.5 transition-all border border-gray-100',
                            card.border,
                        )}
                    >
                        <div className={clsx('w-9 h-9 rounded-lg flex items-center justify-center mb-4', card.accent)}>
                            <span className={card.iconColor}>{card.icon}</span>
                        </div>
                        <p className="text-txt-secondary text-[11px] font-medium uppercase tracking-wide leading-tight">
                            {card.label}
                        </p>
                        <h3 className="text-xl font-bold text-txt-primary mt-1">{card.value}</h3>
                    </div>
                ))}
            </div>

            {/* ── Bottom section: inventory warnings + quick actions ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Inventory Warnings */}
                <div className="card">
                    <div className="flex items-center gap-2.5 mb-5 pb-4 border-b border-gray-100">
                        <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center">
                            <BadgeAlert className="text-red-500" size={17} />
                        </div>
                        <h2 className="text-sm font-semibold text-txt-primary">Inventory Warnings</h2>
                    </div>

                    <div className="flex flex-col items-center justify-center py-6 text-center">
                        {stats?.lowStockProducts > 0 ? (
                            <>
                                <div className="w-14 h-14 bg-orange-50 rounded-xl flex items-center justify-center mb-4">
                                    <AlertTriangle className="w-7 h-7 text-accent-500" />
                                </div>
                                <p className="text-txt-secondary text-sm mb-4">
                                    <span className="font-bold text-accent-500">{stats.lowStockProducts}</span> items are at critical stock levels.
                                </p>
                                <Link
                                    to="/admin/stock"
                                    className="btn-primary inline-flex items-center gap-2 text-sm"
                                >
                                    Manage Stock <ArrowRight size={15} />
                                </Link>
                            </>
                        ) : (
                            <>
                                <div className="w-14 h-14 bg-green-50 rounded-xl flex items-center justify-center mb-4">
                                    <CheckCircle2 className="w-7 h-7 text-primary-600" />
                                </div>
                                <p className="text-txt-secondary text-sm">All inventory levels are healthy.</p>
                            </>
                        )}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="card">
                    <div className="flex items-center gap-2.5 mb-5 pb-4 border-b border-gray-100">
                        <div className="w-8 h-8 bg-primary-50 rounded-lg flex items-center justify-center">
                            <TrendingUp className="text-primary-600" size={17} />
                        </div>
                        <h2 className="text-sm font-semibold text-txt-primary">Quick Actions</h2>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        {QUICK_ACTIONS.map(action => (
                            <Link
                                key={action.label}
                                to={action.to}
                                className="flex flex-col items-center justify-center p-4 bg-surface border border-gray-100 rounded-xl
                                           hover:border-primary-300 hover:bg-primary-50/40 transition-all group"
                            >
                                <div className={clsx('w-11 h-11 rounded-xl flex items-center justify-center mb-3 group-hover:scale-105 transition-transform', action.accent)}>
                                    <span className={action.iconColor}>{action.icon}</span>
                                </div>
                                <span className="text-xs font-semibold text-txt-secondary group-hover:text-primary-700 transition-colors text-center">
                                    {action.label}
                                </span>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;

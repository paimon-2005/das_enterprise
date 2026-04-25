import React from 'react';
import {
    Download, FileText, Calendar, ChevronDown, TrendingUp,
    PieChart as PieIcon, BarChart3, ArrowUpRight, Loader2
} from 'lucide-react';
import {
    ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid,
    BarChart, Bar
} from 'recharts';
import { useGetAdminStatsQuery, useGetRevenueHistoryQuery } from '../../features/admin/adminApi';

const Reports = () => {
    const { data: statsData, isLoading: statsLoading } = useGetAdminStatsQuery();
    const { data: revenueData, isLoading: revLoading }  = useGetRevenueHistoryQuery('1m');

    const stats      = statsData?.data || {};
    const chartData  = revenueData?.data?.revenueHistory || [];
    const categories = revenueData?.data?.categoryDistribution || [];

    if (statsLoading || revLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-surface">
                <div className="text-center">
                    <Loader2 className="w-10 h-10 text-primary-600 animate-spin mx-auto mb-3" />
                    <p className="text-txt-secondary text-sm font-medium animate-pulse">Generating reports…</p>
                </div>
            </div>
        );
    }

    return (
        <div className="page-wrapper">

            {/* ── Page header ─────────────────────────────── */}
            <div className="page-header">
                <div>
                    <p className="text-[11px] font-semibold text-txt-secondary uppercase tracking-widest mb-1">Admin</p>
                    <h1 className="text-2xl font-bold text-txt-primary">Reports & Analytics</h1>
                    <p className="text-sm text-txt-secondary mt-0.5">Performance metrics and business intelligence</p>
                </div>
                <div className="flex gap-2">
                    <button className="btn-outline inline-flex items-center gap-2 text-sm">
                        <Calendar size={15} /> Last 30 Days <ChevronDown size={13} />
                    </button>
                    <button className="btn-primary inline-flex items-center gap-2 text-sm">
                        <FileText size={15} /> Export PDF
                    </button>
                </div>
            </div>

            {/* ── Charts grid ─────────────────────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Revenue chart */}
                <div className="card">
                    <div className="flex justify-between items-start mb-5 pb-4 border-b border-gray-100">
                        <div>
                            <h3 className="text-sm font-semibold text-txt-primary">Revenue Report</h3>
                            <p className="text-xs text-txt-secondary mt-0.5">Weekly revenue overview</p>
                        </div>
                        <div className="text-right">
                            <p className="text-xl font-bold text-primary-600">
                                ₹{(stats.totalRevenue || 0).toLocaleString('en-IN')}
                            </p>
                            <p className="text-xs font-semibold text-green-600 flex items-center justify-end gap-1 mt-0.5">
                                <ArrowUpRight size={12} /> {stats.revenueGrowth || 0}% vs last period
                            </p>
                        </div>
                    </div>
                    <div className="h-56">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData.length > 0 ? chartData : [{ name: 'N/A', revenue: 0 }]}>
                                <defs>
                                    <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%"  stopColor="#2E7D32" stopOpacity={0.15} />
                                        <stop offset="95%" stopColor="#2E7D32" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#757575' }} />
                                <YAxis hide />
                                <Tooltip
                                    contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 12 }}
                                    cursor={{ stroke: '#2E7D32', strokeWidth: 1, strokeDasharray: '4 4' }}
                                />
                                <Area type="monotone" dataKey="revenue" stroke="#2E7D32" strokeWidth={2.5} fill="url(#revenueGrad)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Orders chart */}
                <div className="card">
                    <div className="flex justify-between items-start mb-5 pb-4 border-b border-gray-100">
                        <div>
                            <h3 className="text-sm font-semibold text-txt-primary">Orders Fulfilment</h3>
                            <p className="text-xs text-txt-secondary mt-0.5">Order trends by day</p>
                        </div>
                        <div className="text-right">
                            <p className="text-xl font-bold text-blue-600">{stats.totalOrders || 0}</p>
                            <p className="text-xs font-semibold text-green-600 flex items-center justify-end gap-1 mt-0.5">
                                <ArrowUpRight size={12} /> {stats.ordersGrowth || 0}%
                            </p>
                        </div>
                    </div>
                    <div className="h-56">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData.length > 0 ? chartData : [{ name: 'N/A', orders: 0 }]}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#757575' }} />
                                <YAxis hide />
                                <Tooltip
                                    contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 12 }}
                                    cursor={{ fill: '#f4f6f8' }}
                                />
                                <Bar dataKey="orders" fill="#2E7D32" radius={[4, 4, 0, 0]} maxBarSize={32} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Top products */}
                <div className="card">
                    <div className="flex items-center gap-2 mb-5 pb-4 border-b border-gray-100">
                        <TrendingUp size={16} className="text-primary-600" />
                        <h3 className="text-sm font-semibold text-txt-primary">Top Performing Products</h3>
                    </div>
                    <div className="space-y-3">
                        {(stats.topProducts || [
                            { name: 'Basmati Rice Premium', sales: '840 units', revenue: '₹1,00,800', share: '24%' },
                            { name: 'Sunflower Oil 5L',     sales: '520 units', revenue: '₹83,200',   share: '18%' },
                            { name: 'Cumin Seeds 200g',     sales: '310 units', revenue: '₹13,950',   share: '11%' },
                        ]).map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 bg-surface border border-gray-100 rounded-xl hover:border-primary-200 hover:bg-primary-50/30 transition-all">
                                <div className="flex items-center gap-3">
                                    <span className="w-6 h-6 rounded-full bg-primary-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                                        {idx + 1}
                                    </span>
                                    <div>
                                        <p className="text-sm font-semibold text-txt-primary">{item.name}</p>
                                        <p className="text-[10px] text-txt-secondary font-medium uppercase tracking-wide">
                                            {item.sales || 'Dynamic Sales'}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right shrink-0">
                                    <p className="text-sm font-bold text-txt-primary">{item.revenue || '₹0'}</p>
                                    <p className="text-[10px] text-primary-600 font-semibold">{item.share || '0%'} share</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Category performance */}
                <div className="card">
                    <div className="flex items-center gap-2 mb-5 pb-4 border-b border-gray-100">
                        <PieIcon size={16} className="text-indigo-600" />
                        <h3 className="text-sm font-semibold text-txt-primary">Category Performance</h3>
                    </div>
                    <div className="space-y-4">
                        {categories.length === 0 ? (
                            <p className="text-center text-txt-secondary text-sm py-10">No category data available.</p>
                        ) : categories.map((cat, idx) => (
                            <div key={idx}>
                                <div className="flex justify-between text-xs font-semibold mb-1.5">
                                    <span className="text-txt-secondary uppercase tracking-wide">{cat.name}</span>
                                    <span className="text-primary-600">+{(cat.value / 10).toFixed(1)}%</span>
                                </div>
                                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-primary-600 rounded-full transition-all duration-700"
                                        style={{ width: `${cat.value}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Reports;

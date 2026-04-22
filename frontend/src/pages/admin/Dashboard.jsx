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
    ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
    const { data: statsData, isLoading } = useGetDashboardStatsQuery();
    const stats = statsData?.stats;

    const cards = [
        { 
            label: 'Total Revenue', 
            value: `₹${stats?.totalRevenue?.toLocaleString('en-IN') || 0}`, 
            icon: TrendingUp, 
            iconColor: 'text-green-600', 
            bg: 'bg-green-50',
            border: 'border-green-100'
        },
        { 
            label: 'Total Orders', 
            value: stats?.totalOrders || 0, 
            icon: ShoppingBag, 
            iconColor: 'text-blue-600', 
            bg: 'bg-blue-50',
            border: 'border-blue-100'
        },
        { 
            label: 'Active Shops', 
            value: stats?.totalShops || 0, 
            icon: Store, 
            iconColor: 'text-indigo-600', 
            bg: 'bg-indigo-50',
            border: 'border-indigo-100'
        },
        { 
            label: 'Pending Orders', 
            value: stats?.pendingOrders || 0, 
            icon: Clock, 
            iconColor: 'text-yellow-600', 
            bg: 'bg-yellow-50',
            border: 'border-yellow-100'
        },
        { 
            label: 'Total Dues', 
            value: `₹${stats?.totalDues?.toLocaleString('en-IN') || 0}`, 
            icon: IndianRupee, 
            iconColor: 'text-red-600', 
            bg: 'bg-red-50',
            border: 'border-red-100'
        },
        { 
            label: 'Low Stock', 
            value: stats?.lowStockProducts || 0, 
            icon: AlertTriangle, 
            iconColor: 'text-orange-600', 
            bg: 'bg-orange-50',
            border: 'border-orange-100'
        }
    ];

    if (isLoading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
                <Loader2 className="w-12 h-12 text-[#16a34a] animate-spin mx-auto mb-4" />
                <p className="text-gray-500 font-medium">Loading dashboard...</p>
            </div>
        </div>
    );

    return (
        <div className="p-6 lg:p-8 space-y-8 bg-gray-50 min-h-screen">

            {/* Header */}
            <div className="bg-white border-2 border-gray-100 rounded-2xl p-6 flex items-center justify-between shadow-sm">
                <div>
                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Admin Panel</p>
                    <h1 className="text-3xl font-black text-gray-900">
                        Enterprise <span className="text-[#16a34a]">Overview</span>
                    </h1>
                    <p className="text-gray-400 text-sm font-medium mt-1">Real-time statistics from MongoDB Atlas</p>
                </div>
                <div className="hidden md:flex items-center gap-2 bg-green-50 border border-green-100 px-4 py-2 rounded-xl">
                    <CheckCircle2 className="w-4 h-4 text-[#16a34a]" />
                    <span className="text-sm font-bold text-[#16a34a]">System Online</span>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4">
                {cards.map((card, i) => (
                    <div key={i} className={`bg-white border-2 ${card.border} p-5 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all`}>
                        <div className={`w-11 h-11 ${card.bg} rounded-xl flex items-center justify-center mb-4`}>
                            <card.icon className={`w-5 h-5 ${card.iconColor}`} />
                        </div>
                        <p className="text-gray-400 text-xs font-black uppercase tracking-widest leading-tight">{card.label}</p>
                        <h3 className="text-xl font-black text-gray-900 mt-1 whitespace-nowrap">{card.value}</h3>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Inventory Warnings */}
                <div className="bg-white border-2 border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                    <div className="p-5 border-b-2 border-gray-100 flex items-center gap-3">
                        <div className="w-9 h-9 bg-red-50 rounded-xl flex items-center justify-center">
                            <BadgeAlert className="text-red-500 w-5 h-5" />
                        </div>
                        <h2 className="text-sm font-black text-gray-900 uppercase tracking-wider">Inventory Warnings</h2>
                    </div>
                    <div className="p-8 text-center">
                        {stats?.lowStockProducts > 0 ? (
                            <div className="space-y-4">
                                <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto">
                                    <AlertTriangle className="w-8 h-8 text-orange-500" />
                                </div>
                                <p className="text-gray-600 font-medium">
                                    You have <span className="font-black text-orange-600">{stats.lowStockProducts}</span> items reaching critical stock levels.
                                </p>
                                <Link to="/admin/stock" className="inline-flex items-center gap-2 bg-[#16a34a] text-white font-bold px-5 py-2.5 rounded-xl hover:bg-[#15803d] transition-colors shadow-sm shadow-green-200">
                                    Manage Stock <ArrowRight className="w-4 h-4" />
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mx-auto">
                                    <CheckCircle2 className="w-8 h-8 text-[#16a34a]" />
                                </div>
                                <p className="text-gray-500 font-medium">All inventory levels are optimal.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white border-2 border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                    <div className="p-5 border-b-2 border-gray-100 flex items-center gap-3">
                        <div className="w-9 h-9 bg-green-50 rounded-xl flex items-center justify-center">
                            <TrendingUp className="text-[#16a34a] w-5 h-5" />
                        </div>
                        <h2 className="text-sm font-black text-gray-900 uppercase tracking-wider">Growth &amp; Operations</h2>
                    </div>
                    <div className="p-5 grid grid-cols-2 gap-3">
                        {[
                            { label: 'View Orders', to: '/admin/orders', icon: ShoppingBag, color: 'text-blue-500', bg: 'bg-blue-50' },
                            { label: 'Manage Shops', to: '/admin/shops', icon: Store, color: 'text-indigo-500', bg: 'bg-indigo-50' },
                            { label: 'Stock Management', to: '/admin/stock', icon: IndianRupee, color: 'text-orange-500', bg: 'bg-orange-50' },
                            { label: 'Market Regions', to: '/admin/areas', icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50' },
                        ].map(action => (
                            <Link 
                                key={action.label} 
                                to={action.to}
                                className="flex flex-col items-center justify-center p-5 bg-gray-50 border-2 border-gray-100 rounded-2xl hover:border-[#16a34a] hover:bg-green-50/50 transition-all group"
                            >
                                <div className={`w-12 h-12 ${action.bg} rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                                    <action.icon className={`w-6 h-6 ${action.color}`} />
                                </div>
                                <span className="text-xs font-black text-gray-600 group-hover:text-[#16a34a] transition-colors text-center">{action.label}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;

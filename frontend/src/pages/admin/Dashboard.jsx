import React from 'react';
import { 
    IndianRupee, 
    ShoppingBag, 
    Users, 
    TrendingUp, 
    Package, 
    Clock, 
    MoreHorizontal,
    ArrowRight,
    Loader2
} from 'lucide-react';

import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend,
    BarChart, Bar
} from 'recharts';
import KPICard from '../../components/admin/KPICard';
import { useGetAdminStatsQuery, useGetRevenueHistoryQuery } from '../../features/admin/adminApi';
import { useGetAreasQuery } from '../../features/areas/areasApi';
import { useGetDealersQuery } from '../../features/dealers/dealersApi';
import { Link } from 'react-router-dom';
import { clsx } from 'clsx';
import { MapPin } from 'lucide-react';

const Dashboard = () => {
    const { data: statsData, isLoading: statsLoading } = useGetAdminStatsQuery();
    const { data: revenueHistory, isLoading: revLoading } = useGetRevenueHistoryQuery('6m');
    const { data: areasData, isLoading: areasLoading } = useGetAreasQuery();
    const { data: dealersData, isLoading: dealersLoading } = useGetDealersQuery();


    const stats = statsData?.data || {};
    const revData = revenueHistory?.data?.revenueHistory || [];
    const catData = revenueHistory?.data?.categoryDistribution || [];
    const recentOrders = stats.recentOrders || [];
    const stockAlerts = stats.stockAlerts || [];

    const COLORS = ['#16a34a', '#22c55e', '#4ade80', '#86efac', '#bbf7d0'];

    if (statsLoading || revLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                <Loader2 className="animate-spin text-primary-600" size={40} />
                <p className="text-gray-500 font-bold animate-pulse">Loading Analytics...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <KPICard 
                    title="Total Revenue" 
                    value={`₹${(stats.totalRevenue || 0).toLocaleString('en-IN')}`} 
                    trend="up" 
                    trendValue={stats.revenueGrowth}
                    icon={<IndianRupee className="text-white" size={24} />}
                    color="bg-primary-600"
                />
                <KPICard 
                    title="Total Orders" 
                    value={stats.totalOrders || 0} 
                    trend="up" 
                    trendValue={stats.ordersGrowth}
                    icon={<ShoppingBag className="text-white" size={24} />}
                    color="bg-blue-500"
                />
                <KPICard 
                    title="Total Customers" 
                    value={stats.totalCustomers || 0} 
                    trend="up" 
                    trendValue={stats.customersGrowth}
                    icon={<Users className="text-white" size={24} />}
                    color="bg-purple-500"
                />
                <KPICard 
                    title="Avg Order Value" 
                    value={`₹${(stats.avgOrderValue || 0).toFixed(2)}`} 
                    trend={stats.avgOrderValueGrowth >= 0 ? "up" : "down"} 
                    trendValue={Math.abs(stats.avgOrderValueGrowth || 0)}
                    icon={<TrendingUp className="text-white" size={24} />}
                    color="bg-orange-500"
                />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* Revenue Chart */}
                <div className="lg:col-span-3 card">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-gray-900">Revenue Over Time</h3>
                        <div className="flex bg-gray-100 p-1 rounded-lg">
                            <button className="px-3 py-1 text-xs font-bold rounded-md bg-white shadow-sm text-primary-600">7D</button>
                            <button className="px-3 py-1 text-xs font-bold text-gray-500 hover:text-gray-700">1M</button>
                            <button className="px-3 py-1 text-xs font-bold text-gray-500 hover:text-gray-700">6M</button>
                        </div>
                    </div>
                    <div className="h-[320px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={revData.length > 0 ? revData : [{ month: 'Empty', revenue: 0 }]}>
                                <defs>
                                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#16a34a" stopOpacity={0.1}/>
                                        <stop offset="95%" stopColor="#16a34a" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#6b7280'}} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#6b7280'}} tickFormatter={(v) => `₹${v/1000}k`} />
                                <Tooltip 
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                                    formatter={(v) => [`₹${v.toLocaleString()}`, 'Revenue']}
                                />
                                <Area type="monotone" dataKey="revenue" stroke="#16a34a" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Category Pie */}
                <div className="lg:col-span-2 card">
                    <h3 className="text-lg font-bold text-gray-900 mb-6">Revenue by Category</h3>
                    <div className="h-[280px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={catData.length > 0 ? catData : [{ name: 'No Data', value: 1 }]}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {catData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                    {catData.length === 0 && <Cell fill="#f3f4f6" />}
                                </Pie>
                                <Tooltip />
                                <Legend verticalAlign="bottom" height={36}/>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-4 text-center">
                        <p className="text-sm text-gray-500">Total processed this month</p>
                        <p className="text-xl font-bold text-gray-900">₹{(stats.totalRevenue || 0).toLocaleString('en-IN')}</p>
                    </div>
                </div>
            </div>

            {/* B2B Performance Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Area Breakdown */}
                <div className="card">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-gray-900">Area-wise Breakdown</h3>
                        <Link to="/admin/areas" className="text-primary-600 text-sm font-bold flex items-center gap-1 hover:gap-2 transition-all">
                            Manage Areas <ArrowRight size={16} />
                        </Link>
                    </div>
                    <div className="space-y-4">
                        {areasLoading ? (
                            <div className="py-10 flex justify-center"><Loader2 className="animate-spin text-primary-200" /></div>
                        ) : areasData?.data?.slice(0, 5).map((area) => (
                            <div key={area._id} className="bg-gray-50 p-4 rounded-2xl flex items-center justify-between group hover:bg-primary-50 transition-all cursor-default">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-primary-600 shadow-sm">
                                        <MapPin size={18} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900">{area.name}</p>
                                        <p className="text-xs text-gray-500">{area.totalShops} Registered Shops</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-black text-gray-900">₹{area.totalRevenue.toLocaleString()}</p>
                                    <p className="text-[10px] font-bold text-primary-600 uppercase tracking-widest">{area.totalOrders} Orders</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Top Dealers */}
                <div className="card">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-gray-900">Top Performing Shops</h3>
                        <Link to="/admin/dealers" className="text-primary-600 text-sm font-bold flex items-center gap-1 hover:gap-2 transition-all">
                            View Network <ArrowRight size={16} />
                        </Link>
                    </div>
                    <div className="space-y-4">
                        {dealersLoading ? (
                            <div className="py-10 flex justify-center"><Loader2 className="animate-spin text-primary-200" /></div>
                        ) : dealersData?.data?.slice(0, 5).map((dealer, index) => (
                            <div key={dealer._id} className="flex items-center justify-between p-4 rounded-2xl border border-gray-50 hover:border-primary-100 transition-all">
                                <div className="flex items-center gap-4">
                                    <div className="w-8 h-8 flex items-center justify-center font-black text-xs bg-gray-900 text-white rounded-full">
                                        {index + 1}
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900">{dealer.shopName}</p>
                                        <p className="text-xs text-gray-400">{dealer.ownerName} • {dealer.area?.name}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-[#16a34a]">₹{dealer.totalSpent.toLocaleString()}</p>
                                    <div className="flex items-center gap-1 justify-end text-[10px] font-bold text-gray-400">
                                        <ShoppingBag size={10} />
                                        <span>{dealer.totalOrders} Orders</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Tables Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Orders */}
                <div className="card">
                    <div className="flex justify-between items-center mb-6">
                         <h3 className="text-lg font-bold text-gray-900">Recent Orders</h3>
                        <Link to="/admin/orders" className="text-primary-600 text-sm font-bold flex items-center gap-1 hover:gap-2 transition-all">
                            View All <ArrowRight size={16} />
                        </Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">
                                    <th className="pb-4">Order ID</th>
                                    <th className="pb-4">Customer/Shop</th>
                                    <th className="pb-4">Amount</th>
                                    <th className="pb-4">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {recentOrders.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="py-8 text-center text-gray-400 font-bold">No orders found.</td>
                                    </tr>
                                ) : recentOrders.map((order) => (
                                    <tr key={order._id} className="group hover:bg-gray-50 transition-colors">
                                        <td className="py-4 text-sm font-bold text-primary-600 uppercase">#{order._id.slice(-6)}</td>
                                        <td className="py-4">
                                            <p className="text-sm font-semibold text-gray-900">{order.shopName || order.user?.name || 'Guest'}</p>
                                            <p className="text-[10px] text-gray-400 uppercase font-black">{order.areaName || 'Direct Order'}</p>
                                        </td>
                                        <td className="py-4 text-sm font-bold text-gray-900">₹{order.totalPrice?.toLocaleString('en-IN')}</td>
                                        <td className="py-4">
                                            <span className={clsx(
                                                "px-3 py-1 rounded-full text-[10px] font-bold uppercase",
                                                order.orderStatus === 'delivered' ? 'bg-green-100 text-green-700' : 
                                                order.orderStatus === 'processing' ? 'bg-purple-100 text-purple-700' :
                                                'bg-amber-100 text-amber-700'
                                            )}>
                                                {order.orderStatus}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Top Selling Products */}
                <div className="card">

                    <h3 className="text-lg font-bold text-gray-900 mb-6">Top Selling Products</h3>
                    <div className="h-[280px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={[
                                // Fallback until actual top sales logic is in place
                                { name: 'Basmati Rice', sales: 45 },
                                { name: 'Sunflower Oil', sales: 38 },
                                { name: 'Turmeric', sales: 32 },
                                { name: 'Wheat Flour', sales: 29 },
                                { name: 'Ghee', sales: 21 },
                            ]} layout="vertical" margin={{ left: 20 }}>
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fontSize: 12, fontWeight: 600}} width={100} />
                                <Tooltip cursor={{fill: 'transparent'}} />
                                <Bar dataKey="sales" fill="#16a34a" radius={[0, 4, 4, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Stock Alerts */}
            {stockAlerts.length > 0 && (
                <div className="bg-red-50 border border-red-100 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="bg-red-500 p-2 rounded-lg text-white">
                            <Package size={20} />
                        </div>
                        <h3 className="text-lg font-bold text-red-900">Stock Alerts</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {stockAlerts.map((item) => (
                            <div key={item._id} className="bg-white p-4 rounded-lg border border-red-100 shadow-sm flex flex-col justify-between">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h4 className="font-bold text-gray-900">{item.name}</h4>
                                        <p className="text-xs text-gray-500">SKU: {item.sku}</p>
                                    </div>
                                    <span className={clsx(
                                        "px-2 py-0.5 rounded text-[10px] font-bold uppercase",
                                        item.stock === 0 ? "bg-red-100 text-red-700" : "bg-orange-100 text-orange-700"
                                    )}>
                                        {item.stock === 0 ? 'Out of Stock' : 'Low Stock'}
                                    </span>
                                </div>
                                <div className="mt-4 flex items-center justify-between">
                                    <p className="text-sm font-semibold">Stock: <span className="text-red-600 font-bold">{item.stock}</span> / 10</p>
                                    <button className="text-xs font-bold bg-primary-600 text-white px-3 py-1.5 rounded-md hover:bg-primary-700 transition-colors">
                                        Update
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};


export default Dashboard;

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
import { clsx } from 'clsx';

const Reports = () => {
    const { data: statsData, isLoading: statsLoading } = useGetAdminStatsQuery();
    const { data: revenueData, isLoading: revLoading } = useGetRevenueHistoryQuery('1m');

    const stats = statsData?.data || {};
    const chartData = revenueData?.data?.revenueHistory || [];
    const categories = revenueData?.data?.categoryDistribution || [];

    if (statsLoading || revLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                <Loader2 className="animate-spin text-primary-600" size={40} />
                <p className="text-gray-500 font-bold animate-pulse">Generating Reports...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 font-jakarta">Business Analytics & Reports</h2>
                    <p className="text-sm text-gray-500 mt-1">Deep dive into your performance metrics</p>
                </div>
                <div className="flex gap-2">
                    <button className="bg-white border border-gray-200 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-gray-50 transition-all">
                        <Calendar size={18} /> Last 30 Days <ChevronDown size={14} />
                    </button>
                    <div className="flex bg-primary-600 rounded-lg overflow-hidden border border-primary-600">
                        <button className="px-4 py-2 text-white text-sm font-bold flex items-center gap-2 hover:bg-primary-700 transition-all">
                            <FileText size={18} /> Download PDF
                        </button>
                    </div>
                </div>
            </div>

            {/* Analysis Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue Report */}
                <div className="card">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">Revenue Report</h3>
                            <p className="text-sm text-gray-500">Weekly revenue overview</p>
                        </div>
                        <div className="text-right">
                            <p className="text-2xl font-black text-primary-600">₹{(stats.totalRevenue || 0).toLocaleString('en-IN')}</p>
                            <p className="text-xs font-bold text-green-500 flex items-center justify-end gap-1"><ArrowUpRight size={14} /> {stats.revenueGrowth || 0}%</p>
                        </div>
                    </div>
                    <div className="h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData.length > 0 ? chartData : [{ name: 'N/A', revenue: 0 }]}>
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#6b7280'}} />
                                <YAxis hide />
                                <Tooltip />
                                <Area type="monotone" dataKey="revenue" stroke="#16a34a" strokeWidth={3} fill="#16a34a" fillOpacity={0.05} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Orders Report */}
                <div className="card">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">Orders Fulfillment</h3>
                            <p className="text-sm text-gray-500">Order trends by day</p>
                        </div>
                        <div className="text-right">
                            <p className="text-2xl font-black text-blue-600">{stats.totalOrders || 0}</p>
                            <p className="text-xs font-bold text-green-500 flex items-center justify-end gap-1"><ArrowUpRight size={14} /> {stats.ordersGrowth || 0}%</p>
                        </div>
                    </div>
                    <div className="h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData.length > 0 ? chartData : [{ name: 'N/A', orders: 0 }]}>
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#6b7280'}} />
                                <YAxis hide />
                                <Tooltip />
                                <Bar dataKey="orders" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Top Products */}
                <div className="card">
                    <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <TrendingUp size={20} className="text-primary-600" />
                        Top Performing Products
                    </h3>
                    <div className="space-y-4">
                        {(stats.topProducts || [
                            { name: 'Basmati Rice Premium', sales: '840 units', revenue: '₹1,00,800', share: '24%' },
                            { name: 'Sunflower Oil 5L', sales: '520 units', revenue: '₹83,200', share: '18%' },
                        ]).map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-green-50 transition-colors">
                                <div>
                                    <p className="text-sm font-bold text-gray-900">{item.name}</p>
                                    <p className="text-[10px] text-gray-500 font-bold uppercase">{item.sales || 'Dynamic Sales'}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-black text-gray-900">{item.revenue || '₹0'}</p>
                                    <p className="text-[10px] text-primary-600 font-bold">{item.share || '0%'} share</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Category Growth */}
                <div className="card">
                    <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <PieIcon size={20} className="text-purple-600" />
                        Category Performance
                    </h3>
                    <div className="space-y-5">
                        {categories.length === 0 ? (
                            <p className="text-center text-gray-400 py-10">No category data available.</p>
                        ) : categories.map((cat, idx) => (
                            <div key={idx}>
                                <div className="flex justify-between text-xs font-bold mb-1.5 uppercase">
                                    <span className="text-gray-500">{cat.name}</span>
                                    <span className="text-green-600">+{(cat.value / 10).toFixed(1)}%</span>
                                </div>
                                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <div 
                                        className="h-full bg-primary-600 transition-all duration-1000" 
                                        style={{ width: `${cat.value}%` }}
                                    ></div>
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

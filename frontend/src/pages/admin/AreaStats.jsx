import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
    ChevronLeft, MapPin, Store, ShoppingBag, IndianRupee, 
    Clock, Search, Download, Filter, TrendingUp, CheckCircle,
    Loader2, MoreVertical, Eye
} from 'lucide-react';
import { useGetAreaStatsQuery } from '../../features/areas/areasApi';
import { motion } from 'framer-motion';

const AreaStats = () => {
    const { id } = useParams();
    const { data: result, isLoading } = useGetAreaStatsQuery(id);
    const area = result?.data;

    if (isLoading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary-600" size={40} /></div>;
    if (!area) return <div className="text-center py-20 text-gray-500 font-bold">Area not found</div>;

    const summaryStats = [
        { label: 'Active Shops', value: area.totalShops, icon: <Store />, color: 'bg-blue-500' },
        { label: 'Total Orders', value: area.totalOrders, icon: <ShoppingBag />, color: 'bg-indigo-500' },
        { label: 'Total Revenue', value: `₹${area.totalRevenue.toLocaleString('en-IN')}`, icon: <IndianRupee />, color: 'bg-[#16a34a]' },
        { label: 'Pending Orders', value: area.pendingOrders, icon: <Clock />, color: 'bg-[#ea580c]' },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <Link to="/admin/areas" className="bg-white p-3 rounded-2xl border border-gray-100 text-gray-400 hover:text-primary-600 hover:border-primary-100 transition-all shadow-sm">
                        <ChevronLeft size={20} />
                    </Link>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <div className="w-8 h-8 bg-primary-100 text-primary-600 rounded-lg flex items-center justify-center">
                                <MapPin size={18} />
                            </div>
                            <h1 className="text-2xl font-black text-gray-900 font-jakarta">{area.areaName} Performance</h1>
                        </div>
                        <p className="text-gray-500 text-sm">Detailed performance analytics for this delivery zone</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 bg-white border border-gray-200 text-gray-600 px-6 py-3 rounded-2xl font-bold hover:bg-gray-50 transition-all">
                        <Download size={18} />
                        Export Report
                    </button>
                    <button className="flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-2xl font-bold hover:bg-black transition-all shadow-lg shadow-gray-200">
                        <TrendingUp size={18} />
                        Area Growth Analysis
                    </button>
                </div>
            </div>

            {/* Area Stats Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {summaryStats.map((stat, i) => (
                    <motion.div 
                        key={stat.label}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm relative overflow-hidden group"
                    >
                        <div className={`absolute -top-6 -right-6 w-24 h-24 ${stat.color} opacity-5 rounded-full group-hover:scale-150 transition-transform duration-500`} />
                        <div className={`w-12 h-12 ${stat.color} text-white rounded-2xl flex items-center justify-center mb-4 shadow-xl shadow-gray-100`}>
                            {React.cloneElement(stat.icon, { size: 20 })}
                        </div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
                        <h3 className="text-2xl font-black text-gray-900 group-hover:text-primary-600 transition-colors">{stat.value}</h3>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Shops in this Area */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm overflow-hidden">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xl font-bold text-gray-900">Shops In This Area</h3>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                                <input 
                                    type="text" 
                                    placeholder="Filter shops..." 
                                    className="bg-gray-50 border-none rounded-xl py-2 pl-9 pr-4 text-xs font-bold w-48 focus:ring-2 focus:ring-primary-600"
                                />
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-gray-50">
                                        <th className="pb-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Shop Name</th>
                                        <th className="pb-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Owner</th>
                                        <th className="pb-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Orders</th>
                                        <th className="pb-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Revenue</th>
                                        <th className="pb-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {area.shops.map((shop) => (
                                        <tr key={shop._id} className="group hover:bg-gray-50/50 transition-colors">
                                            <td className="py-5">
                                                <Link to={`/admin/dealers/${shop._id}`} className="font-bold text-sm text-gray-900 hover:text-primary-600 transition-colors">
                                                    {shop.shopName}
                                                </Link>
                                            </td>
                                            <td className="py-5 text-sm text-gray-500 font-medium">{shop.ownerName}</td>
                                            <td className="py-5">
                                                <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-black">
                                                    {shop.ordersCount}
                                                </span>
                                            </td>
                                            <td className="py-5 font-black text-sm text-gray-900">
                                                ₹{shop.totalSpent.toLocaleString('en-IN')}
                                            </td>
                                            <td className="py-5 text-right">
                                                <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-md ${shop.isApproved ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                                                    {shop.isApproved ? 'Approved' : 'Pending'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Area Distribution / Summary */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-gray-900 text-white rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 text-white opacity-5">
                            <TrendingUp size={120} />
                        </div>
                        <h3 className="text-xl font-bold mb-8 relative">Area Summary</h3>
                        <div className="space-y-8 relative">
                            <div className="flex items-end justify-between">
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Weekly Growth</p>
                                    <div className="flex items-center gap-2">
                                        <div className="bg-[#16a34a] p-1 rounded-md">
                                            <TrendingUp size={12} />
                                        </div>
                                        <span className="text-2xl font-black">+14.2%</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Avg Order Value</p>
                                    <span className="text-xl font-bold">₹{(area.totalRevenue / (area.totalOrders || 1)).toLocaleString('en-IN')}</span>
                                </div>
                            </div>
                            
                            <div className="pt-8 border-t border-white/10 space-y-6">
                                <div>
                                    <div className="flex justify-between text-xs font-bold mb-2">
                                        <span className="text-gray-400 uppercase">Approval Completion</span>
                                        <span className="text-primary-400">{Math.round((area.shops.filter(s => s.isApproved).length / (area.shops.length || 1)) * 100)}%</span>
                                    </div>
                                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                                        <div 
                                            className="h-full bg-primary-600 rounded-full" 
                                            style={{ width: `${(area.shops.filter(s => s.isApproved).length / (area.shops.length || 1)) * 100}%` }}
                                        />
                                    </div>
                                </div>

                                <div className="bg-white/5 p-6 rounded-3xl border border-white/5">
                                    <h4 className="text-sm font-bold mb-4 flex items-center gap-2">
                                        <Clock size={16} className="text-primary-400" />
                                        Area Action Items
                                    </h4>
                                    <ul className="space-y-4">
                                        <li className="flex items-center gap-3 text-xs text-gray-400">
                                            <div className="w-1.5 h-1.5 bg-orange-500 rounded-full" />
                                            {area.pendingOrders} orders awaiting confirmation
                                        </li>
                                        <li className="flex items-center gap-3 text-xs text-gray-400">
                                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                                            {area.shops.filter(s => !s.isApproved).length} shop registrations pending
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm">
                        <h3 className="text-lg font-bold text-gray-900 mb-6 font-jakarta">Area Health Check</h3>
                        <div className="flex items-center gap-4 p-4 bg-green-50 rounded-2xl border border-green-100 mb-4">
                            <div className="bg-[#16a34a] text-white p-2 rounded-lg">
                                <CheckCircle size={18} />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-[#16a34a]">Logistics Status</p>
                                <p className="text-sm font-black text-green-900 font-jakarta">Ready for Deliveries</p>
                            </div>
                        </div>
                        <p className="text-xs text-gray-500 leading-relaxed font-medium">
                            Currently serving this area with 3 delivery vehicles. Next scheduled bulk supply drop is tomorrow morning.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AreaStats;

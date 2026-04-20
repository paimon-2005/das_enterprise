import React from 'react';
import { Search, UserPlus, Mail, Smartphone, Calendar, Download, MoreHorizontal, Loader2 } from 'lucide-react';

import { useGetAdminCustomersQuery, useGetAdminStatsQuery } from '../../features/admin/adminApi';

const Customers = () => {
    const { data: customersData, isLoading: customersLoading } = useGetAdminCustomersQuery();
    const { data: statsData, isLoading: statsLoading } = useGetAdminStatsQuery();

    const customers = customersData?.data || [];
    const stats = statsData?.data || {};

    if (customersLoading || statsLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                <Loader2 className="animate-spin text-primary-600" size={40} />
                <p className="text-gray-500 font-bold animate-pulse">Fetching Customers...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 font-jakarta">Customer Management</h2>
                    <p className="text-sm text-gray-500 mt-1">View insights and manage your customer accounts</p>
                </div>
                <div className="flex gap-2">
                    <button className="bg-white border border-gray-200 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-gray-50 transition-all">
                        <Download size={18} /> Export CSV
                    </button>
                    <button className="btn-primary flex items-center gap-2">
                        <UserPlus size={18} /> Add Customer
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'Total Customers', value: stats.totalCustomers || 0, trend: `+${stats.customersGrowth || 0}% this month` },
                    { label: 'Active Customers', value: stats.activeCustomers || stats.totalCustomers || 0, trend: 'Dynamic count' },
                    { label: 'New This Month', value: Math.round((stats.totalCustomers || 0) * 0.08), trend: 'Estimated' },
                    { label: 'Total Revenue', value: `₹${(stats.totalRevenue || 0).toLocaleString('en-IN')}`, trend: 'From all orders' },
                ].map((stat, i) => (
                    <div key={i} className="card !p-5">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{stat.label}</p>
                        <p className="text-2xl font-black text-gray-900 mt-1">{stat.value}</p>
                        <p className="text-[10px] font-bold text-primary-600 mt-2">{stat.trend}</p>
                    </div>
                ))}
            </div>

            {/* Table */}
            <div className="card !p-0">
                <div className="p-4 border-b border-gray-100">
                    <div className="relative max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search by name or email..." 
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-lg outline-none focus:ring-2 focus:ring-primary-100 text-sm"
                        />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50">
                            <tr className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                                <th className="px-6 py-4">Customer</th>
                                <th className="px-6 py-4">Contact</th>
                                <th className="px-6 py-4">Orders</th>
                                <th className="px-6 py-4">Total Spent</th>
                                <th className="px-6 py-4">Last Order</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {customers.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="px-6 py-20 text-center text-gray-400 font-bold">No customers found in database.</td>
                                </tr>
                            ) : customers.map((customer) => (
                                <tr key={customer._id} className="hover:bg-gray-50 transition-colors cursor-pointer">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold overflow-hidden">
                                                <img src={`https://ui-avatars.com/api/?name=${customer.name}&background=dcfce7&color=16a34a`} alt="" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-gray-900">{customer.name}</p>
                                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">ID: #{customer._id.slice(-6).toUpperCase()}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
                                                <Mail size={12} className="text-gray-400" /> {customer.email}
                                            </div>
                                            <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
                                                <Smartphone size={12} className="text-gray-400" /> {customer.phone || 'No phone'}

                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-sm font-black text-gray-900">{customer.totalOrders || 0}</p>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-black text-gray-900">₹{(customer.totalSpent || 0).toLocaleString('en-IN')}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500">
                                            <Calendar size={12} className="text-gray-400" /> {customer.lastOrderDate ? new Date(customer.lastOrderDate).toLocaleDateString() : 'Never'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${customer.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                            {customer.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <button className="p-2 hover:bg-white hover:shadow-sm rounded-lg text-gray-400 hover:text-primary-600 transition-all">
                                            <MoreHorizontal size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Customers;

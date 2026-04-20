import React, { useState } from 'react';
import { 
    Users, ShieldCheck, Clock, IndianRupee, Search, Filter, 
    MoreVertical, Eye, CheckCircle, XCircle, CreditCard, 
    MessageCircle, MapPin, Loader2, ChevronRight
} from 'lucide-react';
import { useGetDealersQuery, useApproveDealerMutation, useRejectDealerMutation } from '../../features/dealers/dealersApi';
import { useGetAreasQuery } from '../../features/areas/areasApi';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Dealers = () => {
    const [filters, setFilters] = useState({
        search: '',
        area: '',
        isApproved: '',
        paymentTerm: ''
    });

    const { data: dealersResult, isLoading } = useGetDealersQuery(filters);
    const { data: areasResult } = useGetAreasQuery();
    
    const dealers = dealersResult?.data || [];
    const stats = dealersResult?.stats || { total: 0, approved: 0, pending: 0, totalDues: 0 };
    const areas = areasResult?.data || [];

    const [approveDealer] = useApproveDealerMutation();
    const [rejectDealer] = useRejectDealerMutation();

    const handleApprove = async (id) => {
        try {
            await approveDealer(id).unwrap();
            toast.success('Dealer approved successfully');
        } catch (err) {
            toast.error(err?.data?.message || 'Failed to approve');
        }
    };

    const handleReject = async (id) => {
        if (window.confirm('Are you sure you want to reject/suspend this dealer?')) {
            try {
                await rejectDealer(id).unwrap();
                toast.success('Dealer status updated');
            } catch (err) {
                toast.error(err?.data?.message || 'Failed to reject');
            }
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="animate-spin text-primary-600" size={40} />
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-black text-gray-900 font-jakarta">B2B Network Management</h1>
                <p className="text-gray-500 text-sm mt-1">Monitor your shops, dealers and B2B financial growth</p>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Total Shops', value: stats.total, icon: <Users size={20} />, color: 'bg-blue-600' },
                    { label: 'Approved', value: stats.approved, icon: <CheckCircle size={20} />, color: 'bg-[#16a34a]' },
                    { label: 'Pending Approval', value: stats.pending, icon: <Clock size={20} />, color: 'bg-[#ea580c]' },
                    { label: 'Total Outstandings', value: `₹${stats.totalDues.toLocaleString('en-IN')}`, icon: <IndianRupee size={20} />, color: 'bg-purple-600' },
                ].map((stat, i) => (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        key={stat.label} 
                        className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm"
                    >
                        <div className={`w-12 h-12 ${stat.color} text-white rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-gray-200`}>
                            {stat.icon}
                        </div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
                        <h3 className="text-2xl font-black text-gray-900">{stat.value}</h3>
                    </motion.div>
                ))}
            </div>

            {/* Pending Approvals Section */}
            {dealers.some(d => !d.isApproved) && (
                <div className="bg-[#fff7ed] rounded-[2.5rem] p-8 border border-orange-100">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="bg-[#ea580c] text-white p-2 rounded-lg">
                                <ShieldCheck size={20} />
                            </div>
                            <h2 className="text-xl font-bold text-[#9a3412]">Registration Requests</h2>
                        </div>
                        <span className="bg-[#fb923c] text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                            Action Required
                        </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {dealers.filter(d => !d.isApproved).map((dealer) => (
                            <div key={dealer._id} className="bg-white p-6 rounded-3xl shadow-sm border border-orange-100 flex items-center justify-between hover:shadow-md transition-all">
                                <div>
                                    <h4 className="font-bold text-gray-900">{dealer.shopName}</h4>
                                    <p className="text-sm text-gray-500">{dealer.ownerName} • {dealer.area?.name}</p>
                                </div>
                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => handleApprove(dealer._id)}
                                        className="bg-[#16a34a] text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-green-700 transition-all"
                                    >
                                        Approve
                                    </button>
                                    <button 
                                        onClick={() => handleReject(dealer._id)}
                                        className="bg-red-50 text-red-600 px-4 py-2 rounded-xl text-xs font-bold hover:bg-red-100 transition-all"
                                    >
                                        Reject
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Main Content Card */}
            <div className="bg-white rounded-[3rem] shadow-sm border border-gray-100 overflow-hidden">
                {/* Filter Bar */}
                <div className="p-8 border-b border-gray-50 bg-gray-50/30 flex flex-wrap items-center gap-4">
                    <div className="relative flex-1 min-w-[300px]">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search shop by name or owner..."
                            value={filters.search}
                            onChange={(e) => setFilters({...filters, search: e.target.value})}
                            className="w-full bg-white border-none rounded-2xl py-3 pl-12 pr-4 text-sm font-medium focus:ring-2 focus:ring-primary-600 shadow-sm"
                        />
                    </div>
                    
                    <select 
                        value={filters.area}
                        onChange={(e) => setFilters({...filters, area: e.target.value})}
                        className="bg-white border-none rounded-2xl py-3 px-6 text-sm font-medium focus:ring-2 focus:ring-primary-600 shadow-sm cursor-pointer"
                    >
                        <option value="">All Areas</option>
                        {areas.map(area => (
                            <option key={area._id} value={area._id}>{area.name}</option>
                        ))}
                    </select>

                    <select 
                        value={filters.paymentTerm}
                        onChange={(e) => setFilters({...filters, paymentTerm: e.target.value})}
                        className="bg-white border-none rounded-2xl py-3 px-6 text-sm font-medium focus:ring-2 focus:ring-primary-600 shadow-sm cursor-pointer"
                    >
                        <option value="">All Terms</option>
                        <option value="cash">Cash Only</option>
                        <option value="credit">Credit Basis</option>
                        <option value="weekly">Weekly Settlement</option>
                    </select>

                    <button className="flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-2xl text-sm font-bold active:scale-95 transition-all">
                        <Filter size={18} />
                        Filter
                    </button>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-gray-50">
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Shop & Owner</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Area</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Phone</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Credit Details</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {dealers.map((dealer) => (
                                <tr key={dealer._id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-primary-100 flex items-center justify-center text-primary-600 font-bold">
                                                {dealer.shopName.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900">{dealer.shopName}</p>
                                                <p className="text-xs text-gray-500">{dealer.ownerName}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                                            {dealer.area?.name || 'Unassigned'}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <a href={`https://wa.me/91${dealer.phone}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-[#16a34a] hover:underline font-bold text-sm">
                                            <MessageCircle size={16} />
                                            {dealer.phone}
                                        </a>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="space-y-1 text-sm">
                                            <p className="text-gray-400">Limit: <span className="text-gray-900 font-bold">₹{dealer.creditLimit.toLocaleString('en-IN')}</span></p>
                                            <p className={dealer.currentDue > 0 ? "text-red-500 font-black" : "text-gray-400"}>
                                                Due: ₹{dealer.currentDue.toLocaleString('en-IN')}
                                            </p>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        {dealer.isApproved ? (
                                            <span className="flex items-center gap-1.5 text-[#16a34a] font-bold text-xs">
                                                <CheckCircle size={14} /> Approved
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-1.5 text-[#ea580c] font-bold text-xs">
                                                <Clock size={14} /> Pending
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link to={`/admin/dealers/${dealer._id}`} className="bg-gray-50 p-2.5 rounded-xl hover:bg-primary-50 text-gray-400 hover:text-primary-600 transition-all">
                                                <Eye size={18} />
                                            </Link>
                                            <button className="bg-gray-50 p-2.5 rounded-xl text-gray-400 hover:bg-gray-100 transition-all">
                                                <MoreVertical size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                
                {dealers.length === 0 && (
                    <div className="py-20 text-center">
                        <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Users size={32} className="text-gray-300" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">No Dealers Found</h3>
                        <p className="text-gray-500">Try adjusting your filters or search terms.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dealers;

import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
    ChevronLeft, Store, User, MapPin, Phone, FileText, 
    CreditCard, Calendar, CheckCircle, Clock, XCircle, 
    IndianRupee, ShoppingBag, TrendingUp, Filter, MoreHorizontal,
    MessageCircle, ExternalLink, Loader2
} from 'lucide-react';
import { useGetDealerQuery, useUpdateDealerCreditMutation, useApproveDealerMutation, useRejectDealerMutation } from '../../features/dealers/dealersApi';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';

const DealerDetail = () => {
    const { id } = useParams();
    const { data: result, isLoading } = useGetDealerQuery(id);
    const dealer = result?.data;
    
    const [updateCredit, { isLoading: isUpdatingCredit }] = useUpdateDealerCreditMutation();
    const [approveDealer] = useApproveDealerMutation();
    const [rejectDealer] = useRejectDealerMutation();

    const [creditForm, setCreditForm] = useState({
        creditLimit: dealer?.creditLimit || 0,
        paymentTerm: dealer?.paymentTerm || 'cash'
    });

    const handleUpdateFinancials = async (e) => {
        e.preventDefault();
        try {
            await updateCredit({ id, ...creditForm }).unwrap();
            toast.success('Financial terms updated');
        } catch (err) {
            toast.error(err?.data?.message || 'Update failed');
        }
    };

    if (isLoading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary-600" size={40} /></div>;
    if (!dealer) return <div className="text-center py-20 text-gray-500 font-bold">Dealer not found</div>;

    const stats = [
        { label: 'Total Orders', value: dealer.stats.totalOrders, icon: <ShoppingBag />, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Current Dues', value: `₹${dealer.currentDue.toLocaleString('en-IN')}`, icon: <IndianRupee />, color: 'text-red-600', bg: 'bg-red-50' },
        { label: 'Total Spent', value: `₹${dealer.stats.totalSpent.toLocaleString('en-IN')}`, icon: <TrendingUp />, color: 'text-green-600', bg: 'bg-green-50' },
        { label: 'This Month', value: `₹${dealer.stats.thisMonthSpent.toLocaleString('en-IN')}`, icon: <Calendar />, color: 'text-purple-600', bg: 'bg-purple-50' },
    ];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header / Breadcrumbs */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Link to="/admin/dealers" className="bg-white p-3 rounded-2xl border border-gray-100 text-gray-400 hover:text-primary-600 hover:border-primary-100 transition-all shadow-sm">
                        <ChevronLeft size={20} />
                    </Link>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <h1 className="text-2xl font-black text-gray-900 font-jakarta">{dealer.shopName}</h1>
                            {dealer.isApproved ? (
                                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                                    <CheckCircle size={10} /> Approved
                                </span>
                            ) : (
                                <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                                    <Clock size={10} /> Pending
                                </span>
                            )}
                        </div>
                        <p className="text-gray-500 text-sm">Managing Dealer Profile #{dealer._id.slice(-6)}</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <a 
                        href={`https://wa.me/91${dealer.phone}`} 
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-[#16a34a] text-white px-6 py-3 rounded-2xl font-bold hover:bg-green-700 transition-all shadow-lg shadow-green-900/10"
                    >
                        <MessageCircle size={18} />
                        <span>WhatsApp Chat</span>
                    </a>
                    {!dealer.isApproved && (
                        <button 
                            onClick={() => approveDealer(dealer._id)}
                            className="flex-1 md:flex-none bg-primary-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-primary-700 transition-all shadow-lg shadow-primary-900/10"
                        >
                            Approve Registration
                        </button>
                    )}
                </div>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <motion.div 
                        key={stat.label}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-all"
                    >
                        <div className={`w-10 h-10 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center mb-4`}>
                            {React.cloneElement(stat.icon, { size: 20 })}
                        </div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
                        <h3 className="text-2xl font-black text-gray-900">{stat.value}</h3>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Information Info */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 text-gray-50 opacity-10">
                            <Store size={120} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-6 relative">Shop Profile</h3>
                        <div className="space-y-6 relative">
                            {[
                                { icon: <User />, label: 'Owner Name', value: dealer.ownerName },
                                { icon: <MapPin />, label: 'Delivery Area', value: dealer.area?.name || 'Not assigned' },
                                { icon: <Phone />, label: 'Phone Number', value: dealer.phone },
                                { icon: <FileText />, label: 'GST Number', value: dealer.gstNumber || 'N/A' },
                                { icon: <CreditCard />, label: 'Business Type', value: dealer.businessType },
                                { icon: <Calendar />, label: 'Member Since', value: new Date(dealer.createdAt).toLocaleDateString() },
                            ].map((item) => (
                                <div key={item.label} className="flex gap-4">
                                    <div className="text-gray-400 mt-1">{React.cloneElement(item.icon, { size: 18 })}</div>
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{item.label}</p>
                                        <p className="text-sm font-bold text-gray-900">{item.value}</p>
                                    </div>
                                </div>
                            ))}
                            <div className="pt-6 border-t border-gray-50">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Shop Address</p>
                                <p className="text-sm font-medium text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-2xl italic">
                                    "{dealer.shopAddress}"
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Financial Terms Card */}
                    <div className="bg-gray-900 text-white rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
                        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-primary-600/20 blur-[60px] rounded-full" />
                        <h3 className="text-xl font-bold mb-6 relative">Financial Controls</h3>
                        <form onSubmit={handleUpdateFinancials} className="space-y-6 relative">
                            <div>
                                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Credit Limit (₹)</label>
                                <input 
                                    type="number"
                                    defaultValue={dealer.creditLimit}
                                    onChange={(e) => setCreditForm({ ...creditForm, creditLimit: Number(e.target.value) })}
                                    className="w-full bg-white/10 border border-white/10 rounded-2xl p-4 text-white focus:ring-2 focus:ring-primary-500 transition-all font-bold"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Payment Term</label>
                                <select 
                                    defaultValue={dealer.paymentTerm}
                                    onChange={(e) => setCreditForm({ ...creditForm, paymentTerm: e.target.value })}
                                    className="w-full bg-white/10 border border-white/10 rounded-2xl p-4 text-white focus:ring-2 focus:ring-primary-500 transition-all font-bold cursor-pointer"
                                >
                                    <option value="cash" className="text-gray-900">Cash Basis</option>
                                    <option value="credit" className="text-gray-900">Credit Basis</option>
                                    <option value="weekly" className="text-gray-900">Weekly Settlement</option>
                                </select>
                            </div>
                            <button 
                                disabled={isUpdatingCredit}
                                className="w-full bg-primary-600 hover:bg-primary-700 text-white py-4 rounded-2xl font-black transition-all active:scale-[0.98] shadow-lg shadow-primary-900/40"
                            >
                                {isUpdatingCredit ? 'Updating...' : 'Update Financial Terms'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Orders History */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xl font-bold text-gray-900">Recent Order History</h3>
                            <button className="text-primary-600 hover:text-primary-700 font-bold text-sm flex items-center gap-1">
                                View Full History <ExternalLink size={14} />
                            </button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-gray-50">
                                        <th className="pb-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Order ID</th>
                                        <th className="pb-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Date</th>
                                        <th className="pb-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Amount</th>
                                        <th className="pb-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Payment</th>
                                        <th className="pb-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {dealer.orderHistory.length > 0 ? (
                                        dealer.orderHistory.map((order) => (
                                            <tr key={order._id} className="hover:bg-gray-50/50 transition-colors">
                                                <td className="py-5 font-bold text-sm text-gray-900 uppercase">#{order._id.slice(-6)}</td>
                                                <td className="py-5 text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString('en-GB')}</td>
                                                <td className="py-5 font-black text-sm text-gray-900">₹{order.totalPrice.toLocaleString('en-IN')}</td>
                                                <td className="py-5">
                                                    <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-md ${order.isPaid ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                        {order.paymentMethod}
                                                    </span>
                                                </td>
                                                <td className="py-5 text-right">
                                                    <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full ${
                                                        order.orderStatus === 'delivered' ? 'bg-[#16a34a] text-white' : 
                                                        order.orderStatus === 'pending' ? 'bg-[#ea580c] text-white' : 'bg-gray-200 text-gray-600'
                                                    }`}>
                                                        {order.orderStatus}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="py-12 text-center text-gray-400 font-medium">No order history available for this dealer.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Pending Dues Section (If any) */}
                    {dealer.currentDue > 0 && (
                        <div className="bg-red-50 border border-red-100 rounded-[2.5rem] p-8 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="bg-red-500 text-white p-3 rounded-2xl shadow-lg shadow-red-200">
                                    <XCircle size={24} />
                                </div>
                                <div>
                                    <p className="text-xs font-black text-red-400 uppercase tracking-widest">Overdue Payment Alert</p>
                                    <h4 className="text-xl font-black text-red-700">₹{dealer.currentDue.toLocaleString('en-IN')} Outstanding</h4>
                                </div>
                            </div>
                            <button className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-2xl font-bold transition-all active:scale-95 shadow-lg shadow-red-900/20">
                                Send Reminder
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DealerDetail;

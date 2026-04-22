import React, { useState } from 'react';
import { useGetShopsQuery, useUpdateShopCreditMutation } from '../../features/admin/adminApi';
import { 
    Search, Store, User, CreditCard, CheckCircle2, XCircle,
    MapPin, Phone, TrendingUp, Loader2, Filter, X
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const AdminShops = () => {
    const [filters, setFilters] = useState({ area: '', paymentTerm: '', isActive: '' });
    const [searchTerm, setSearchTerm] = useState('');

    const { data: shopData, isLoading } = useGetShopsQuery(filters);
    const AREAS = ['Mogra', 'Jirat', 'Kuntighat'];
    const [updateShop, { isLoading: isUpdating }] = useUpdateShopCreditMutation();
    const [editingShop, setEditingShop] = useState(null);

    const shops = shopData?.shops || [];
    const filteredShops = shops.filter(s => 
        s.shopName.toLowerCase().includes(searchTerm.toLowerCase()) || 
        s.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleUpdateShop = async (id, data) => {
        try {
            await updateShop({ id, ...data }).unwrap();
            toast.success("Shop updated successfully!");
            setEditingShop(null);
        } catch (err) {
            toast.error(err?.data?.message || "Failed to update shop");
        }
    };

    if (isLoading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
                <Loader2 className="w-12 h-12 text-[#16a34a] animate-spin mx-auto mb-4" />
                <p className="text-gray-400 font-medium">Loading shop partners...</p>
            </div>
        </div>
    );

    return (
        <div className="p-6 lg:p-8 space-y-6 bg-gray-50 min-h-screen">

            {/* Header */}
            <div className="bg-white border-2 border-gray-100 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
                <div>
                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Admin</p>
                    <h1 className="text-3xl font-black text-gray-900">
                        Shop <span className="text-[#16a34a]">Partners</span>
                    </h1>
                    <p className="text-gray-400 text-sm font-medium mt-1">{filteredShops.length} shops in network</p>
                </div>
                <div className="relative">
                    <Search className="absolute left-3.5 top-3 w-5 h-5 text-gray-400" />
                    <input 
                        type="text"
                        placeholder="Search shops or owners..."
                        className="bg-gray-50 border-2 border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-[#16a34a] w-full md:w-72 font-medium"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Filter Bar */}
            <div className="bg-white border-2 border-gray-100 p-4 rounded-2xl flex flex-wrap gap-3 items-center shadow-sm">
                <div className="flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-widest">
                    <Filter className="w-4 h-4" /> Filters:
                </div>
                <select 
                    className="bg-gray-50 border-2 border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 outline-none focus:border-[#16a34a] font-bold cursor-pointer"
                    value={filters.area}
                    onChange={(e) => setFilters(f => ({...f, area: e.target.value}))}
                >
                    <option value="">Area: All</option>
                    {AREAS.map(a => <option key={a} value={a}>{a}</option>)}
                </select>
                <select 
                    className="bg-gray-50 border-2 border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 outline-none focus:border-[#16a34a] font-bold cursor-pointer"
                    value={filters.paymentTerm}
                    onChange={(e) => setFilters(f => ({...f, paymentTerm: e.target.value}))}
                >
                    <option value="">Terms: All</option>
                    {['cash', 'credit', 'weekly'].map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                </select>
                <select 
                    className="bg-gray-50 border-2 border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 outline-none focus:border-[#16a34a] font-bold cursor-pointer"
                    value={filters.isActive}
                    onChange={(e) => setFilters(f => ({...f, isActive: e.target.value}))}
                >
                    <option value="">Status: All</option>
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                </select>
            </div>

            {/* Shops Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {filteredShops.map(shop => (
                    <div key={shop._id} className={`bg-white border-2 border-gray-100 rounded-2xl p-6 space-y-5 transition-all hover:border-[#16a34a]/30 hover:shadow-md group ${!shop.isActive && 'opacity-60 grayscale'}`}>
                        
                        {/* Shop Header */}
                        <div className="flex justify-between items-start">
                            <div className="flex gap-4 items-center">
                                <div className="w-13 h-13 w-12 h-12 bg-[#16a34a] rounded-2xl flex items-center justify-center text-xl font-black text-white shadow-md shadow-green-200 shrink-0">
                                    {shop.shopName.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="font-black text-gray-900 text-base tracking-tight">{shop.shopName}</h3>
                                    <p className="text-xs text-[#16a34a] font-black uppercase tracking-wider mt-0.5">{shop.area || 'Generic'}</p>
                                </div>
                            </div>
                            <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border-2 ${
                                shop.isActive 
                                    ? 'bg-green-50 text-green-700 border-green-200' 
                                    : 'bg-red-50 text-red-600 border-red-200'
                            }`}>
                                {shop.isActive ? 'Active' : 'Banned'}
                            </span>
                        </div>

                        {/* Owner & Contact */}
                        <div className="grid grid-cols-2 gap-3 pt-3 border-t-2 border-gray-50">
                            <div className="bg-gray-50 p-3 rounded-xl">
                                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest flex items-center gap-1 mb-1">
                                    <User className="w-3 h-3 text-[#16a34a]" /> Owner
                                </p>
                                <p className="text-sm font-bold text-gray-900">{shop.name}</p>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-xl">
                                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest flex items-center gap-1 mb-1">
                                    <Phone className="w-3 h-3 text-[#16a34a]" /> Contact
                                </p>
                                <p className="text-sm font-bold text-gray-900 tracking-wide">{shop.phone}</p>
                            </div>
                        </div>

                        {/* Financials */}
                        <div className="bg-gray-50 border-2 border-gray-100 p-4 rounded-xl space-y-3">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Current Due</p>
                                    <p className="text-xl font-black text-red-600">₹{shop.currentDue?.toLocaleString('en-IN') || 0}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Credit Limit</p>
                                    <p className="text-base font-black text-gray-900">₹{shop.creditLimit?.toLocaleString('en-IN') || 0}</p>
                                </div>
                            </div>
                            <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                                <div>
                                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Payment Term</p>
                                    <span className="text-sm font-black text-[#16a34a] uppercase">{shop.paymentTerm}</span>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Lifetime</p>
                                    <span className="text-sm font-bold text-gray-700">₹{shop.totalSpent?.toLocaleString('en-IN') || 0}</span>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 pt-1">
                            <button 
                                onClick={() => setEditingShop(shop)}
                                className="flex-1 bg-green-50 hover:bg-[#16a34a] text-[#16a34a] hover:text-white font-black py-2.5 rounded-xl text-xs uppercase tracking-widest transition-all border-2 border-green-100 hover:border-[#16a34a]"
                            >
                                Adjust Credit
                            </button>
                            <button 
                                onClick={() => handleUpdateShop(shop._id, { isActive: !shop.isActive })}
                                className={`px-4 rounded-xl transition-all border-2 font-bold ${
                                    shop.isActive 
                                        ? 'bg-red-50 hover:bg-red-500 text-red-500 hover:text-white border-red-200 hover:border-red-500'
                                        : 'bg-green-50 hover:bg-[#16a34a] text-[#16a34a] hover:text-white border-green-200'
                                }`}
                                title={shop.isActive ? 'Deactivate' : 'Activate'}
                            >
                                {!shop.isActive ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>
                ))}

                {filteredShops.length === 0 && (
                    <div className="col-span-3 text-center py-20 bg-white border-2 border-dashed border-gray-200 rounded-2xl">
                        <Store className="w-14 h-14 text-gray-200 mx-auto mb-3" />
                        <p className="text-gray-400 font-medium">No shops found matching your filters.</p>
                    </div>
                )}
            </div>

            {/* Credit Edit Modal */}
            {editingShop && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <div className="bg-white border-2 border-gray-100 w-full max-w-md rounded-3xl p-8 space-y-6 shadow-2xl relative">
                        <button onClick={() => setEditingShop(null)} className="absolute top-6 right-6 text-gray-400 hover:text-gray-700 transition-colors p-1 hover:bg-gray-100 rounded-lg">
                            <X className="w-5 h-5" />
                        </button>
                        
                        <div>
                            <h2 className="text-2xl font-black text-gray-900">
                                Adjust Shop <span className="text-[#16a34a]">Credit</span>
                            </h2>
                            <p className="text-gray-400 text-sm font-medium mt-1">{editingShop.shopName}</p>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Credit Limit (₹)</label>
                                <input 
                                    type="number"
                                    defaultValue={editingShop.creditLimit}
                                    className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:border-[#16a34a] outline-none font-bold text-lg"
                                    id="limit-input"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Payment Term</label>
                                <select 
                                    defaultValue={editingShop.paymentTerm}
                                    className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-900 outline-none font-bold focus:border-[#16a34a] cursor-pointer"
                                    id="term-input"
                                >
                                    <option value="cash">Cash On Delivery</option>
                                    <option value="credit">Credit Line</option>
                                    <option value="weekly">Weekly Settlement</option>
                                </select>
                            </div>
                        </div>

                        <button 
                            onClick={() => {
                                const limit = document.getElementById('limit-input').value;
                                const term = document.getElementById('term-input').value;
                                handleUpdateShop(editingShop._id, { creditLimit: Number(limit), paymentTerm: term });
                            }}
                            disabled={isUpdating}
                            className="w-full bg-[#16a34a] hover:bg-[#15803d] text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-md shadow-green-200 disabled:bg-gray-200 disabled:text-gray-400"
                        >
                            {isUpdating ? <Loader2 className="animate-spin w-5 h-5" /> : 'Save Changes'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminShops;

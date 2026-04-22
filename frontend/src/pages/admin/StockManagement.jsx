import React, { useState } from 'react';
import { 
    Search, AlertCircle, CheckCircle, Package,
    Save, X, Loader2, TrendingDown, IndianRupee, Database
} from 'lucide-react';
import { 
    useGetProductsQuery, 
    useUpdateStockMutation 
} from '../../features/products/productsApi';
import toast from 'react-hot-toast';

const StockManagement = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [stockValue, setStockValue] = useState('');

    const { data: productsData, isLoading } = useGetProductsQuery({ limit: 100 });
    const [updateStock, { isLoading: isUpdating }] = useUpdateStockMutation();

    // Filter and Sort products by stock (lowest first)
    const products = [...(productsData?.data || [])]
        .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
        .sort((a, b) => a.stock - b.stock);

    const lowStockProducts = products.filter(p => p.stock <= 10);
    
    const stats = {
        total: products.length,
        lowStock: lowStockProducts.length,
        outOfStock: products.filter(p => p.stock === 0).length,
        totalValue: products.reduce((acc, p) => acc + (p.price * p.stock), 0)
    };

    const handleEditClick = (product) => {
        setEditingId(product._id);
        setStockValue(product.stock.toString());
    };

    const handleSaveStock = async (id) => {
        if (isNaN(stockValue) || stockValue === '') {
            toast.error('Invalid number');
            return;
        }
        try {
            await updateStock({ id, stock: parseInt(stockValue) }).unwrap();
            toast.success('Stock inventory updated');
            setEditingId(null);
        } catch (err) {
            toast.error('Update failed');
        }
    };

    if (isLoading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
                <Loader2 className="w-12 h-12 text-[#16a34a] animate-spin mx-auto mb-4" />
                <p className="text-gray-400 font-medium">Loading inventory...</p>
            </div>
        </div>
    );

    return (
        <div className="p-6 lg:p-8 space-y-6 bg-gray-50 min-h-screen">

            {/* Header */}
            <div className="bg-white border-2 border-gray-100 rounded-2xl p-6 flex items-center justify-between shadow-sm">
                <div>
                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Admin</p>
                    <h1 className="text-3xl font-black text-gray-900">
                        Stock <span className="text-[#16a34a]">Intelligence</span>
                    </h1>
                    <p className="text-gray-400 text-sm font-medium mt-1">Real-time inventory levels across all categories</p>
                </div>
                {stats.lowStock > 0 && (
                    <div className="flex items-center gap-2 bg-orange-50 border-2 border-orange-200 text-orange-700 px-4 py-2.5 rounded-xl font-black text-sm">
                        <span className="flex h-2 w-2 rounded-full bg-orange-500 animate-ping" />
                        {stats.lowStock} Low Stock Alert{stats.lowStock > 1 ? 's' : ''}
                    </div>
                )}
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'Inventory SKU', value: stats.total, icon: Database, bg: 'bg-blue-50', color: 'text-blue-600', border: 'border-blue-100' },
                    { label: 'Deficit Alert', value: stats.lowStock, icon: AlertCircle, bg: 'bg-orange-50', color: 'text-orange-600', border: 'border-orange-100' },
                    { label: 'Out of Stock', value: stats.outOfStock, icon: TrendingDown, bg: 'bg-red-50', color: 'text-red-600', border: 'border-red-100' },
                    { label: 'Stock Valuation', value: `₹${stats.totalValue.toLocaleString('en-IN')}`, icon: IndianRupee, bg: 'bg-green-50', color: 'text-[#16a34a]', border: 'border-green-100' }
                ].map(stat => (
                    <div key={stat.label} className={`bg-white border-2 ${stat.border} p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow`}>
                        <div className={`w-11 h-11 ${stat.bg} rounded-xl flex items-center justify-center mb-4`}>
                            <stat.icon className={`w-5 h-5 ${stat.color}`} />
                        </div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</p>
                        <p className={`text-2xl font-black mt-1 ${stat.color}`}>{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* Table Section */}
            <div className="bg-white border-2 border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                <div className="p-5 border-b-2 border-gray-100">
                    <div className="relative max-w-md">
                        <Search className="absolute left-4 top-3 text-gray-400" size={16} />
                        <input 
                            type="text" 
                            placeholder="Filter inventory by name..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-gray-900 focus:border-[#16a34a] outline-none transition-all font-medium text-sm"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-[10px] font-black text-gray-500 uppercase tracking-wider border-b-2 border-gray-100">
                            <tr>
                                <th className="px-6 py-4">Product Info</th>
                                <th className="px-6 py-4">Category</th>
                                <th className="px-6 py-4">Unit</th>
                                <th className="px-6 py-4">Current Stock</th>
                                <th className="px-6 py-4">Health</th>
                                <th className="px-6 py-4 text-right">Update</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y-2 divide-gray-50">
                            {products.map((product) => (
                                <tr key={product._id} className={`transition-colors group hover:bg-green-50/30 ${
                                    product.stock === 0 ? 'bg-red-50/40' : product.stock <= 10 ? 'bg-orange-50/40' : ''
                                }`}>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-11 h-11 rounded-xl bg-gray-100 overflow-hidden flex items-center justify-center border-2 border-gray-200 shrink-0">
                                                {product.images?.[0] 
                                                    ? <img src={product.images[0]} className="w-full h-full object-cover" alt="" />
                                                    : <Package className="text-gray-300" size={18} />
                                                }
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-gray-900">{product.name}</p>
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{product.sku || product._id.slice(-8)}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-[10px] font-black text-gray-600 bg-gray-100 px-2.5 py-1 rounded-lg border border-gray-200 uppercase tracking-wider">
                                            {product.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 font-bold text-sm text-gray-500 uppercase">{product.unit || 'units'}</td>
                                    <td className="px-6 py-4">
                                        {editingId === product._id ? (
                                            <input 
                                                autoFocus
                                                type="number"
                                                value={stockValue}
                                                onChange={(e) => setStockValue(e.target.value)}
                                                onKeyDown={(e) => e.key === 'Enter' && handleSaveStock(product._id)}
                                                onBlur={() => setEditingId(null)}
                                                className="w-24 bg-green-50 text-[#16a34a] border-2 border-[#16a34a] rounded-xl px-3 py-2 outline-none font-black text-lg"
                                            />
                                        ) : (
                                            <div 
                                                onClick={() => handleEditClick(product)}
                                                className={`cursor-pointer inline-flex items-center gap-2 font-black text-2xl transition-all hover:scale-105 ${
                                                    product.stock === 0 ? 'text-red-600' 
                                                    : product.stock <= 10 ? 'text-orange-600' 
                                                    : 'text-gray-900'
                                                }`}
                                            >
                                                {product.stock}
                                                <span className="text-[9px] text-gray-400 opacity-0 group-hover:opacity-100 uppercase tracking-widest font-black transition-opacity bg-gray-100 px-1.5 py-0.5 rounded">Edit</span>
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        {product.stock === 0 ? (
                                            <span className="inline-flex items-center gap-1.5 text-red-700 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 bg-red-50 rounded-lg border-2 border-red-200">
                                                <AlertCircle size={11} /> Empty
                                            </span>
                                        ) : product.stock <= 10 ? (
                                            <span className="inline-flex items-center gap-1.5 text-orange-700 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 bg-orange-50 rounded-lg border-2 border-orange-200">
                                                <AlertCircle size={11} /> Low
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1.5 text-green-700 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 bg-green-50 rounded-lg border-2 border-green-200">
                                                <CheckCircle size={11} /> Healthy
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        {editingId === product._id ? (
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); handleSaveStock(product._id); }} 
                                                className="bg-[#16a34a] text-white p-2.5 rounded-xl hover:bg-[#15803d] shadow-md shadow-green-200 transition-all"
                                            >
                                                {isUpdating ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                                            </button>
                                        ) : (
                                            <button 
                                                onClick={() => handleEditClick(product)}
                                                className="text-gray-400 hover:text-[#16a34a] font-black text-xs uppercase tracking-wider border-b-2 border-transparent hover:border-[#16a34a] transition-all"
                                            >
                                                Update Inventory
                                            </button>
                                        )}
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

export default StockManagement;

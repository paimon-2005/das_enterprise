import React, { useState } from 'react';
import { 
    Search, 
    ChevronDown, 
    ChevronUp, 
    AlertCircle, 
    CheckCircle, 
    Package,
    ArrowUpDown,
    Save,
    X,
    Loader2
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

    const { data: productsData, isLoading } = useGetProductsQuery({
        sort: 'stock', // We'll handle sorting by lowest stock manually or let backend do it
        limit: 100
    });

    const [updateStock, { isLoading: isUpdating }] = useUpdateStockMutation();

    // Sort products by stock (lowest first)
    const products = [...(productsData?.data || [])].sort((a, b) => a.stock - b.stock);

    const lowStockProducts = products.filter(p => p.stock <= 10);
    
    const stats = {
        total: products.length,
        inStock: products.filter(p => p.stock > 10).length,
        lowStock: lowStockProducts.length,
        outOfStock: products.filter(p => p.stock === 0).length
    };

    const handleEditClick = (product) => {
        setEditingId(product._id);
        setStockValue(product.stock.toString());
    };

    const handleSaveStock = async (id) => {
        if (isNaN(stockValue) || stockValue === '') {
            toast.error('Please enter a valid number');
            return;
        }

        try {
            await updateStock({ id, stock: parseInt(stockValue) }).unwrap();
            toast.success('Stock updated');
            setEditingId(null);
        } catch (err) {
            toast.error('Failed to update stock');
        }
    };

    const handleKeyDown = (e, id) => {
        if (e.key === 'Enter') handleSaveStock(id);
        if (e.key === 'Escape') setEditingId(null);
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Stock Management</h1>
                    <p className="text-gray-500 font-medium font-jakarta">Real-time inventory control and alerts</p>
                </div>
            </div>

            {/* Summary Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'Total Items', value: stats.total, color: 'text-gray-900', bg: 'bg-white' },
                    { label: 'In Stock', value: stats.inStock, color: 'text-green-600', bg: 'bg-green-50' },
                    { label: 'Low Stock', value: stats.lowStock, color: 'text-amber-600', bg: 'bg-amber-50' },
                    { label: 'Out of Stock', value: stats.outOfStock, color: 'text-red-600', bg: 'bg-red-50' }
                ].map(stat => (
                    <div key={stat.label} className={`${stat.bg} p-5 rounded-2xl border border-gray-100 shadow-sm`}>
                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
                        <p className={`text-2xl font-black ${stat.color}`}>{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* Low Stock Alerts */}
            {lowStockProducts.length > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
                    <AlertCircle className="text-amber-600 shrink-0 mt-0.5" size={20} />
                    <div>
                        <p className="font-black text-amber-900 text-sm uppercase tracking-tight">Low Stock Attention Required</p>
                        <p className="text-amber-700 text-sm font-medium mt-0.5"> There are {lowStockProducts.length} items with low or zero stock. Consider replenishing soon.</p>
                    </div>
                </div>
            )}

            {/* Table Section */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                    <div className="relative w-full max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search product inventory..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:border-[#16a34a] outline-none transition-all text-sm font-medium"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-white border-b border-gray-100">
                            <tr className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">
                                <th className="px-6 py-4">Product Details</th>
                                <th className="px-6 py-4">Category</th>
                                <th className="px-6 py-4">Unit</th>
                                <th className="px-6 py-4">Current Stock</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Update</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {isLoading ? (
                                Array(5).fill(0).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan="6" className="px-6 py-6"><div className="h-4 bg-gray-100 rounded w-full"></div></td>
                                    </tr>
                                ))
                            ) : products.length === 0 ? (
                                <tr><td colSpan="6" className="px-6 py-20 text-center text-gray-400 font-bold">No products found.</td></tr>
                            ) : products.map((product) => (
                                <tr key={product._id} className={`${product.stock === 0 ? 'bg-red-50/30' : product.stock <= 10 ? 'bg-amber-50/30' : ''} hover:bg-gray-50/80 transition-colors group`}>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-gray-100 overflow-hidden flex items-center justify-center font-bold text-gray-400">
                                                {product.images?.[0] ? <img src={product.images[0]} className="w-full h-full object-cover" alt="" /> : <Package size={18} />}
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-gray-900">{product.name}</p>
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter italic">#{product._id.slice(-6)}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">{product.category}</td>
                                    <td className="px-6 py-4 text-xs font-bold text-gray-500">{product.unit}</td>
                                    <td className="px-6 py-4">
                                        {editingId === product._id ? (
                                            <input 
                                                autoFocus
                                                type="number"
                                                value={stockValue}
                                                onChange={(e) => setStockValue(e.target.value)}
                                                onKeyDown={(e) => handleKeyDown(e, product._id)}
                                                onBlur={() => setEditingId(null)}
                                                className="w-20 px-3 py-1.5 rounded-lg border-2 border-[#16a34a] outline-none font-black text-sm"
                                            />
                                        ) : (
                                            <div 
                                                onClick={() => handleEditClick(product)}
                                                className={`cursor-pointer inline-flex items-center gap-2 px-3 py-1.5 rounded-lg font-black text-sm transition-all hover:ring-2 hover:ring-gray-200 ${product.stock === 0 ? 'text-red-600' : product.stock <= 10 ? 'text-amber-600' : 'text-gray-900'}`}
                                            >
                                                {product.stock}
                                                <span className="text-[10px] text-gray-300 opacity-0 group-hover:opacity-100 italic transition-opacity">Click to edit</span>
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        {product.stock === 0 ? (
                                            <span className="flex items-center gap-1.5 text-red-600 text-[10px] font-black uppercase tracking-widest">
                                                <AlertCircle size={14} /> Critical
                                            </span>
                                        ) : product.stock <= 10 ? (
                                            <span className="flex items-center gap-1.5 text-amber-600 text-[10px] font-black uppercase tracking-widest">
                                                <AlertCircle size={14} /> Low
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-1.5 text-green-600 text-[10px] font-black uppercase tracking-widest">
                                                <CheckCircle size={14} /> Healthy
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        {editingId === product._id ? (
                                            <div className="flex justify-end gap-1">
                                                <button onClick={(e) => { e.stopPropagation(); handleSaveStock(product._id); }} className="p-2 bg-[#16a34a] text-white rounded-lg hover:bg-[#15803d]">
                                                    {isUpdating ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                                                </button>
                                                <button onClick={(e) => { e.stopPropagation(); setEditingId(null); }} className="p-2 bg-gray-100 text-gray-500 rounded-lg hover:bg-gray-200">
                                                    <X size={16} />
                                                </button>
                                            </div>
                                        ) : (
                                            <button 
                                                onClick={() => handleEditClick(product)}
                                                className="text-[#16a34a] text-xs font-black uppercase tracking-tighter hover:underline"
                                            >
                                                Update Stock
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

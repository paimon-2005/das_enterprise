import React, { useState, useMemo } from 'react';
import { 
    Plus, 
    Search, 
    Edit2, 
    Trash2, 
    Star, 
    Package, 
    AlertTriangle, 
    CheckCircle,
    Loader2,
    Image as ImageIcon,
} from 'lucide-react';
import { 
    useGetProductsQuery, 
    useDeleteProductMutation 
} from '../../features/products/productsApi';
import AddEditProductModal from '../../components/admin/AddEditProductModal';
import toast from 'react-hot-toast';

const AdminProducts = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const { data: productsData, isLoading } = useGetProductsQuery({
        search: searchTerm,
        category: categoryFilter,
        limit: 100 
    });

    const [deleteProduct] = useDeleteProductMutation();
    const products = productsData?.data || [];

    const stats = useMemo(() => {
        const total = products.length;
        const outOfStock = products.filter(p => p.stock === 0).length;
        const lowStock = products.filter(p => p.stock <= 10 && p.stock > 0).length;
        return { total, outOfStock, lowStock };
    }, [products]);

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this product permanently?')) return;
        try {
            await deleteProduct(id).unwrap();
            toast.success('Product removed');
        } catch (err) {
            toast.error(err?.data?.message || 'Delete failed');
        }
    };

    const handleEdit = (product) => {
        setSelectedProduct(product);
        setIsModalOpen(true);
    };

    const getStockStyle = (stock) => {
        if (stock === 0) return { badge: 'bg-red-50 text-red-700 border-red-200', label: 'Empty' };
        if (stock <= 10) return { badge: 'bg-orange-50 text-orange-700 border-orange-200', label: 'Low' };
        return { badge: 'bg-green-50 text-green-700 border-green-200', label: 'Safe' };
    };

    return (
        <div className="p-6 lg:p-8 space-y-6 bg-gray-50 min-h-screen">
            
            {/* Header */}
            <div className="bg-white border-2 border-gray-100 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-sm">
                <div>
                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Admin</p>
                    <h1 className="text-3xl font-black text-gray-900">
                        Inventory <span className="text-[#16a34a]">Master</span>
                    </h1>
                    <p className="text-gray-400 text-sm font-medium mt-1">Manage global product catalog</p>
                </div>
                <button 
                    onClick={() => { setSelectedProduct(null); setIsModalOpen(true); }}
                    className="bg-[#16a34a] hover:bg-[#15803d] text-white px-6 py-3.5 rounded-2xl font-black text-sm flex items-center gap-2 shadow-md shadow-green-200 transition-all active:scale-95"
                >
                    <Plus size={18} strokeWidth={3} /> Add Product
                </button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                    { label: 'Total SKUs', value: stats.total, icon: Package, bg: 'bg-blue-50', color: 'text-blue-600', border: 'border-blue-100' },
                    { label: 'Out of Stock', value: stats.outOfStock, icon: AlertTriangle, bg: 'bg-red-50', color: 'text-red-600', border: 'border-red-100' },
                    { label: 'Low Stock', value: stats.lowStock, icon: Star, bg: 'bg-orange-50', color: 'text-orange-600', border: 'border-orange-100' },
                ].map((stat) => (
                    <div key={stat.label} className={`bg-white p-6 rounded-2xl border-2 ${stat.border} flex items-center justify-between shadow-sm hover:shadow-md transition-shadow`}>
                        <div>
                            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">{stat.label}</p>
                            <p className="text-3xl font-black text-gray-900 mt-1">{stat.value}</p>
                        </div>
                        <div className={`w-14 h-14 ${stat.bg} rounded-2xl flex items-center justify-center`}>
                            <stat.icon className={`w-7 h-7 ${stat.color}`} />
                        </div>
                    </div>
                ))}
            </div>

            {/* Toolbar */}
            <div className="bg-white border-2 border-gray-100 p-4 rounded-2xl flex flex-col md:flex-row gap-3 shadow-sm">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-3.5 text-gray-400" size={16} />
                    <input 
                        type="text" 
                        placeholder="Search products..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl pl-10 pr-4 py-3 text-gray-900 focus:border-[#16a34a] outline-none transition-all font-medium text-sm"
                    />
                </div>
                <select 
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-gray-700 outline-none focus:border-[#16a34a] cursor-pointer"
                >
                    <option value="">Categories: All</option>
                    {['Grains & Rice', 'Oils & Fats', 'Spices', 'Dairy', 'Beverages', 'Snacks', 'Condiments', 'Pulses'].map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>
            </div>

            {/* Product Grid */}
            {isLoading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-10 h-10 text-[#16a34a] animate-spin" />
                </div>
            ) : products.length === 0 ? (
                <div className="text-center py-20 bg-white border-2 border-dashed border-gray-200 rounded-2xl">
                    <Package className="w-14 h-14 text-gray-200 mx-auto mb-3" />
                    <p className="text-gray-400 font-medium">No products found.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {products.map((product) => {
                        const stockStyle = getStockStyle(product.stock);
                        return (
                            <div key={product._id} className="bg-white border-2 border-gray-100 rounded-3xl overflow-hidden group hover:border-[#16a34a]/40 hover:shadow-lg transition-all flex flex-col">
                                {/* Image */}
                                <div className="aspect-[4/3] bg-gray-50 relative overflow-hidden">
                                    {product.images?.[0] ? (
                                        <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center text-gray-300 gap-2">
                                            <ImageIcon className="w-10 h-10" />
                                            <span className="text-[10px] font-black uppercase tracking-widest">No Image</span>
                                        </div>
                                    )}
                                    {/* Action buttons on hover */}
                                    <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                                        <button onClick={() => handleEdit(product)} className="w-9 h-9 bg-white text-blue-600 rounded-xl flex items-center justify-center shadow-lg hover:scale-110 transition-all border border-blue-100">
                                            <Edit2 size={14} />
                                        </button>
                                        <button onClick={() => handleDelete(product._id)} className="w-9 h-9 bg-white text-red-500 rounded-xl flex items-center justify-center shadow-lg hover:scale-110 transition-all border border-red-100">
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-5 flex-1 flex flex-col">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-[10px] font-black text-[#16a34a] uppercase tracking-widest">{product.category}</span>
                                        <span className="text-[10px] font-black text-gray-400 uppercase">{product.sku}</span>
                                    </div>
                                    <h3 className="text-base font-black text-gray-900 tracking-tight leading-tight line-clamp-1">{product.name}</h3>
                                    
                                    <div className="mt-auto pt-4 flex items-center justify-between">
                                        <div>
                                            <span className="text-2xl font-black text-gray-900">₹{product.price}</span>
                                            <span className="text-xs text-gray-400 font-bold ml-1">/ {product.unit}</span>
                                        </div>
                                        <div className="text-right">
                                            <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase border-2 block mb-1 ${stockStyle.badge}`}>
                                                {stockStyle.label}
                                            </span>
                                            <p className="text-[10px] font-bold text-gray-400">{product.stock} left</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {isModalOpen && (
                <AddEditProductModal 
                    isOpen={isModalOpen} 
                    onClose={() => setIsModalOpen(false)} 
                    product={selectedProduct}
                />
            )}
        </div>
    );
};

export default AdminProducts;

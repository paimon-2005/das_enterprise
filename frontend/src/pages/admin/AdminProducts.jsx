import React, { useState, useMemo } from 'react';
import { 
    Plus, 
    Search, 
    Filter, 
    Edit2, 
    Trash2, 
    Star, 
    Package, 
    AlertTriangle, 
    CheckCircle,
    Loader2,
    Image as ImageIcon,
    MoreVertical,
    LayoutGrid,
    List
} from 'lucide-react';
import { 
    useGetProductsQuery, 
    useDeleteProductMutation 
} from '../../features/products/productsApi';
import AddEditProductModal from '../../components/admin/AddEditProductModal';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const AdminProducts = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'table'

    // API Query
    const { data: productsData, isLoading, isError } = useGetProductsQuery({
        search: searchTerm,
        category: categoryFilter,
        limit: 100 // Get all for admin view for now
    });

    const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();

    const products = productsData?.data || [];

    // Stats Logic
    const stats = useMemo(() => {
        const total = products.length;
        const active = products.filter(p => p.isActive).length;
        const featured = products.filter(p => p.isFeatured).length;
        const outOfStock = products.filter(p => p.stock === 0).length;
        return { total, active, featured, outOfStock };
    }, [products]);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await deleteProduct(id).unwrap();
                toast.success('Product deleted successfully');
            } catch (err) {
                toast.error(err?.data?.message || 'Failed to delete product');
            }
        }
    };

    const handleEdit = (product) => {
        setSelectedProduct(product);
        setIsModalOpen(true);
    };

    const StatusBadge = ({ stock }) => {
        if (stock === 0) return <span className="bg-red-100 text-red-700 px-2.5 py-1 rounded-full text-xs font-bold ring-1 ring-red-200">Out of Stock</span>;
        if (stock <= 10) return <span className="bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full text-xs font-bold ring-1 ring-amber-200">Low Stock</span>;
        return <span className="bg-green-100 text-green-700 px-2.5 py-1 rounded-full text-xs font-bold ring-1 ring-green-200">In Stock</span>;
    };

    return (
        <div className="p-6 space-y-6">
            {/* Top Bar */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Products</h1>
                    <p className="text-gray-500 font-medium">Manage your inventory and product details</p>
                </div>
                <button 
                    onClick={() => { setSelectedProduct(null); setIsModalOpen(true); }}
                    className="bg-[#16a34a] hover:bg-[#15803d] text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-green-200 transition-all active:scale-95"
                >
                    <Plus size={20} /> Add Product
                </button>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'Total Products', value: stats.total, icon: Package, color: 'text-blue-600', bg: 'bg-blue-50' },
                    { label: 'Active', value: stats.active, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
                    { label: 'Featured', value: stats.featured, icon: Star, color: 'text-amber-600', bg: 'bg-amber-50' },
                    { label: 'Out of Stock', value: stats.outOfStock, icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50' },
                ].map((stat, i) => (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                        key={stat.label} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4"
                    >
                        <div className={`${stat.bg} ${stat.color} p-3 rounded-xl`}>
                            <stat.icon size={24} />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">{stat.label}</p>
                            <p className="text-2xl font-black text-gray-900">{stat.value}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Search & Filter Bar */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input 
                        type="text" 
                        placeholder="Search by name, tags or description..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-[#16a34a] focus:ring-4 focus:ring-green-50 outline-none transition-all font-medium"
                    />
                </div>
                <div className="flex gap-2">
                    <select 
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-[#16a34a] font-bold text-gray-700 bg-white"
                    >
                        <option value="">All Categories</option>
                        {['Grains & Rice', 'Oils & Fats', 'Spices', 'Dairy', 'Beverages', 'Snacks', 'Condiments', 'Pulses'].map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>

                <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl">
                    <button 
                        onClick={() => setViewMode('grid')}
                        className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-[#16a34a]' : 'text-gray-400 hover:text-gray-600'}`}
                        title="Grid View"
                    >
                        <LayoutGrid size={20} />
                    </button>
                    <button 
                        onClick={() => setViewMode('table')}
                        className={`p-2 rounded-lg transition-all ${viewMode === 'table' ? 'bg-white shadow-sm text-[#16a34a]' : 'text-gray-400 hover:text-gray-600'}`}
                        title="Table View"
                    >
                        <List size={20} />
                    </button>
                </div>
            </div>

            {/* Products Content */}
            {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {Array(8).fill(0).map((_, i) => (
                        <div key={i} className="bg-white rounded-[32px] p-4 shadow-sm border border-gray-100 animate-pulse">
                            <div className="aspect-square bg-gray-50 rounded-[24px] mb-4"></div>
                            <div className="h-4 bg-gray-100 rounded w-3/4 mb-2"></div>
                            <div className="h-4 bg-gray-100 rounded w-1/2"></div>
                        </div>
                    ))}
                </div>
            ) : products.length === 0 ? (
                <div className="bg-white rounded-[32px] p-20 text-center border border-gray-100 shadow-sm">
                    <div className="flex flex-col items-center gap-4 text-gray-400 max-w-xs mx-auto">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-[#16a34a]">
                            <Package size={40} strokeWidth={1} />
                        </div>
                        <div>
                            <p className="text-xl font-black text-gray-900 leading-tight">No Products Found</p>
                            <p className="font-medium text-gray-500 mt-2">Start by adding your first product to see it appear here dynamically.</p>
                        </div>
                        <button 
                            onClick={() => { setSelectedProduct(null); setIsModalOpen(true); }}
                            className="bg-gray-900 text-white px-8 py-3 rounded-xl font-bold mt-4 hover:bg-black transition-all active:scale-95 shadow-lg"
                        >
                            + Add Product
                        </button>
                    </div>
                </div>
            ) : viewMode === 'table' ? (
                <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50/50 border-b border-gray-100">
                                <tr className="text-gray-400 text-[10px] font-black uppercase tracking-widest">
                                    <th className="px-8 py-6">Product Details</th>
                                    <th className="px-6 py-6">Category</th>
                                    <th className="px-6 py-6">Pricing</th>
                                    <th className="px-6 py-6 text-center">Stock</th>
                                    <th className="px-6 py-6">Status</th>
                                    <th className="px-8 py-6 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {products.map((product) => (
                                    <tr key={product._id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-14 h-14 rounded-2xl bg-white overflow-hidden flex items-center justify-center text-gray-300 border border-gray-100 shadow-sm transition-transform group-hover:scale-110 duration-500">
                                                    {product.images?.[0] ? (
                                                        <img src={product.images[0]} alt="" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <ImageIcon size={24} strokeWidth={1} />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-black text-gray-900 tracking-tight text-[15px]">{product.name}</p>
                                                    <p className="text-[10px] font-black text-gray-400 mt-1 uppercase tracking-widest">{product.sku}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="text-[10px] font-black text-gray-500 bg-gray-100 px-3 py-1.5 rounded-lg uppercase tracking-widest">{product.category}</span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex flex-col">
                                                <span className="font-black text-gray-900 text-base">₹{product.price.toLocaleString('en-IN')}</span>
                                                {product.discountPrice && (
                                                    <span className="text-[11px] text-red-400 line-through font-bold">₹{product.discountPrice.toLocaleString('en-IN')}</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-center">
                                            <p className="font-black text-gray-900 text-sm">{product.stock}</p>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest truncate">{product.unit || 'units'}</p>
                                        </td>
                                        <td className="px-6 py-5">
                                            <StatusBadge stock={product.stock} />
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                                                <button 
                                                    onClick={() => handleEdit(product)}
                                                    className="p-3 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                                                >
                                                    <Edit2 size={18} />
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(product._id)}
                                                    className="p-3 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {products.map((product) => (
                        <motion.div 
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            key={product._id}
                            className="bg-white rounded-[40px] p-5 shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 group relative flex flex-col"
                        >
                            {/* Card Media */}
                            <div className="aspect-[4/3] rounded-[32px] bg-gray-50 mb-5 overflow-hidden relative border border-gray-100 shadow-inner group-hover:scale-[1.02] transition-transform duration-700">
                                {product.images?.[0] ? (
                                    <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-300 gap-3">
                                        <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center shadow-sm">
                                            <ImageIcon size={32} strokeWidth={1} />
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-[0.3em] font-mono">No Image Asset</span>
                                    </div>
                                )}
                                
                                <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-8 group-hover:translate-x-0 duration-500 delay-100">
                                    <button onClick={() => handleEdit(product)} className="w-12 h-12 bg-white/90 backdrop-blur-md shadow-2xl rounded-2xl flex items-center justify-center text-blue-600 hover:bg-white hover:scale-110 transition-all"><Edit2 size={18} /></button>
                                    <button onClick={() => handleDelete(product._id)} className="w-12 h-12 bg-white/90 backdrop-blur-md shadow-2xl rounded-2xl flex items-center justify-center text-red-600 hover:bg-white hover:scale-110 transition-all"><Trash2 size={18} /></button>
                                </div>

                                {product.isFeatured && (
                                    <div className="absolute top-4 left-4 bg-amber-400 text-white p-2.5 rounded-2xl shadow-xl flex items-center gap-2">
                                        <Star size={16} className="fill-white" />
                                        <span className="text-[10px] font-black uppercase tracking-wider pr-1">Featured</span>
                                    </div>
                                )}
                            </div>

                            {/* Card Content */}
                            <div className="flex-1 px-2 pb-2 flex flex-col">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-[9px] font-black text-[#16a34a] bg-green-50 px-3 py-1 rounded-full uppercase tracking-widest">{product.category}</span>
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{product.sku}</span>
                                </div>
                                <h3 className="text-xl font-black text-gray-900 leading-[1.2] mb-4 group-hover:text-[#16a34a] transition-colors line-clamp-2">{product.name}</h3>
                                
                                <div className="mt-auto pt-6 border-t border-gray-50 flex items-center justify-between">
                                    <div>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-2xl font-black text-gray-900 tracking-tight">₹{product.price}</span>
                                            {product.discountPrice && (
                                                <span className="text-[11px] text-red-400 line-through font-bold">₹{product.discountPrice}</span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-1.5">
                                        <StatusBadge stock={product.stock} />
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{product.stock} {product.unit} left</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Modal */}
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

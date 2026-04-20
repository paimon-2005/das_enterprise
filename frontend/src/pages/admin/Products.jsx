import React, { useState } from 'react';
import { 
    Plus, 
    Search, 
    Grid, 
    List, 
    Filter, 
    MoreHorizontal, 
    Edit2, 
    Trash, 
    Star,
    ArrowUpRight
} from 'lucide-react';
import { clsx } from 'clsx';

const Products = () => {
    const [viewMode, setViewMode] = useState('grid');
    const [searchTerm, setSearchTerm] = useState('');

    const products = [
        { id: 1, name: 'Sona Masoori Rice', category: 'Grains', price: 65, stock: 1200, rating: 4.8, image: 'https://via.placeholder.com/200', isFeatured: true, status: 'Active' },
        { id: 2, name: 'Cold Pressed Coconut Oil', category: 'Oils', price: 280, stock: 45, rating: 4.9, image: 'https://via.placeholder.com/200', isFeatured: true, status: 'Active' },
        { id: 3, name: 'Chilly Powder 500g', category: 'Spices', price: 90, stock: 0, rating: 4.5, image: 'https://via.placeholder.com/200', isFeatured: false, status: 'Inactive' },
        { id: 4, name: 'Premium Tea 250g', category: 'Beverages', price: 150, stock: 210, rating: 4.7, image: 'https://via.placeholder.com/200', isFeatured: false, status: 'Active' },
        { id: 5, name: 'Cumin Seeds', category: 'Spices', price: 45, stock: 50, rating: 4.8, image: 'https://via.placeholder.com/200', isFeatured: true, status: 'Active' },
        { id: 6, name: 'Refined Sugar 5kg', category: 'Grains', price: 220, stock: 80, rating: 4.2, image: 'https://via.placeholder.com/200', isFeatured: false, status: 'Active' },
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 font-jakarta">Product Management</h2>
                    <p className="text-sm text-gray-500 mt-1">Add, edit and manage your product catalogue</p>
                </div>
                <button className="btn-primary flex items-center gap-2">
                    <Plus size={20} /> Add Product
                </button>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-between gap-4 card !p-3">
                <div className="relative flex-1 group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-500 transition-colors" size={18} />
                    <input 
                        type="search" 
                        placeholder="Search products..." 
                        className="w-full bg-gray-50 border-none rounded-lg py-2 pl-10 pr-4 text-sm font-medium outline-none focus:bg-white focus:ring-2 focus:ring-primary-100 transition-all"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <div className="flex bg-gray-100 p-1 rounded-lg mr-2">
                        <button 
                            onClick={() => setViewMode('grid')}
                            className={clsx("p-1.5 rounded-md transition-all", viewMode === 'grid' ? "bg-white shadow-sm text-primary-600" : "text-gray-500")}
                        >
                            <Grid size={18} />
                        </button>
                        <button 
                            onClick={() => setViewMode('list')}
                            className={clsx("p-1.5 rounded-md transition-all", viewMode === 'list' ? "bg-white shadow-sm text-primary-600" : "text-gray-500")}
                        >
                            <List size={18} />
                        </button>
                    </div>
                    <button className="bg-white border border-gray-200 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-gray-50 transition-all">
                        <Filter size={18} /> Category
                    </button>
                </div>
            </div>

            {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <div key={product.id} className="card !p-0 overflow-hidden group hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                            <div className="relative h-48 bg-gray-100">
                                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                                <div className="absolute top-3 right-3 flex gap-2">
                                    {product.isFeatured && (
                                        <div className="bg-amber-400 text-white p-1.5 rounded-lg shadow-lg">
                                            <Star size={14} fill="currentColor" />
                                        </div>
                                    )}
                                    <button className="bg-white/90 backdrop-blur-sm p-1.5 rounded-lg shadow-lg text-gray-600 hover:text-primary-600">
                                        <Edit2 size={14} />
                                    </button>
                                </div>
                                <div className="absolute bottom-3 left-3">
                                    <span className={clsx(
                                        "px-2 py-1 rounded text-[9px] font-black uppercase tracking-widest shadow-sm",
                                        product.status === 'Active' ? "bg-green-500 text-white" : "bg-red-500 text-white"
                                    )}>
                                        {product.status}
                                    </span>
                                </div>
                            </div>
                            <div className="p-5">
                                <p className="text-[10px] font-bold text-primary-600 uppercase tracking-widest mb-1">{product.category}</p>
                                <h4 className="font-bold text-gray-900 mb-2 truncate group-hover:text-primary-600 transition-colors">{product.name}</h4>
                                <div className="flex items-center justify-between mt-4">
                                    <div>
                                        <p className="text-xs text-gray-400 font-bold uppercase">Price</p>
                                        <p className="text-lg font-black text-gray-900">₹{product.price}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-gray-400 font-bold uppercase">Stock</p>
                                        <p className={clsx("text-sm font-bold", product.stock === 0 ? "text-red-500" : "text-gray-900")}>{product.stock} units</p>
                                    </div>
                                </div>
                                <div className="mt-5 pt-4 border-t border-gray-50 flex items-center justify-between">
                                    <div className="flex items-center gap-1">
                                        <Star size={14} className="text-amber-400 fill-amber-400" />
                                        <span className="text-sm font-bold">{product.rating}</span>
                                    </div>
                                    <button className="text-gray-400 hover:text-red-500 transition-colors">
                                        <Trash size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="card !p-0 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                                <th className="px-6 py-4">Product</th>
                                <th className="px-6 py-4">Category</th>
                                <th className="px-6 py-4">Price</th>
                                <th className="px-6 py-4">Stock</th>
                                <th className="px-6 py-4">Featured</th>
                                <th className="px-6 py-4 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {products.map((product) => (
                                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center font-bold text-gray-400">
                                                IMG
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-gray-900">{product.name}</p>
                                                <p className="text-xs text-gray-500">#{product.id}002931</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-3 py-1 bg-gray-100 rounded-full text-[10px] font-bold uppercase">{product.category}</span>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-black">₹{product.price}</td>
                                    <td className="px-6 py-4">
                                        <span className={clsx("text-sm font-bold", product.stock < 50 ? "text-red-500" : "text-gray-900")}>{product.stock}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {product.isFeatured ? <Star size={16} className="text-amber-400 fill-amber-400" /> : <Star size={16} className="text-gray-200" />}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-center gap-3">
                                            <button className="text-gray-400 hover:text-primary-600"><Edit2 size={18} /></button>
                                            <button className="text-gray-400 hover:text-red-500"><Trash size={18} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Products;

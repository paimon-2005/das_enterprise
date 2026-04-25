import React, { useState } from 'react';
import {
    Plus,
    Search,
    Grid,
    List,
    Filter,
    Edit2,
    Trash,
    Star,
    Package,
} from 'lucide-react';
import { clsx } from 'clsx';

const CATEGORY_COLORS = {
    Grains:     'bg-amber-50 text-amber-700',
    Oils:       'bg-yellow-50 text-yellow-700',
    Spices:     'bg-red-50 text-red-700',
    Beverages:  'bg-blue-50 text-blue-700',
    Dairy:      'bg-sky-50 text-sky-700',
    Pulses:     'bg-orange-50 text-orange-700',
};

const MOCK_PRODUCTS = [
    { id: 1, name: 'Sona Masoori Rice 25kg', category: 'Grains',    price: 65,  stock: 1200, rating: 4.8, isFeatured: true,  status: 'Active'   },
    { id: 2, name: 'Cold Pressed Coconut Oil 1L', category: 'Oils', price: 280, stock: 45,   rating: 4.9, isFeatured: true,  status: 'Active'   },
    { id: 3, name: 'Red Chilly Powder 500g',  category: 'Spices',   price: 90,  stock: 0,    rating: 4.5, isFeatured: false, status: 'Inactive' },
    { id: 4, name: 'Premium Tea 250g',        category: 'Beverages',price: 150, stock: 210,  rating: 4.7, isFeatured: false, status: 'Active'   },
    { id: 5, name: 'Cumin Seeds 200g',        category: 'Spices',   price: 45,  stock: 50,   rating: 4.8, isFeatured: true,  status: 'Active'   },
    { id: 6, name: 'Refined Sugar 5kg',       category: 'Grains',   price: 220, stock: 80,   rating: 4.2, isFeatured: false, status: 'Active'   },
];

const Products = () => {
    const [viewMode, setViewMode]     = useState('grid');
    const [searchTerm, setSearchTerm] = useState('');
    const [category, setCategory]     = useState('');

    const visible = MOCK_PRODUCTS.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (category === '' || p.category === category)
    );

    const categories = [...new Set(MOCK_PRODUCTS.map(p => p.category))];

    return (
        <div className="page-wrapper">

            {/* ── Page header ─────────────────────────────── */}
            <div className="page-header">
                <div>
                    <p className="text-[11px] font-semibold text-txt-secondary uppercase tracking-widest mb-1">Admin</p>
                    <h1 className="text-2xl font-bold text-txt-primary">Product Catalogue</h1>
                    <p className="text-sm text-txt-secondary mt-0.5">
                        {visible.length} product{visible.length !== 1 ? 's' : ''} listed
                    </p>
                </div>
                <button className="btn-accent inline-flex items-center gap-2 text-sm">
                    <Plus size={16} /> Add Product
                </button>
            </div>

            {/* ── Toolbar ─────────────────────────────────── */}
            <div className="bg-card border border-gray-100 rounded-xl px-4 py-3 flex flex-wrap items-center gap-3 shadow-card">
                {/* Search */}
                <div className="relative flex-1 min-w-[180px] max-w-sm">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-txt-secondary" />
                    <input
                        type="search"
                        placeholder="Search products…"
                        className="input-field pl-8 !py-2 text-xs"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* Category filter */}
                <div className="flex items-center gap-1.5 text-txt-secondary text-xs font-semibold">
                    <Filter size={13} />
                </div>
                <select
                    className="input-field !w-auto !py-2 cursor-pointer text-xs font-medium"
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                >
                    <option value="">Category: All</option>
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>

                {/* View toggle */}
                <div className="flex bg-surface border border-gray-200 p-0.5 rounded-lg ml-auto">
                    <button
                        onClick={() => setViewMode('grid')}
                        className={clsx(
                            'p-1.5 rounded-md transition-all',
                            viewMode === 'grid' ? 'bg-white shadow-sm text-primary-600' : 'text-txt-secondary hover:text-txt-primary',
                        )}
                    >
                        <Grid size={15} />
                    </button>
                    <button
                        onClick={() => setViewMode('list')}
                        className={clsx(
                            'p-1.5 rounded-md transition-all',
                            viewMode === 'list' ? 'bg-white shadow-sm text-primary-600' : 'text-txt-secondary hover:text-txt-primary',
                        )}
                    >
                        <List size={15} />
                    </button>
                </div>
            </div>

            {/* ── Grid view ───────────────────────────────── */}
            {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {visible.map(product => (
                        <div key={product.id} className="bg-card border border-gray-100 rounded-xl overflow-hidden shadow-card hover:shadow-card2 hover:-translate-y-0.5 transition-all group">
                            {/* Product image placeholder */}
                            <div className="relative h-40 bg-surface flex items-center justify-center">
                                <Package className="w-12 h-12 text-gray-300" />
                                {/* Badges */}
                                <div className="absolute top-3 left-3">
                                    <span className={clsx(
                                        'text-[10px] font-semibold px-2 py-0.5 rounded-md uppercase tracking-wide',
                                        product.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600',
                                    )}>
                                        {product.status}
                                    </span>
                                </div>
                                {product.isFeatured && (
                                    <div className="absolute top-3 right-3">
                                        <span className="bg-accent-500 text-white text-[10px] font-semibold px-2 py-0.5 rounded-md">
                                            Featured
                                        </span>
                                    </div>
                                )}
                                {/* Hover actions */}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                    <button className="bg-white text-txt-primary p-2 rounded-lg hover:bg-primary-50 hover:text-primary-600 transition-all">
                                        <Edit2 size={14} />
                                    </button>
                                    <button className="bg-white text-txt-primary p-2 rounded-lg hover:bg-red-50 hover:text-red-500 transition-all">
                                        <Trash size={14} />
                                    </button>
                                </div>
                            </div>

                            <div className="p-4">
                                {/* Category pill */}
                                <span className={clsx(
                                    'text-[10px] font-semibold px-2 py-0.5 rounded-md uppercase tracking-wide',
                                    CATEGORY_COLORS[product.category] || 'bg-gray-100 text-gray-600',
                                )}>
                                    {product.category}
                                </span>

                                <h4 className="font-semibold text-txt-primary text-sm mt-2 mb-3 leading-snug group-hover:text-primary-700 transition-colors">
                                    {product.name}
                                </h4>

                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-[10px] text-txt-secondary font-medium uppercase">Price / unit</p>
                                        <p className="text-base font-bold text-txt-primary">₹{product.price}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] text-txt-secondary font-medium uppercase">Stock</p>
                                        <p className={clsx('text-sm font-semibold', product.stock === 0 ? 'text-red-500' : 'text-txt-primary')}>
                                            {product.stock} units
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                                    <div className="flex items-center gap-1">
                                        <Star size={12} className="text-amber-400 fill-amber-400" />
                                        <span className="text-xs font-semibold text-txt-primary">{product.rating}</span>
                                    </div>
                                    {/* Add-to-cart CTA */}
                                    <button className="btn-accent text-xs !py-1.5 !px-3">
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                /* ── List view ──────────────────────────────── */
                <div className="bg-card border border-gray-100 rounded-xl overflow-hidden shadow-card">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-surface border-b border-gray-200">
                            <tr>
                                {['Product', 'Category', 'Price', 'Stock', 'Rating', 'Status', ''].map(h => (
                                    <th key={h} className="px-5 py-3.5 text-[11px] font-semibold text-txt-secondary uppercase tracking-wider">
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {visible.map(product => (
                                <tr key={product.id} className="admin-table-row">
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 bg-surface rounded-lg border border-gray-100 flex items-center justify-center">
                                                <Package size={16} className="text-gray-300" />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-txt-primary">{product.name}</p>
                                                <p className="text-xs text-txt-secondary">SKU-{product.id.toString().padStart(4, '0')}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4">
                                        <span className={clsx('text-[10px] font-semibold px-2 py-0.5 rounded-md uppercase', CATEGORY_COLORS[product.category] || 'bg-gray-100 text-gray-600')}>
                                            {product.category}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4 font-bold text-txt-primary">₹{product.price}</td>
                                    <td className="px-5 py-4">
                                        <span className={clsx('font-semibold text-sm', product.stock < 50 ? 'text-red-500' : 'text-txt-primary')}>
                                            {product.stock}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-1">
                                            <Star size={12} className="text-amber-400 fill-amber-400" />
                                            <span className="text-xs font-semibold">{product.rating}</span>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4">
                                        <span className={clsx(
                                            'text-[10px] font-semibold px-2 py-0.5 rounded-md uppercase',
                                            product.status === 'Active' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600',
                                        )}>
                                            {product.status}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-2">
                                            <button className="p-1.5 rounded-lg text-txt-secondary hover:text-primary-600 hover:bg-primary-50 transition-all border border-gray-100">
                                                <Edit2 size={13} />
                                            </button>
                                            <button className="p-1.5 rounded-lg text-txt-secondary hover:text-red-500 hover:bg-red-50 transition-all border border-gray-100">
                                                <Trash size={13} />
                                            </button>
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

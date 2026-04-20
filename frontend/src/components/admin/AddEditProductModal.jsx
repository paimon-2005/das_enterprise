import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { X, Upload, Loader2, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    useCreateProductMutation, 
    useUpdateProductMutation 
} from '../../features/products/productsApi';
import toast from 'react-hot-toast';

// Zod Validation Schema
const productSchema = z.object({
    name: z.string().min(3, 'Name must be at least 3 characters'),
    description: z.string().optional(),
    category: z.string().min(1, 'Please select a category'),
    unit: z.string().default('piece'),
    price: z.coerce.number().positive('Price must be a positive number'),
    discountPrice: z.coerce.number().optional(),
    stock: z.coerce.number().min(0, 'Stock cannot be negative'),
    minOrderQty: z.coerce.number().min(1, 'Min order qty must be at least 1').default(1),
    sku: z.string().min(3, 'SKU must be at least 3 characters'),
    tags: z.string().optional(),
    isActive: z.boolean().default(true),
    isFeatured: z.boolean().default(false),
});

const AddEditProductModal = ({ isOpen, onClose, product }) => {
    const [imagePreview, setImagePreview] = useState(null);
    const [imageBase64, setImageBase64] = useState(null);

    const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
    const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();

    const isEditing = !!product;

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
        setValue,
        watch
    } = useForm({
        resolver: zodResolver(productSchema),
        defaultValues: {
            name: '',
            description: '',
            category: '',
            unit: 'piece',
            price: 0,
            discountPrice: 0,
            stock: 0,
            minOrderQty: 1,
            sku: '',
            tags: '',
            isActive: true,
            isFeatured: false,
        }
    });

    useEffect(() => {
        if (isEditing) {
            reset({
                ...product,
                tags: product.tags?.join(', ') || '',
                price: product.price || 0,
                discountPrice: product.discountPrice || 0,
                stock: product.stock || 0,
                minOrderQty: product.minOrderQty || 1,
            });
            if (product.images?.[0]) {
                setImagePreview(product.images[0]);
            }
        } else {
            reset({
                name: '',
                description: '',
                category: '',
                unit: 'piece',
                price: 0,
                discountPrice: 0,
                stock: 0,
                minOrderQty: 1,
                tags: '',
                isActive: true,
                isFeatured: false,
            });
            setImagePreview(null);
            setImageBase64(null);
        }
    }, [product, isEditing, reset, isOpen]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                toast.error('Image size should be less than 5MB');
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
                setImageBase64(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const onSubmit = async (data, e) => {
        const isAddAnother = e?.nativeEvent?.submitter?.name === 'addAnother';
        try {
            const payload = {
                ...data,
                tags: data.tags ? data.tags.split(',').map(t => t.trim()) : [],
                images: imageBase64 ? [imageBase64] : isEditing ? product.images : []
            };

            if (isEditing) {
                await updateProduct({ id: product._id, data: payload }).unwrap();
                toast.success('Product updated successfully!');
                onClose();
            } else {
                await createProduct(payload).unwrap();
                toast.success('Product added successfully!');
                
                if (isAddAnother) {
                    reset({
                        ...watch(),
                        name: '',
                        sku: '',
                        stock: 0,
                    });
                    setImagePreview(null);
                    setImageBase64(null);
                } else {
                    onClose();
                }
            }
        } catch (err) {
            toast.error(err?.data?.message || 'Operation failed. Please try again.');
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                    >
                        {/* Header */}
                        <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                            <div>
                                <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                                    {isEditing ? 'Edit Product' : 'Add New Product'}
                                </h2>
                                <p className="text-sm text-gray-500 font-medium">Fill in the details below</p>
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                                <X size={24} className="text-gray-500" />
                            </button>
                        </div>

                        {/* Form Body */}
                        <form onSubmit={handleSubmit(onSubmit)} className="overflow-y-auto p-8 custom-scrollbar">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Left Column */}
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-black text-gray-700 uppercase tracking-wider mb-1.5 ml-1">Product Name*</label>
                                        <input 
                                            {...register('name')}
                                            className={`w-full px-4 py-3 rounded-xl border ${errors.name ? 'border-red-500' : 'border-gray-200'} focus:ring-4 focus:ring-green-50 outline-none transition-all font-medium`}
                                            placeholder="e.g. Premium Basmati Rice"
                                        />
                                        {errors.name && <p className="text-red-500 text-xs mt-1 font-bold">{errors.name.message}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-black text-gray-700 uppercase tracking-wider mb-1.5 ml-1">SKU* (Stock Keeping Unit)</label>
                                        <input 
                                            {...register('sku')}
                                            className={`w-full px-4 py-3 rounded-xl border ${errors.sku ? 'border-red-500' : 'border-gray-200'} focus:ring-4 focus:ring-green-50 outline-none transition-all font-bold`}
                                            placeholder="e.g. SNK-GD-001"
                                        />
                                        {errors.sku && <p className="text-red-500 text-xs mt-1 font-bold">{errors.sku.message}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-black text-gray-700 uppercase tracking-wider mb-1.5 ml-1">Description</label>
                                        <textarea 
                                            {...register('description')}
                                            rows="3"
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-4 focus:ring-green-50 outline-none transition-all font-medium resize-none"
                                            placeholder="Detailed product description..."
                                        ></textarea>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-black text-gray-700 uppercase tracking-wider mb-1.5 ml-1">Category*</label>
                                            <select 
                                                {...register('category')}
                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-4 focus:ring-green-50 font-bold text-gray-700"
                                            >
                                                <option value="">Select</option>
                                                {['Grains & Rice', 'Oils & Fats', 'Spices', 'Dairy', 'Beverages', 'Snacks', 'Condiments', 'Pulses'].map(cat => (
                                                    <option key={cat} value={cat}>{cat}</option>
                                                ))}
                                            </select>
                                            {errors.category && <p className="text-red-500 text-xs mt-1 font-bold">{errors.category.message}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-black text-gray-700 uppercase tracking-wider mb-1.5 ml-1">Unit</label>
                                            <select 
                                                {...register('unit')}
                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none font-bold text-gray-700"
                                            >
                                                {['kg', 'piece', 'box', 'can', 'bag', 'pack'].map(u => (
                                                    <option key={u} value={u}>{u}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-black text-gray-700 uppercase tracking-wider mb-1.5 ml-1">Price ₹*</label>
                                            <input 
                                                type="number"
                                                {...register('price')}
                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none font-black"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-black text-gray-700 uppercase tracking-wider mb-1.5 ml-1">Discount Price ₹</label>
                                            <input 
                                                type="number"
                                                {...register('discountPrice')}
                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none font-black"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Right Column */}
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-black text-gray-700 uppercase tracking-wider mb-1.5 ml-1">Stock*</label>
                                            <input 
                                                type="number"
                                                {...register('stock')}
                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none font-black"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-black text-gray-700 uppercase tracking-wider mb-1.5 ml-1">Min Order</label>
                                            <input 
                                                type="number"
                                                {...register('minOrderQty')}
                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none font-black"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-black text-gray-700 uppercase tracking-wider mb-1.5 ml-1">Tags (Comma separated)</label>
                                        <input 
                                            {...register('tags')}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none font-medium"
                                            placeholder="fresh, organic, premium..."
                                        />
                                    </div>

                                    {/* Image Upload */}
                                    <div>
                                        <label className="block text-sm font-black text-gray-700 uppercase tracking-wider mb-1.5 ml-1">Product Image</label>
                                        <div className="flex items-start gap-4">
                                            <div className="w-24 h-24 rounded-2xl bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden shrink-0">
                                                {imagePreview ? (
                                                    <img src={imagePreview} className="w-full h-full object-cover" alt="" />
                                                ) : (
                                                    <ImageIcon className="text-gray-300" size={32} />
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-gray-200 rounded-2xl cursor-pointer hover:bg-gray-50 transition-colors">
                                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                        <Upload className="text-gray-400 mb-1" size={20} />
                                                        <p className="text-xs text-gray-500 font-bold uppercase">Click to upload</p>
                                                    </div>
                                                    <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Toggles */}
                                    <div className="flex gap-6 pt-2">
                                        <label className="flex items-center gap-3 cursor-pointer group">
                                            <input type="checkbox" {...register('isActive')} className="w-5 h-5 rounded border-gray-300 text-[#16a34a] focus:ring-[#16a34a]" />
                                            <span className="text-sm font-bold text-gray-700 group-hover:text-black transition-colors">Is Active</span>
                                        </label>
                                        <label className="flex items-center gap-3 cursor-pointer group">
                                            <input type="checkbox" {...register('isFeatured')} className="w-5 h-5 rounded border-gray-300 text-[#16a34a] focus:ring-[#16a34a]" />
                                            <span className="text-sm font-bold text-gray-700 group-hover:text-black transition-colors">Is Featured</span>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* Sticky Footer Button */}
                            <div className="mt-8 flex gap-3">
                                <button 
                                    type="button" 
                                    onClick={onClose}
                                    className="flex-1 px-6 py-4 rounded-xl border border-gray-200 font-black text-gray-600 hover:bg-gray-50 transition-colors uppercase tracking-widest text-sm"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    disabled={isCreating || isUpdating}
                                    className="flex-[2] bg-[#16a34a] hover:bg-[#15803d] text-white px-6 py-4 rounded-xl font-black shadow-lg shadow-green-100 flex items-center justify-center gap-2 uppercase tracking-widest text-sm disabled:opacity-50 active:scale-[0.98] transition-all"
                                >
                                    {(isCreating || isUpdating) ? (
                                        <Loader2 className="animate-spin" size={20} />
                                    ) : (
                                        <>
                                            {isEditing ? 'Update Product' : 'Create Product'}
                                        </>
                                    )}
                                </button>
                                
                                {!isEditing && (
                                    <button 
                                        type="submit"
                                        name="addAnother"
                                        disabled={isCreating}
                                        className="flex-[2] bg-gray-900 hover:bg-black text-white px-6 py-4 rounded-xl font-black shadow-lg shadow-gray-200 flex items-center justify-center gap-2 uppercase tracking-widest text-sm disabled:opacity-50 active:scale-[0.98] transition-all"
                                    >
                                        {isCreating ? <Loader2 className="animate-spin" size={20} /> : 'Create & Add Another'}
                                    </button>
                                )}
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default AddEditProductModal;

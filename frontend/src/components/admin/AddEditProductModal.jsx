import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { X, Upload, Loader2, Image as ImageIcon, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    useCreateProductMutation, 
    useUpdateProductMutation 
} from '../../features/products/productsApi';
import toast from 'react-hot-toast';

// Zod Validation Schema
const productSchema = z.object({
    name: z.string().min(3, 'Name is too short'),
    description: z.string().optional(),
    category: z.string().min(1, 'Category is required'),
    unit: z.string().default('piece'),
    price: z.coerce.number().positive('Price must be positive'),
    discountPrice: z.coerce.number().optional(),
    stock: z.coerce.number().min(0, 'Invalid stock'),
    minOrderQty: z.coerce.number().min(1).default(1),
    sku: z.string().min(3, 'SKU required'),
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
        watch
    } = useForm({
        resolver: zodResolver(productSchema),
        defaultValues: {
            unit: 'piece',
            isActive: true,
            isFeatured: false,
        }
    });

    useEffect(() => {
        if (isEditing) {
            reset({
                ...product,
                tags: product.tags?.join(', ') || '',
            });
            if (product.images?.[0]) setImagePreview(product.images[0]);
        } else {
            reset({ unit: 'piece', isActive: true });
            setImagePreview(null);
        }
    }, [product, isEditing, reset, isOpen]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
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
                toast.success('Product Updated');
                onClose();
            } else {
                await createProduct(payload).unwrap();
                toast.success('Product Created');
                if (isAddAnother) {
                    reset();
                    setImagePreview(null);
                } else {
                    onClose();
                }
            }
        } catch (err) {
            toast.error(err?.data?.message || 'Operation failed');
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="bg-[#161a22] border border-[#262c36] w-full max-w-2xl rounded-3xl shadow-2xl flex flex-col max-h-[90vh]"
                    >
                        {/* Header */}
                        <div className="px-8 py-6 border-b border-[#262c36] flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">
                                    {isEditing ? 'Update' : 'Register'} <span className="text-[#16a34a]">Product</span>
                                </h2>
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-[#1c222b] rounded-full transition-colors">
                                <X className="text-gray-500" />
                            </button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit(onSubmit)} className="overflow-y-auto p-8 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1.5">Product Name</label>
                                        <input {...register('name')} className="w-full bg-[#1c222b] border border-[#2d3643] rounded-xl px-4 py-3 text-white focus:border-[#16a34a] outline-none font-bold italic" />
                                        {errors.name && <p className="text-red-500 text-[10px] mt-1">{errors.name.message}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1.5">SKU Code</label>
                                        <input {...register('sku')} className="w-full bg-[#1c222b] border border-[#2d3643] rounded-xl px-4 py-3 text-white focus:border-[#16a34a] outline-none font-black tracking-widest" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1.5">Category</label>
                                            <select {...register('category')} className="w-full bg-[#1c222b] border border-[#2d3643] rounded-xl px-4 py-3 text-white outline-none font-bold italic">
                                                <option value="">Select</option>
                                                {['Grains & Rice', 'Oils & Fats', 'Spices', 'Dairy', 'Beverages', 'Snacks', 'Condiments', 'Pulses'].map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1.5">Unit</label>
                                            <select {...register('unit')} className="w-full bg-[#1c222b] border border-[#2d3643] rounded-xl px-4 py-3 text-white outline-none font-bold">
                                                {['kg', 'piece', 'box', 'can', 'bag', 'pack'].map(u => <option key={u} value={u}>{u}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1.5">Price ₹</label>
                                            <input type="number" {...register('price')} className="w-full bg-[#1c222b] border border-[#2d3643] rounded-xl px-4 py-3 text-white outline-none font-black text-lg" />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1.5">Stock Qty</label>
                                            <input type="number" {...register('stock')} className="w-full bg-[#1c222b] border border-[#2d3643] rounded-xl px-4 py-3 text-white outline-none font-black text-lg" />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1.5">Product Asset (Image)</label>
                                        <div className="bg-[#1c222b] border-2 border-dashed border-[#2d3643] rounded-2xl p-4 flex flex-col items-center justify-center gap-4 group hover:border-[#16a34a] transition-all">
                                            {imagePreview ? (
                                                <img src={imagePreview} className="w-32 h-32 object-cover rounded-xl shadow-2xl" alt="" />
                                            ) : (
                                                <ImageIcon className="text-gray-700 w-12 h-12" />
                                            )}
                                            <label className="bg-[#16a34a] px-4 py-2 rounded-lg text-white text-[10px] font-black uppercase tracking-widest cursor-pointer hover:scale-105 transition-transform">
                                                Upload Asset
                                                <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                                            </label>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1.5">Description (Italic)</label>
                                        <textarea {...register('description')} rows="3" className="w-full bg-[#1c222b] border border-[#2d3643] rounded-xl px-4 py-3 text-white outline-none font-medium italic italic"></textarea>
                                    </div>
                                    <div className="flex gap-4">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input type="checkbox" {...register('isActive')} className="w-4 h-4 rounded border-none bg-gray-700 text-[#16a34a] focus:ring-0" />
                                            <span className="text-xs font-bold text-gray-400">Published</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input type="checkbox" {...register('isFeatured')} className="w-4 h-4 rounded border-none bg-gray-700 text-[#16a34a] focus:ring-0" />
                                            <span className="text-xs font-bold text-gray-400">Featured</span>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4 pt-10">
                                <button type="button" onClick={onClose} className="flex-1 py-4 bg-[#1c222b] text-gray-500 hovber:text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all border border-[#2d3643]">Discard</button>
                                <button 
                                    type="submit" 
                                    className="flex-[2] py-4 bg-[#16a34a] hover:bg-[#15803d] text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-green-900/30 flex items-center justify-center gap-2"
                                >
                                    {(isCreating || isUpdating) ? <Loader2 className="animate-spin" /> : (
                                        <>
                                            <CheckCircle2 size={18} />
                                            {isEditing ? 'Finalize Changes' : 'Initialize Product'}
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default AddEditProductModal;

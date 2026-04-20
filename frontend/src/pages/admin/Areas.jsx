import React, { useState } from 'react';
import { Plus, Edit2, Trash2, MapPin, Store, ShoppingBag, IndianRupee, Loader2 } from 'lucide-react';
import { useGetAreasQuery, useCreateAreaMutation, useUpdateAreaMutation, useDeleteAreaMutation } from '../../features/areas/areasApi';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const Areas = () => {
    const { data: result, isLoading } = useGetAreasQuery();
    const areas = result?.data || [];
    
    const [createArea] = useCreateAreaMutation();
    const [updateArea] = useUpdateAreaMutation();
    const [deleteArea] = useDeleteAreaMutation();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingArea, setEditingArea] = useState(null);
    const [formData, setFormData] = useState({ name: '', description: '' });

    const handleOpenModal = (area = null) => {
        if (area) {
            setEditingArea(area);
            setFormData({ name: area.name, description: area.description || '' });
        } else {
            setEditingArea(null);
            setFormData({ name: '', description: '' });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingArea) {
                await updateArea({ id: editingArea._id, ...formData }).unwrap();
                toast.success('Area updated successfully');
            } else {
                await createArea(formData).unwrap();
                toast.success('Area created successfully');
            }
            setIsModalOpen(false);
        } catch (err) {
            toast.error(err?.data?.message || 'Something went wrong');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this area? This cannot be undone.')) {
            try {
                await deleteArea(id).unwrap();
                toast.success('Area deleted');
            } catch (err) {
                toast.error(err?.data?.message || 'Could not delete area');
            }
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="animate-spin text-primary-600" size={40} />
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 font-jakarta">Manage Areas</h1>
                    <p className="text-gray-500 text-sm mt-1">Configure and monitor delivery zones for your dealers</p>
                </div>
                <button 
                    onClick={() => handleOpenModal()}
                    className="flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-primary-900/20 active:scale-95"
                >
                    <Plus size={20} />
                    <span>Add New Area</span>
                </button>
            </div>

            {/* Areas Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {areas.length > 0 ? (
                    areas.map((area) => (
                        <motion.div 
                            key={area._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-[2.5rem] p-8 border border-gray-100 hover:shadow-xl hover:shadow-gray-200/50 transition-all group relative overflow-hidden"
                        >
                            {/* Decoration */}
                            <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary-50 rounded-full group-hover:scale-150 transition-transform duration-500 opacity-50" />
                            
                            <div className="relative z-10">
                                <div className="flex items-start justify-between mb-6">
                                    <div className="w-14 h-14 bg-primary-100 rounded-2xl flex items-center justify-center text-primary-600">
                                        <MapPin size={28} />
                                    </div>
                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => handleOpenModal(area)} className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors">
                                            <Edit2 size={18} />
                                        </button>
                                        <button onClick={() => handleDelete(area._id)} className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>

                                <h3 className="text-2xl font-bold text-gray-900 mb-2 truncate">{area.name}</h3>
                                <p className="text-gray-500 text-sm mb-8 line-clamp-2 h-10">{area.description || 'No description provided.'}</p>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-gray-50 p-4 rounded-3xl">
                                        <div className="flex items-center gap-2 text-gray-400 mb-1">
                                            <Store size={14} />
                                            <span className="text-[10px] font-bold uppercase tracking-wider">Shops</span>
                                        </div>
                                        <p className="text-xl font-black text-gray-900">{area.totalShops || 0}</p>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-3xl">
                                        <div className="flex items-center gap-2 text-gray-400 mb-1">
                                            <ShoppingBag size={14} />
                                            <span className="text-[10px] font-bold uppercase tracking-wider">Orders</span>
                                        </div>
                                        <p className="text-xl font-black text-gray-900">{area.totalOrders || 0}</p>
                                    </div>
                                </div>

                                <div className="mt-4 bg-primary-50/50 p-4 rounded-3xl flex items-center justify-between">
                                    <div>
                                        <span className="text-[10px] font-bold text-primary-600 uppercase tracking-widest block mb-0.5">Area Revenue</span>
                                        <p className="text-lg font-black text-gray-900 flex items-center">
                                            <IndianRupee size={16} />
                                            <span>{area.totalRevenue?.toLocaleString('en-IN') || 0}</span>
                                        </p>
                                    </div>
                                    <Link 
                                        to={`/admin/areas/${area._id}`}
                                        className="bg-white w-10 h-10 rounded-full flex items-center justify-center text-primary-600 hover:bg-primary-600 hover:text-white transition-all shadow-sm"
                                    >
                                        <Edit2 size={16} />
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    ))
                ) : (
                    <div className="col-span-full flex flex-col items-center justify-center py-20 bg-gray-50/50 rounded-[3rem] border-2 border-dashed border-gray-200">
                        <div className="bg-white p-6 rounded-full shadow-sm mb-4">
                            <MapPin size={48} className="text-gray-300" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">No Areas Yet</h3>
                        <p className="text-gray-500 mb-8">Add your first delivery area to start assigning dealers.</p>
                        <button 
                            onClick={() => handleOpenModal()}
                            className="bg-primary-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-primary-700 transition-all"
                        >
                            Create Delivery Area
                        </button>
                    </div>
                )}
            </div>

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-white w-full max-w-lg rounded-[3rem] p-10 relative z-10 shadow-2xl"
                        >
                            <h2 className="text-3xl font-black text-gray-900 mb-2 font-jakarta">
                                {editingArea ? 'Edit Area' : 'Add New Area'}
                            </h2>
                            <p className="text-gray-500 text-sm mb-8">Delivery areas help you organize and filter dealer performance.</p>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2 ml-1 uppercase tracking-widest text-[10px]">Area Name</label>
                                    <input 
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full bg-gray-50 border-none rounded-2xl p-4 text-gray-900 focus:ring-2 focus:ring-primary-600 transition-all"
                                        placeholder="e.g. Andheri West"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2 ml-1 uppercase tracking-widest text-[10px]">Description</label>
                                    <textarea 
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full bg-gray-50 border-none rounded-2xl p-4 text-gray-900 focus:ring-2 focus:ring-primary-600 transition-all h-32 resize-none"
                                        placeholder="Add some details about this delivery zone..."
                                    />
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button 
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="flex-1 px-8 py-4 rounded-2xl font-bold text-gray-500 hover:bg-gray-100 transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="submit"
                                        className="flex-1 bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-lg shadow-primary-900/20"
                                    >
                                        {editingArea ? 'Update Area' : 'Save Area'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Areas;

import React, { useState } from 'react';
import { useGetAreasQuery, useCreateAreaMutation, useUpdateAreaMutation, useDeleteAreaMutation } from '../../features/areas/areasApi';
import { MapPin, Plus, Trash2, Edit2, Store, TrendingUp, X, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

const Areas = () => {
    const { data: areas, isLoading } = useGetAreasQuery();
    const [createArea] = useCreateAreaMutation();
    const [updateArea] = useUpdateAreaMutation();
    const [deleteArea] = useDeleteAreaMutation();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingArea, setEditingArea] = useState(null);
    const [formData, setFormData] = useState({ name: '', description: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingArea) {
                await updateArea({ id: editingArea._id, ...formData }).unwrap();
                toast.success('Area updated!');
            } else {
                await createArea(formData).unwrap();
                toast.success('Area created!');
            }
            closeModal();
        } catch (err) {
            toast.error(err?.data?.message || 'Action failed');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure? This cannot be undone if shops are linked.')) return;
        try {
            await deleteArea(id).unwrap();
            toast.success('Area removed');
        } catch (err) {
            toast.error(err?.data?.message || 'Delete failed');
        }
    };

    const openModal = (area = null) => {
        if (area) {
            setEditingArea(area);
            setFormData({ name: area.name, description: area.description || '' });
        } else {
            setEditingArea(null);
            setFormData({ name: '', description: '' });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingArea(null);
        setFormData({ name: '', description: '' });
    };

    if (isLoading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <Loader2 className="w-10 h-10 text-[#16a34a] animate-spin" />
        </div>
    );

    return (
        <div className="p-6 lg:p-8 bg-gray-50 min-h-screen space-y-6">

            {/* Header */}
            <div className="bg-white border-2 border-gray-100 rounded-2xl p-6 flex items-center justify-between shadow-sm">
                <div>
                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Admin</p>
                    <h1 className="text-3xl font-black text-gray-900">
                        Market <span className="text-[#16a34a]">Regions</span>
                    </h1>
                    <p className="text-gray-400 text-sm font-medium mt-1">Static distribution delivery zones</p>
                </div>
                <div className="flex items-center gap-2 bg-green-50 text-[#16a34a] px-4 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest border-2 border-green-100">
                    <MapPin className="w-4 h-4" /> Static Distribution Network
                </div>
            </div>

            {/* Areas Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {areas?.map(area => (
                    <div key={area._id} className="bg-white border-2 border-gray-100 rounded-2xl p-6 space-y-5 hover:border-[#16a34a]/30 hover:shadow-md transition-all group">
                        {/* Area Header */}
                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center border-2 border-green-100">
                                    <MapPin className="text-[#16a34a] w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-black text-gray-900 text-lg tracking-tight">{area.name}</h3>
                                    <p className="text-xs text-gray-400 font-medium mt-0.5">{area.description || 'No description'}</p>
                                </div>
                            </div>
                            <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest bg-gray-50 px-2 py-1 rounded-lg border border-gray-100">
                                Permanent Zone
                            </span>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-blue-50 p-4 rounded-xl border-2 border-blue-100">
                                <p className="text-[10px] text-blue-400 font-black uppercase tracking-widest flex items-center gap-1 mb-1.5">
                                    <Store className="w-3 h-3" /> Total Shops
                                </p>
                                <p className="text-2xl font-black text-blue-700">{area.shopCount || 0}</p>
                            </div>
                            <div className="bg-green-50 p-4 rounded-xl border-2 border-green-100">
                                <p className="text-[10px] text-green-500 font-black uppercase tracking-widest flex items-center gap-1 mb-1.5">
                                    <TrendingUp className="w-3 h-3" /> Revenue
                                </p>
                                <p className="text-xl font-black text-[#16a34a]">₹{area.totalRevenue?.toLocaleString('en-IN') || 0}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Areas;

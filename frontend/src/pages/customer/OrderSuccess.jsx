import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useGetOrderByIdQuery } from '../../features/orders/ordersApi';
import Navbar from '../../components/layout/Navbar';
import InvoicePDF from '../../components/orders/InvoicePDF';
import { CheckCircle, Loader2, ArrowLeft, Home, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';

const OrderSuccess = () => {
    const { id } = useParams();
    const { data, isLoading, error } = useGetOrderByIdQuery(id);
    const [downloaded, setDownloaded] = useState(false);

    const order = data?.order;

    useEffect(() => {
        // Auto-scroll to top
        window.scrollTo(0, 0);
    }, []);

    if (isLoading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <Loader2 className="w-12 h-12 text-[#16a34a] animate-spin" />
        </div>
    );

    if (error) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 flex-col gap-4">
            <h1 className="text-2xl font-bold text-red-500">Error loading order</h1>
            <Link to="/dealer/dashboard" className="text-blue-600 underline">Back to Home</Link>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            <Navbar />
            
            <main className="flex-1 max-w-5xl mx-auto px-4 py-12 w-full">
                
                {/* Success Message Card */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-3xl p-10 shadow-xl border border-gray-100 text-center mb-12"
                >
                    <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-12 h-12 text-[#16a34a]" />
                    </div>
                    <h1 className="text-4xl font-black text-gray-900 mb-2 italic tracking-tighter">ORDER <span className="text-[#16a34a]">CONFIRMED!</span></h1>
                    <p className="text-gray-500 font-bold mb-8">Your order <span className="text-black">#{id.slice(-8).toUpperCase()}</span> has been placed successfully.</p>
                    
                    <div className="flex flex-wrap items-center justify-center gap-4">
                        <Link 
                            to="/dealer/dashboard" 
                            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 transition-all"
                        >
                            <Home size={18} /> Home
                        </Link>
                        <Link 
                            to="/dealer/products" 
                            className="bg-[#16a34a] hover:bg-[#15803d] text-white px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 transition-all shadow-lg shadow-green-200"
                        >
                            <ShoppingBag size={18} /> Continue Shopping
                        </Link>
                    </div>
                </motion.div>

                {/* Invoice Section */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-black text-gray-900 italic uppercase tracking-tight">Your <span className="text-[#16a34a]">Invoice</span></h2>
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Scroll down to preview</span>
                    </div>
                    
                    <InvoicePDF 
                        order={order} 
                        onDownloadComplete={() => setDownloaded(true)} 
                    />
                </div>

            </main>
        </div>
    );
};

export default OrderSuccess;

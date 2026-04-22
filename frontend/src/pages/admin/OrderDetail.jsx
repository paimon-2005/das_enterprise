import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useGetOrderByIdQuery } from '../../features/orders/ordersApi';
import { 
    ArrowLeft, Store, User, MapPin, Phone, CreditCard, Calendar,
    Hash, Package, IndianRupee, Loader2, Truck, Clock, CheckCircle2, XCircle, FileText
} from 'lucide-react';
import InvoicePDF from '../../components/orders/InvoicePDF';

const OrderDetail = () => {
    const { id } = useParams();
    const { data: orderData, isLoading } = useGetOrderByIdQuery(id);
    const order = orderData?.order;

    const getStatusStyle = (status) => {
        switch (status) {
            case 'pending': return { icon: <Clock className="w-5 h-5 text-yellow-500" />, badge: 'bg-yellow-50 text-yellow-700 border-yellow-200' };
            case 'delivered': return { icon: <CheckCircle2 className="w-5 h-5 text-green-600" />, badge: 'bg-green-50 text-green-700 border-green-200' };
            case 'cancelled': return { icon: <XCircle className="w-5 h-5 text-red-500" />, badge: 'bg-red-50 text-red-700 border-red-200' };
            default: return { icon: <Truck className="w-5 h-5 text-blue-500" />, badge: 'bg-blue-50 text-blue-700 border-blue-200' };
        }
    };

    if (isLoading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
                <Loader2 className="w-12 h-12 text-[#16a34a] animate-spin mx-auto mb-4" />
                <p className="text-gray-400 font-medium">Loading order details...</p>
            </div>
        </div>
    );
    if (!order) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <p className="text-gray-500 font-medium">Order not found</p>
        </div>
    );

    const statusStyle = getStatusStyle(order.orderStatus);

    return (
        <div className="p-6 lg:p-8 space-y-6 bg-gray-50 min-h-screen">
            <div className="max-w-6xl mx-auto space-y-6">
                
                {/* Header */}
                <div className="bg-white border-2 border-gray-100 rounded-2xl p-6 flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-4">
                        <Link to="/admin/orders" className="p-2.5 bg-gray-50 border-2 border-gray-200 rounded-xl hover:border-[#16a34a] hover:text-[#16a34a] transition-all">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-black text-gray-900">Order Details</h1>
                            <p className="text-gray-400 text-xs font-mono mt-0.5">ID: {order._id}</p>
                        </div>
                    </div>
                    <div className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 font-black text-sm uppercase ${statusStyle.badge}`}>
                        {statusStyle.icon}
                        {order.orderStatus}
                    </div>
                </div>

                <div className="bg-white border-2 border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center">
                            <FileText className="w-6 h-6 text-[#16a34a]" />
                        </div>
                        <div>
                            <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider">Professional Invoice</h3>
                            <p className="text-xs font-bold text-gray-400 uppercase">DAS ENTERPRISE FORMAT</p>
                        </div>
                    </div>
                    <div className="w-full md:w-auto scale-90 md:scale-100">
                        <InvoicePDF order={order} />
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* LEFT: Items + Billing */}
                    <div className="lg:col-span-2 space-y-5">
                        
                        {/* Items Table */}
                        <div className="bg-white border-2 border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                            <div className="px-6 py-4 border-b-2 border-gray-100 flex items-center gap-3">
                                <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
                                    <Package className="w-4 h-4 text-[#16a34a]" />
                                </div>
                                <h2 className="text-sm font-black text-gray-900 uppercase tracking-wider">Order Items</h2>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50 text-[10px] font-black text-gray-500 uppercase tracking-widest border-b-2 border-gray-100">
                                        <tr>
                                            <th className="px-6 py-4">Product Name</th>
                                            <th className="px-6 py-4">Price</th>
                                            <th className="px-6 py-4">Qty</th>
                                            <th className="px-6 py-4 text-right">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y-2 divide-gray-50">
                                        {order.items.map((item, i) => (
                                            <tr key={i} className="hover:bg-green-50/30 transition-colors">
                                                <td className="px-6 py-4 text-sm font-bold text-gray-900">{item.productName}</td>
                                                <td className="px-6 py-4 text-sm text-gray-500 font-medium">₹{item.price.toLocaleString('en-IN')}</td>
                                                <td className="px-6 py-4 text-sm text-gray-900 font-black">×{item.quantity}</td>
                                                <td className="px-6 py-4 text-sm font-black text-[#16a34a] text-right">₹{item.total.toLocaleString('en-IN')}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Billing Summary */}
                        <div className="bg-white border-2 border-gray-100 rounded-2xl p-6 shadow-sm">
                            <div className="space-y-3">
                                <div className="flex justify-between text-sm font-medium text-gray-500">
                                    <span>Subtotal</span>
                                    <span className="font-bold text-gray-900">₹{order.subtotal.toLocaleString('en-IN')}</span>
                                </div>
                                <div className="flex justify-between text-sm font-medium text-gray-500">
                                    <span>Tax (18% GST)</span>
                                    <span className="font-bold text-gray-900">₹{order.tax.toLocaleString('en-IN')}</span>
                                </div>
                                <div className="flex justify-between pt-4 border-t-2 border-gray-100">
                                    <span className="text-lg font-black text-gray-900">Grand Total</span>
                                    <span className="text-3xl font-black text-[#16a34a]">₹{order.totalPrice.toLocaleString('en-IN')}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: Shop Info + Timeline */}
                    <div className="space-y-5">
                        
                        {/* Shop Information */}
                        <div className="bg-white border-2 border-[#16a34a]/20 rounded-2xl overflow-hidden shadow-sm">
                            <div className="px-6 py-4 border-b-2 border-gray-100 flex items-center gap-3 bg-green-50">
                                <Store className="w-5 h-5 text-[#16a34a]" />
                                <h2 className="text-sm font-black text-[#16a34a] uppercase tracking-wider">Shop Information</h2>
                            </div>
                            <div className="p-6 space-y-5">
                                <div>
                                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Shop Name</p>
                                    <p className="text-xl font-black text-gray-900">{order.shopName}</p>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-gray-50 p-3 rounded-xl">
                                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest flex items-center gap-1 mb-1">
                                            <User className="w-3 h-3 text-[#16a34a]" /> Owner
                                        </p>
                                        <p className="text-sm font-bold text-gray-900">{order.ownerName}</p>
                                    </div>
                                    <div className="bg-gray-50 p-3 rounded-xl">
                                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest flex items-center gap-1 mb-1">
                                            <MapPin className="w-3 h-3 text-[#16a34a]" /> Area
                                        </p>
                                        <p className="text-sm font-black text-[#16a34a] uppercase">{order.area}</p>
                                    </div>
                                </div>

                                <div className="pt-4 border-t-2 border-gray-100">
                                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1.5">Delivery Address</p>
                                    <p className="text-sm text-gray-600 font-medium leading-relaxed">{order.shopAddress}</p>
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t-2 border-gray-100">
                                    <div>
                                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">WhatsApp</p>
                                        <p className="text-sm font-bold text-gray-900 flex items-center gap-2">
                                            <Phone className="w-3 h-3 text-green-500" />
                                            {order.phone}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Payment Term</p>
                                        <span className="px-3 py-1.5 bg-green-50 text-[#16a34a] text-xs font-black uppercase rounded-xl border-2 border-green-100">
                                            {order.paymentTerm}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Timeline / Metadata */}
                        <div className="bg-white border-2 border-gray-100 p-6 rounded-2xl space-y-4 shadow-sm">
                            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Order Timeline</h3>
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center shrink-0">
                                    <Calendar className="w-4 h-4 text-blue-500" />
                                </div>
                                <div>
                                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Order Placed At</p>
                                    <p className="text-sm font-bold text-gray-900">{new Date(order.createdAt).toLocaleString('en-IN')}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                <div className="w-9 h-9 bg-orange-50 rounded-lg flex items-center justify-center shrink-0">
                                    <Clock className="w-4 h-4 text-orange-500" />
                                </div>
                                <div>
                                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Last Update</p>
                                    <p className="text-sm font-bold text-gray-900">{new Date(order.updatedAt).toLocaleString('en-IN')}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetail;

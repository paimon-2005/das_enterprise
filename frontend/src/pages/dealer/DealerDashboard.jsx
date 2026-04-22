import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { selectCurrentUser } from '../../features/auth/authSlice';
import { useGetMyOrdersQuery } from '../../features/orders/ordersApi';
import { 
    ShoppingBag, 
    Clock, 
    CreditCard, 
    CheckCircle2, 
    ArrowRight,
    Store,
    MapPin,
    AlertCircle,
    Package
} from 'lucide-react';

const DealerDashboard = () => {
    const user = useSelector(selectCurrentUser);
    const { data: orderData, isLoading } = useGetMyOrdersQuery();
    
    // Calculate simple stats
    const orders = orderData?.orders || [];
    const pendingOrders = orders.filter(o => o.orderStatus === 'pending').length;
    const totalSpent = orders.reduce((acc, curr) => acc + curr.totalPrice, 0);

    return (
        <div className="space-y-8 p-4 lg:p-8 bg-gray-50 min-h-screen text-gray-900">

            {/* Welcome Banner */}
            <div className="bg-gradient-to-r from-[#16a34a] to-[#15803d] rounded-3xl p-6 md:p-8 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-lg shadow-green-200">
                <div>
                    <p className="text-green-200 font-bold text-sm uppercase tracking-widest mb-1">Welcome Back</p>
                    <h1 className="text-3xl md:text-4xl font-black tracking-tight">
                        {user?.shopName}
                    </h1>
                    <div className="flex flex-wrap items-center gap-4 mt-3">
                        <div className="flex items-center gap-2 text-green-100 text-sm font-medium">
                            <MapPin className="w-4 h-4" />
                            {user?.area || 'Area'}
                        </div>
                        <div className="flex items-center gap-2 text-green-100 text-sm font-medium">
                            <Store className="w-4 h-4" />
                            {user?.name} (Owner)
                        </div>
                    </div>
                </div>
                <Link 
                    to="/dealer/products"
                    className="bg-white text-[#16a34a] hover:bg-green-50 px-7 py-4 rounded-2xl font-black flex items-center gap-3 transition-all shadow-md text-base whitespace-nowrap"
                >
                    <ShoppingBag className="w-5 h-5" />
                    Browse &amp; Order Products
                    <ArrowRight className="w-5 h-5" />
                </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white border-2 border-blue-50 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4">
                        <ShoppingBag className="w-6 h-6 text-blue-500" />
                    </div>
                    <p className="text-gray-500 text-sm font-semibold">Total Orders</p>
                    <h3 className="text-3xl font-black mt-1 text-gray-900">{isLoading ? '...' : orders.length}</h3>
                </div>

                <div className="bg-white border-2 border-yellow-50 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 bg-yellow-50 rounded-xl flex items-center justify-center mb-4">
                        <Clock className="w-6 h-6 text-yellow-500" />
                    </div>
                    <p className="text-gray-500 text-sm font-semibold">Pending Orders</p>
                    <h3 className="text-3xl font-black mt-1 text-yellow-600">{isLoading ? '...' : pendingOrders}</h3>
                </div>

                <div className="bg-white border-2 border-green-50 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center mb-4">
                        <CheckCircle2 className="w-6 h-6 text-[#16a34a]" />
                    </div>
                    <p className="text-gray-500 text-sm font-semibold">Total Spent</p>
                    <h3 className="text-2xl font-black mt-1 text-[#16a34a]">₹{isLoading ? '...' : totalSpent.toLocaleString('en-IN')}</h3>
                </div>

                <div className="bg-white border-2 border-red-50 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center mb-4">
                        <CreditCard className="w-6 h-6 text-red-500" />
                    </div>
                    <p className="text-gray-500 text-sm font-semibold">Current Due</p>
                    <h3 className="text-2xl font-black mt-1 text-red-600">₹{user?.currentDue?.toLocaleString('en-IN') || 0}</h3>
                    {user?.currentDue > user?.creditLimit && (
                        <div className="flex items-center gap-1 mt-2 text-xs text-red-500 font-bold">
                            <AlertCircle className="w-3 h-3" />
                            Over Credit Limit
                        </div>
                    )}
                </div>
            </div>

            {/* Quick Action Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Link to="/dealer/products" className="bg-white border-2 border-gray-100 p-6 rounded-2xl flex items-center gap-4 hover:border-[#16a34a] hover:shadow-md transition-all group">
                    <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center group-hover:bg-[#16a34a] transition-colors">
                        <ShoppingBag className="w-7 h-7 text-[#16a34a] group-hover:text-white transition-colors" />
                    </div>
                    <div>
                        <p className="font-black text-gray-900 text-base">Order Products</p>
                        <p className="text-gray-400 text-sm">Browse wholesale catalogue</p>
                    </div>
                </Link>
                <Link to="/dealer/orders" className="bg-white border-2 border-gray-100 p-6 rounded-2xl flex items-center gap-4 hover:border-[#16a34a] hover:shadow-md transition-all group">
                    <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center group-hover:bg-[#16a34a] transition-colors">
                        <Package className="w-7 h-7 text-blue-500 group-hover:text-white transition-colors" />
                    </div>
                    <div>
                        <p className="font-black text-gray-900 text-base">Order History</p>
                        <p className="text-gray-400 text-sm">Track all your orders</p>
                    </div>
                </Link>
                <Link to="/dealer/profile" className="bg-white border-2 border-gray-100 p-6 rounded-2xl flex items-center gap-4 hover:border-[#16a34a] hover:shadow-md transition-all group">
                    <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center group-hover:bg-[#16a34a] transition-colors">
                        <Store className="w-7 h-7 text-purple-500 group-hover:text-white transition-colors" />
                    </div>
                    <div>
                        <p className="font-black text-gray-900 text-base">Shop Profile</p>
                        <p className="text-gray-400 text-sm">Your shop details</p>
                    </div>
                </Link>
            </div>

            {/* Recent Orders Section */}
            <div className="bg-white border-2 border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                <div className="p-6 border-b-2 border-gray-100 flex items-center justify-between">
                    <h2 className="text-xl font-black text-gray-900">Recent Orders</h2>
                    <Link to="/dealer/orders" className="text-[#16a34a] text-sm font-bold hover:underline flex items-center gap-1 bg-green-50 px-4 py-2 rounded-xl border border-green-100">
                        View All <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider font-black border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Items Summary</th>
                                <th className="px-6 py-4">Total ₹</th>
                                <th className="px-6 py-4">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {orders.slice(0, 5).map((order) => (
                                <tr key={order._id} className="hover:bg-green-50/30 transition-colors">
                                    <td className="px-6 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                                        {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                            day: '2-digit',
                                            month: 'short',
                                            year: 'numeric'
                                        })}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {order.items.map(i => `${i.productName} x${i.quantity}`).join(', ').substring(0, 45)}...
                                    </td>
                                    <td className="px-6 py-4 text-sm font-black text-[#16a34a]">
                                        ₹{order.totalPrice.toLocaleString('en-IN')}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border
                                            ${order.orderStatus === 'delivered' ? 'bg-green-50 text-green-700 border-green-100' : 
                                              order.orderStatus === 'pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-100' : 
                                              'bg-blue-50 text-blue-700 border-blue-100'}`}>
                                            {order.orderStatus}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {orders.length === 0 && !isLoading && (
                                <tr>
                                    <td colSpan="4" className="px-6 py-16 text-center">
                                        <ShoppingBag className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                                        <p className="text-gray-400 font-medium">No orders placed yet. Start browsing to create your first order!</p>
                                        <Link to="/dealer/products" className="mt-4 inline-flex items-center gap-2 bg-[#16a34a] text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-[#15803d] transition-colors">
                                            Browse Products <ArrowRight className="w-4 h-4" />
                                        </Link>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default DealerDashboard;

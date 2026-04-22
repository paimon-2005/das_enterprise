import React from 'react';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../features/auth/authSlice';
import { 
    User, 
    Store, 
    MapPin, 
    Phone, 
    CreditCard, 
    ShieldCheck, 
    AlertCircle,
    Copy,
    ExternalLink,
    Mail,
    Briefcase,
    CheckCircle2
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const DealerProfile = () => {
    const user = useSelector(selectCurrentUser);

    const copyToClipboard = (text, label) => {
        navigator.clipboard.writeText(text);
        toast.success(`${label} copied!`, {
            style: {
                borderRadius: '10px',
                background: '#fff',
                color: '#111',
                border: '1px solid #eee'
            }
        });
    };

    const InfoRow = ({ icon: Icon, label, value, copyable = false, accent = false }) => (
        <div className={`flex items-center justify-between p-3 sm:p-4 rounded-xl sm:rounded-2xl border-2 transition-all hover:shadow-sm ${accent ? 'bg-green-50 border-green-100' : 'bg-white border-gray-100'}`}>
            <div className="flex items-center gap-3 sm:gap-4">
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center shrink-0 ${accent ? 'bg-[#16a34a]' : 'bg-gray-100'}`}>
                    <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${accent ? 'text-white' : 'text-gray-500'}`} />
                </div>
                <div>
                    <p className="text-[10px] text-gray-400 font-black tracking-widest uppercase mb-0.5">{label}</p>
                    <p className={`text-sm sm:text-base font-black ${accent ? 'text-[#16a34a]' : 'text-gray-900'}`}>{value || 'N/A'}</p>
                </div>
            </div>
            {copyable && value && (
                <button 
                    onClick={() => copyToClipboard(value, label)}
                    className="p-2 sm:p-2.5 hover:bg-gray-100 rounded-lg sm:rounded-xl text-gray-400 hover:text-[#16a34a] transition-all border border-gray-200"
                    title="Copy"
                >
                    <Copy className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
            )}
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
            <div className="max-w-4xl mx-auto space-y-6">
                
                {/* Profile Hero Card */}
                <div className="bg-gradient-to-r from-[#16a34a] to-[#15803d] rounded-3xl p-6 md:p-8 text-white shadow-lg shadow-green-200">
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                        <div className="w-24 h-24 md:w-28 md:h-28 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center text-4xl md:text-5xl font-black text-white border-4 border-white/30 shrink-0">
                            {user?.shopName?.charAt(0).toUpperCase()}
                        </div>
                        <div className="space-y-3 text-center md:text-left flex-1">
                            <div>
                                <h1 className="text-3xl md:text-4xl font-black tracking-tight">{user?.shopName}</h1>
                                <div className="flex items-center justify-center md:justify-start gap-2 mt-1">
                                    <CheckCircle2 className="w-4 h-4 text-green-300" />
                                    <p className="text-green-200 font-bold">Verified Distribution Partner</p>
                                </div>
                            </div>
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                                <span className="px-4 py-1.5 bg-white/20 backdrop-blur-sm text-white text-sm font-black rounded-xl border border-white/30">
                                    {user?.businessType}
                                </span>
                                <span className="px-4 py-1.5 bg-white/10 backdrop-blur-sm text-white/80 text-sm font-bold rounded-xl border border-white/20">
                                    Joined {new Date(user?.createdAt).getFullYear()}
                                </span>
                            </div>
                        </div>
                        <div className="shrink-0">
                            <div className="px-5 py-3 bg-white/10 border-2 border-white/20 text-white/60 font-bold rounded-xl text-sm text-center cursor-not-allowed">
                                🔒 Settings Locked
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Shop Information */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 px-1">
                            <div className="w-1 h-5 bg-[#16a34a] rounded-full"></div>
                            <h2 className="text-base font-black text-gray-700 uppercase tracking-widest">Shop Details</h2>
                        </div>
                        <div className="space-y-3">
                            <InfoRow icon={User} label="Owner Name" value={user?.name} />
                            <InfoRow icon={Store} label="Shop Name" value={user?.shopName} accent />
                            <InfoRow icon={MapPin} label="Delivery Area" value={user?.area} />
                            {/* Full Address */}
                            <div className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 bg-white rounded-xl sm:rounded-2xl border-2 border-gray-100">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 rounded-lg sm:rounded-xl flex items-center justify-center shrink-0">
                                    <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500" />
                                </div>
                                <div>
                                    <p className="text-[10px] text-gray-400 font-black tracking-widest uppercase mb-1">Full Shop Address</p>
                                    <p className="text-xs sm:text-sm font-bold text-gray-700 leading-relaxed">{user?.shopAddress || 'Not provided'}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Financial Information */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 px-1">
                            <div className="w-1 h-5 bg-[#16a34a] rounded-full"></div>
                            <h2 className="text-base font-black text-gray-700 uppercase tracking-widest">Business &amp; Credit</h2>
                        </div>
                        <div className="space-y-3">
                            <InfoRow icon={Phone} label="WhatsApp Number" value={user?.phone} copyable={true} />
                            <InfoRow icon={Mail} label="Email Address" value={user?.email} copyable={true} />
                            <InfoRow icon={ShieldCheck} label="GST Number" value={user?.gstNumber || 'Not Provided'} copyable={!!user?.gstNumber} />
                            
                            <div className="grid grid-cols-2 gap-3">
                                <div className="p-4 bg-white rounded-2xl border-2 border-gray-100 text-center hover:border-green-200 transition-all">
                                    <p className="text-[10px] text-gray-400 font-black tracking-widest uppercase mb-2">Payment Term</p>
                                    <p className="text-xl font-black text-[#16a34a] uppercase">{user?.paymentTerm}</p>
                                </div>
                                <div className="p-4 bg-white rounded-2xl border-2 border-gray-100 text-center hover:border-blue-200 transition-all">
                                    <p className="text-[10px] text-gray-400 font-black tracking-widest uppercase mb-2">Credit Limit</p>
                                    <p className="text-xl font-black text-gray-900">₹{user?.creditLimit?.toLocaleString('en-IN') || 0}</p>
                                </div>
                            </div>

                            {/* Current Due */}
                            <div className="p-5 bg-red-50 border-2 border-red-100 rounded-2xl flex items-center justify-between">
                                <div className="flex items-center gap-3 sm:gap-4">
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-100 rounded-lg sm:rounded-xl flex items-center justify-center">
                                        <CreditCard className="text-red-500 w-5 h-5 sm:w-6 sm:h-6" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-red-400 font-black tracking-widest uppercase mb-1">Current Due Amount</p>
                                        <p className="text-xl sm:text-2xl font-black text-red-600">₹{user?.currentDue?.toLocaleString('en-IN') || 0}</p>
                                    </div>
                                </div>
                                {user?.currentDue > user?.creditLimit && (
                                    <div className="text-red-500">
                                        <AlertCircle className="w-7 h-7" />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Support Banner */}
                <div className="p-6 bg-green-50 border-2 border-green-100 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-center sm:text-left">
                        <p className="font-black text-gray-800 text-base mb-1">Need to update your details?</p>
                        <p className="text-sm text-gray-500 font-medium">To update your Shop Name, Address, or Payment Terms, contact our Support Team or Admin via WhatsApp.</p>
                    </div>
                    <a 
                        href={`https://wa.me/91${user?.phone}`} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="inline-flex items-center gap-2 bg-[#16a34a] hover:bg-[#15803d] text-white font-black px-6 py-3 rounded-xl transition-all shadow-md shadow-green-200 whitespace-nowrap"
                    >
                        Contact Support <ExternalLink className="w-4 h-4" />
                    </a>
                </div>
            </div>
        </div>
    );
};

export default DealerProfile;

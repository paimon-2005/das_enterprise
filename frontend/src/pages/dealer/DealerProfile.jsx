import React from 'react';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../features/auth/authSlice';
import {
    User, Store, MapPin, Phone, CreditCard, ShieldCheck,
    AlertCircle, Copy, ExternalLink, Mail, CheckCircle2
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { clsx } from 'clsx';

const DealerProfile = () => {
    const user = useSelector(selectCurrentUser);

    const copyToClipboard = (text, label) => {
        navigator.clipboard.writeText(text);
        toast.success(`${label} copied!`);
    };

    const InfoRow = ({ icon: Icon, label, value, copyable = false, accent = false }) => (
        <div className={clsx(
            'flex items-center justify-between p-4 rounded-xl border transition-all hover:shadow-sm',
            accent ? 'bg-primary-50 border-primary-100' : 'bg-card border-gray-100',
        )}>
            <div className="flex items-center gap-3">
                <div className={clsx(
                    'w-10 h-10 rounded-lg flex items-center justify-center shrink-0',
                    accent ? 'bg-primary-600' : 'bg-surface border border-gray-100',
                )}>
                    <Icon className={clsx('w-5 h-5', accent ? 'text-white' : 'text-[#0000ff]')} />
                </div>
                <div>
                    <p className="text-[10px] text-txt-secondary font-medium tracking-widest uppercase mb-0.5">{label}</p>
                    <p className={clsx('text-sm font-semibold', accent ? 'text-primary-700' : 'text-txt-primary')}>
                        {value || 'N/A'}
                    </p>
                </div>
            </div>
            {copyable && value && (
                <button
                    onClick={() => copyToClipboard(value, label)}
                    className="p-2 hover:bg-gray-100 rounded-lg text-txt-secondary hover:text-primary-600 transition-all border border-gray-100"
                    title="Copy"
                >
                    <Copy className="w-3.5 h-3.5" />
                </button>
            )}
        </div>
    );

    return (
        <div className="page-wrapper max-w-4xl mx-auto">

            {/* Profile hero */}
            <div className="bg-primary-800 rounded-xl p-6 text-white shadow-md">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                    <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center text-4xl font-bold text-white border-2 border-white/20 shrink-0">
                        {user?.shopName?.charAt(0).toUpperCase() || 'S'}
                    </div>
                    <div className="flex-1 text-center md:text-left">
                        <h1 className="text-2xl font-bold tracking-tight">{user?.shopName || 'Shop Profile'}</h1>
                        <div className="flex items-center justify-center md:justify-start gap-2 mt-1">
                            <CheckCircle2 className="w-4 h-4 text-primary-300" />
                            <p className="text-primary-200 text-sm font-medium">Verified Distribution Partner</p>
                        </div>
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mt-3">
                            {user?.businessType && (
                                <span className="px-3 py-1 bg-white/10 text-white text-xs font-semibold rounded-lg border border-white/20">
                                    {user.businessType}
                                </span>
                            )}
                            <span className="px-3 py-1 bg-white/10 text-white/80 text-xs font-semibold rounded-lg border border-white/20">
                                Joined {user?.createdAt ? new Date(user.createdAt).getFullYear() : '—'}
                            </span>
                        </div>
                    </div>
                    <div className="px-4 py-2 bg-white/10 border border-white/20 text-white/60 font-medium rounded-lg text-sm cursor-not-allowed shrink-0">
                        🔒 Settings Locked
                    </div>
                </div>
            </div>

            {/* Info grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">

                {/* Shop details */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2 px-1 mb-4">
                        <div className="w-1 h-4 bg-primary-600 rounded-full" />
                        <h2 className="text-xs font-semibold text-txt-secondary uppercase tracking-widest">Shop Details</h2>
                    </div>
                    <InfoRow icon={User}   label="Owner Name"    value={user?.name} />
                    <InfoRow icon={Store}  label="Shop Name"     value={user?.shopName} accent />
                    <InfoRow icon={MapPin} label="Delivery Area" value={user?.area} />
                    <div className="flex items-start gap-3 p-4 bg-card rounded-xl border border-gray-100">
                        <div className="w-10 h-10 bg-surface border border-gray-100 rounded-lg flex items-center justify-center shrink-0">
                            <MapPin className="w-5 h-5 text-[#0000ff]" />
                        </div>
                        <div>
                            <p className="text-[10px] text-txt-secondary font-medium tracking-widest uppercase mb-1">Full Shop Address</p>
                            <p className="text-sm font-medium text-txt-primary leading-relaxed">{user?.shopAddress || 'Not provided'}</p>
                        </div>
                    </div>
                </div>

                {/* Business & credit */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2 px-1 mb-4">
                        <div className="w-1 h-4 bg-primary-600 rounded-full" />
                        <h2 className="text-xs font-semibold text-txt-secondary uppercase tracking-widest">Business & Credit</h2>
                    </div>
                    <InfoRow icon={Phone}      label="WhatsApp Number" value={user?.phone}                         copyable />
                    <InfoRow icon={Mail}       label="Email Address"   value={user?.email}                         copyable />
                    <InfoRow icon={ShieldCheck} label="GST Number"    value={user?.gstNumber || 'Not Provided'}   copyable={!!user?.gstNumber} />

                    <div className="grid grid-cols-2 gap-3">
                        <div className="p-4 bg-card border border-gray-100 rounded-xl text-center hover:border-primary-200 transition-all">
                            <p className="text-[10px] text-txt-secondary font-medium uppercase tracking-widest mb-2">Payment Term</p>
                            <p className="text-lg font-bold text-primary-600 uppercase">{user?.paymentTerm || '—'}</p>
                        </div>
                        <div className="p-4 bg-card border border-gray-100 rounded-xl text-center hover:border-blue-200 transition-all">
                            <p className="text-[10px] text-txt-secondary font-medium uppercase tracking-widest mb-2">Credit Limit</p>
                            <p className="text-lg font-bold text-txt-primary">₹{(user?.creditLimit || 0).toLocaleString('en-IN')}</p>
                        </div>
                    </div>

                    {/* Due amount */}
                    <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                                <CreditCard className="text-red-500 w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-[10px] text-red-400 font-medium uppercase tracking-widest mb-1">Current Due</p>
                                <p className="text-xl font-bold text-red-600">₹{(user?.currentDue || 0).toLocaleString('en-IN')}</p>
                            </div>
                        </div>
                        {user?.currentDue > user?.creditLimit && (
                            <AlertCircle className="w-6 h-6 text-red-500" />
                        )}
                    </div>
                </div>
            </div>

            {/* Support banner */}
            <div className="mt-6 p-5 bg-primary-50 border border-primary-100 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-center sm:text-left">
                    <p className="font-semibold text-txt-primary text-sm mb-1">Need to update your details?</p>
                    <p className="text-xs text-txt-secondary">To update your Shop Name, Address, or Payment Terms, contact our Support Team via WhatsApp.</p>
                </div>
                <a
                    href={`https://wa.me/91${user?.phone || ''}`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-primary inline-flex items-center gap-2 text-sm whitespace-nowrap"
                >
                    Contact Support <ExternalLink className="w-4 h-4" />
                </a>
            </div>
        </div>
    );
};

export default DealerProfile;

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    User, Store, MapPin, Phone, CreditCard, 
    ChevronRight, ChevronLeft, CheckCircle, 
    Mail, Lock, Briefcase, FileText, Loader2
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useRegisterMutation } from '../../features/auth/authApi';
import { toast } from 'react-hot-toast';

// Static delivery areas — admin knows all shops (max 60), no DB lookup needed
const AREAS = ['Mogra', 'Jirat', 'Kuntighat'];

const RegisterShop = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [register, { isLoading: isRegistering }] = useRegisterMutation();

    const [formData, setFormData] = useState({
        ownerName: '',
        email: '',
        password: '',
        confirmPassword: '',
        shopName: '',
        businessType: 'Kirana Store',
        area: '',
        shopAddress: '',
        phone: '',
        gstNumber: '',
        paymentTerm: 'cash'
    });


    const handleNext = () => setStep(s => s + 1);
    const handleBack = () => setStep(s => s - 1);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            return toast.error('Passwords do not match');
        }

        try {
            await register({ ...formData, role: 'dealer' }).unwrap();
            toast.success('Registration submitted! Awaiting approval.');
            setStep(4); // Success step
        } catch (err) {
            toast.error(err?.data?.message || 'Registration failed');
        }
    };

    const inputClasses = "w-full bg-gray-50 border-none rounded-2xl p-4 text-gray-900 focus:ring-2 focus:ring-primary-600 transition-all font-medium text-sm";
    const labelClasses = "block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1";

    return (
        <div className="min-h-screen bg-[#f8fafc] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-jakarta">
            <div className="max-w-xl w-full mx-auto">
                {/* Brand / Logo */}
                <div className="text-center mb-10">
                    <Link to="/" className="inline-flex items-center gap-2 mb-4">
                        <div className="bg-primary-600 p-2 rounded-xl text-white">
                            <Store size={24} />
                        </div>
                        <span className="text-2xl font-black text-gray-900 tracking-tighter italic">DAS Enterprise</span>
                    </Link>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Dealer Registration</h1>
                    <p className="text-gray-500 mt-2 font-medium">Join our distribution network today</p>
                </div>

                {/* Progress Bar */}
                {step < 4 && (
                    <div className="mb-12 flex justify-between relative px-2">
                        <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -translate-y-1/2 -z-10" />
                        <div 
                            className="absolute top-1/2 left-0 h-1 bg-primary-600 -translate-y-1/2 -z-10 transition-all duration-500" 
                            style={{ width: `${((step - 1) / 2) * 100}%` }}
                        />
                        {[1, 2, 3].map((s) => (
                            <div 
                                key={s}
                                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${
                                    step >= s ? 'bg-primary-600 text-white shadow-lg shadow-primary-900/20' : 'bg-white text-gray-400 border-2 border-gray-200'
                                }`}
                            >
                                {step > s ? <CheckCircle size={20} /> : s}
                            </div>
                        ))}
                    </div>
                )}

                <div className="bg-white rounded-[3rem] shadow-2xl shadow-gray-200/50 p-10 border border-gray-100 overflow-hidden relative">
                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div 
                                key="step1"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="bg-blue-50 text-blue-600 p-3 rounded-2xl">
                                        <User size={24} />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-900">Account Details</h2>
                                        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Step 01 / 03</p>
                                    </div>
                                </div>

                                <div>
                                    <label className={labelClasses}>Owner Full Name</label>
                                    <input 
                                        type="text" 
                                        required
                                        className={inputClasses}
                                        placeholder="Enter your full name"
                                        value={formData.ownerName}
                                        onChange={(e) => setFormData({...formData, ownerName: e.target.value})}
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className={labelClasses}>Email Address</label>
                                        <input 
                                            type="email" 
                                            required
                                            className={inputClasses}
                                            placeholder="you@example.com"
                                            value={formData.email}
                                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                                        />
                                    </div>
                                    <div>
                                        <label className={labelClasses}>WhatsApp Number</label>
                                        <input 
                                            type="tel" 
                                            required
                                            className={inputClasses}
                                            placeholder="91XXXXXXXXXX"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className={labelClasses}>Password</label>
                                        <input 
                                            type="password" 
                                            required
                                            className={inputClasses}
                                            placeholder="••••••••"
                                            value={formData.password}
                                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                                        />
                                    </div>
                                    <div>
                                        <label className={labelClasses}>Confirm Password</label>
                                        <input 
                                            type="password" 
                                            required
                                            className={inputClasses}
                                            placeholder="••••••••"
                                            value={formData.confirmPassword}
                                            onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                                        />
                                    </div>
                                </div>
                                <button 
                                    onClick={handleNext}
                                    disabled={!formData.ownerName || !formData.email || !formData.password || !formData.phone}
                                    className="w-full bg-primary-600 hover:bg-primary-700 text-white py-4 rounded-2xl font-black transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:grayscale"
                                >
                                    Proceed to Shop Details
                                    <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div 
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="bg-purple-50 text-purple-600 p-3 rounded-2xl">
                                        <Store size={24} />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-900">Shop Information</h2>
                                        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Step 02 / 03</p>
                                    </div>
                                </div>

                                <div>
                                    <label className={labelClasses}>Shop / Business Name</label>
                                    <input 
                                        type="text" 
                                        required
                                        className={inputClasses}
                                        placeholder="Enter registered shop name"
                                        value={formData.shopName}
                                        onChange={(e) => setFormData({...formData, shopName: e.target.value})}
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className={labelClasses}>Business Type</label>
                                        <select 
                                            className={inputClasses}
                                            value={formData.businessType}
                                            onChange={(e) => setFormData({...formData, businessType: e.target.value})}
                                        >
                                            <option>Kirana Store</option>
                                            <option>Restaurant</option>
                                            <option>Hotel</option>
                                            <option>Canteen</option>
                                            <option>Other</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className={labelClasses}>Delivery Area</label>
                                        <select 
                                            required
                                            className={inputClasses}
                                            value={formData.area}
                                            onChange={(e) => setFormData({...formData, area: e.target.value})}
                                        >
                                            <option value="">Select Area</option>
                                            {AREAS.map(area => (
                                                <option key={area} value={area}>{area}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className={labelClasses}>Full Shop Address</label>
                                    <textarea 
                                        className={`${inputClasses} h-32 resize-none`}
                                        placeholder="Enter complete physical address..."
                                        value={formData.shopAddress}
                                        onChange={(e) => setFormData({...formData, shopAddress: e.target.value})}
                                    />
                                </div>

                                <div className="flex gap-4">
                                    <button 
                                        onClick={handleBack}
                                        className="flex-1 bg-gray-50 text-gray-500 py-4 rounded-2xl font-black hover:bg-gray-100 transition-all flex items-center justify-center gap-2"
                                    >
                                        <ChevronLeft size={20} />
                                        Back
                                    </button>
                                    <button 
                                        onClick={handleNext}
                                        disabled={!formData.shopName || !formData.area}
                                        className="flex-[2] bg-primary-600 hover:bg-primary-700 text-white py-4 rounded-2xl font-black transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
                                    >
                                        Next Step
                                        <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div 
                                key="step3"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="bg-[#16a34a]/10 text-[#16a34a] p-3 rounded-2xl">
                                        <CreditCard size={24} />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-900">Legal & Payment</h2>
                                        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Step 03 / 03</p>
                                    </div>
                                </div>

                                <div>
                                    <label className={labelClasses}>GST Number (Optional)</label>
                                    <input 
                                        type="text" 
                                        className={inputClasses}
                                        placeholder="22AAAAA0000A1Z5"
                                        value={formData.gstNumber}
                                        onChange={(e) => setFormData({...formData, gstNumber: e.target.value.toUpperCase()})}
                                    />
                                </div>
                                <div>
                                    <label className={labelClasses}>Preferred Payment Term</label>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                        {['cash', 'credit', 'weekly'].map((term) => (
                                            <button
                                                key={term}
                                                type="button"
                                                onClick={() => setFormData({...formData, paymentTerm: term})}
                                                className={`py-4 px-2 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all border-2 ${
                                                    formData.paymentTerm === term 
                                                    ? 'bg-primary-50 border-primary-600 text-primary-600' 
                                                    : 'bg-gray-50 border-transparent text-gray-400 hover:bg-gray-100'
                                                }`}
                                            >
                                                {term}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-primary-50 p-6 rounded-3xl border border-primary-100">
                                    <h4 className="flex items-center gap-2 text-primary-800 font-bold mb-2">
                                        <CheckCircle size={18} />
                                        Important Notice
                                    </h4>
                                    <p className="text-xs text-primary-600 leading-relaxed font-medium">
                                        By submitting this form, you request to become an authorized dealer. Our verification team will review your application and approve it within 24-48 hours. You will receive a notification once approved.
                                    </p>
                                </div>

                                <div className="flex gap-4">
                                    <button 
                                        onClick={handleBack}
                                        className="flex-1 bg-gray-50 text-gray-500 py-4 rounded-2xl font-black hover:bg-gray-100 transition-all flex items-center justify-center gap-2"
                                    >
                                        <ChevronLeft size={20} />
                                        Back
                                    </button>
                                    <button 
                                        onClick={handleSubmit}
                                        disabled={isRegistering}
                                        className="flex-[2] bg-gray-900 hover:bg-black text-white py-4 rounded-2xl font-black transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
                                    >
                                        {isRegistering ? <Loader2 className="animate-spin" /> : 'Submit Application'}
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {step === 4 && (
                            <motion.div 
                                key="success"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center py-10"
                            >
                                <div className="w-24 h-24 bg-green-100 text-[#16a34a] rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl shadow-green-100">
                                    <CheckCircle size={48} />
                                </div>
                                <h2 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">Application Submitted!</h2>
                                <p className="text-gray-500 font-medium leading-relaxed mb-10 text-lg">
                                    Thank you for choosing <span className="text-gray-900 font-black">DAS Enterprise</span>. <br/>
                                    Our team will verify your details and activate your account shortly.
                                </p>
                                <Link 
                                    to="/"
                                    className="inline-block bg-primary-600 hover:bg-primary-700 text-white px-10 py-4 rounded-2xl font-black transition-all shadow-xl shadow-primary-900/20 active:scale-95"
                                >
                                    Return to Home
                                </Link>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="text-center mt-8">
                    <p className="text-gray-500 text-sm font-bold">
                        Already have a shop account? <Link to="/" className="text-primary-600 hover:underline">Log in here</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterShop;

import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'react-hot-toast';
import { useRegisterMutation } from '../../features/auth/authApi';
import { setCredentials } from '../../features/auth/authSlice';
import { Store, User, MapPin, Phone, Briefcase, CreditCard, Loader2 } from 'lucide-react';

// Static delivery areas — admin knows all shops (max 60), no DB lookup needed
const AREAS = ['Mogra', 'Jirat', 'Kuntighat'];

const schema = z.object({
    name: z.string().min(3, 'Owner name is required'),
    email: z.string().email('Valid email is required'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
    shopName: z.string().min(3, 'Shop name is required'),
    area: z.string().min(1, 'Please select an area'),
    shopAddress: z.string().optional(),
    phone: z.string().min(10, 'Valid WhatsApp number is required'),
    businessType: z.string().min(1, 'Please select business type'),
    gstNumber: z.string().optional(),
    paymentTerm: z.string().min(1, 'Please select payment term'),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

const Register = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [registerShop, { isLoading }] = useRegisterMutation();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            paymentTerm: 'cash',
            businessType: 'Kirana Store'
        }
    });

    const onSubmit = async (data) => {
        try {
            const res = await registerShop(data).unwrap();
            dispatch(setCredentials(res));
            toast.success(`Welcome! ${res.user.shopName} registered!`);
            navigate('/dealer/dashboard');
        } catch (err) {
            toast.error(err?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Shop Registration</h1>
                    <p className="text-gray-500 mt-2 font-medium">Join our distribution network and start ordering</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        
                        {/* LEFT SECTION: Login Credentials */}
                        <div className="bg-white border border-gray-200 p-8 rounded-2xl space-y-6 shadow-sm">
                            <div className="flex items-center gap-3 mb-2">
                                <User className="text-[#16a34a] w-5 h-5" />
                                <h2 className="text-lg font-semibold text-gray-900">Owner Credentials</h2>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                                    Owner Full Name
                                </label>
                                <input
                                    {...register('name')}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:border-[#16a34a]"
                                    placeholder="e.g. Ramesh Sharma"
                                />
                                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                                    Email Address
                                </label>
                                <input
                                    {...register('email')}
                                    type="email"
                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:border-[#16a34a]"
                                    placeholder="shop@email.com"
                                />
                                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                                        Password
                                    </label>
                                    <input
                                        {...register('password')}
                                        type="password"
                                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:border-[#16a34a]"
                                    />
                                    {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                                        Confirm
                                    </label>
                                    <input
                                        {...register('confirmPassword')}
                                        type="password"
                                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:border-[#16a34a]"
                                    />
                                    {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
                                </div>
                            </div>
                        </div>

                        {/* RIGHT SECTION: Shop Details */}
                        <div className="bg-white border border-gray-200 p-8 rounded-2xl space-y-6 shadow-sm">
                            <div className="flex items-center gap-3 mb-2">
                                <Store className="text-[#16a34a] w-5 h-5" />
                                <h2 className="text-lg font-semibold text-gray-900">Shop Details</h2>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                                        Shop Name
                                    </label>
                                    <input
                                        {...register('shopName')}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:border-[#16a34a]"
                                        placeholder="Sharma Kirana"
                                    />
                                    {errors.shopName && <p className="text-red-500 text-xs mt-1">{errors.shopName.message}</p>}
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                                        Area (Delivery)
                                    </label>
                                    <select
                                        {...register('area')}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:border-[#16a34a]"
                                    >
                                     <option value="">Select Area</option>
                                        {AREAS.map(a => (
                                            <option key={a} value={a}>{a}</option>
                                        ))}
                                    </select>
                                    {errors.area && <p className="text-red-500 text-xs mt-1">{errors.area.message}</p>}
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                                    WhatsApp Number
                                </label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                                    <input
                                        {...register('phone')}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-10 pr-4 py-2 text-gray-900 focus:outline-none focus:border-[#16a34a]"
                                        placeholder="98765 43210"
                                    />
                                </div>
                                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                                    Full Shop Address
                                </label>
                                <textarea
                                    {...register('shopAddress')}
                                    rows="2"
                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:border-[#16a34a]"
                                    placeholder="Shop No., Buildling name, Street..."
                                />
                                {errors.shopAddress && <p className="text-red-500 text-xs mt-1">{errors.shopAddress.message}</p>}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                                        Business Type
                                    </label>
                                    <select
                                        {...register('businessType')}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:border-[#16a34a]"
                                    >
                                        {['Kirana Store', 'Restaurant', 'Hotel', 'Canteen', 'Wholesale', 'Other'].map(type => (
                                            <option key={type} value={type}>{type}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                                        Payment Term
                                    </label>
                                    <select
                                        {...register('paymentTerm')}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:border-[#16a34a]"
                                    >
                                        <option value="cash">Cash on Delivery</option>
                                        <option value="credit">Credit</option>
                                        <option value="weekly">Weekly</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col items-center gap-6 mt-10">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full md:w-96 bg-[#16a34a] hover:bg-[#15803d] text-white font-bold py-4 rounded-xl flex items-center justify-center transition-all shadow-lg shadow-green-500/20 disabled:opacity-50"
                        >
                            {isLoading ? <Loader2 className="animate-spin" /> : 'Complete Registration'}
                        </button>
                        
                        <p className="text-gray-500 text-sm font-medium">
                            Already registered? {' '}
                            <Link to="/login" className="text-[#16a34a] hover:underline font-bold">Sign In</Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;

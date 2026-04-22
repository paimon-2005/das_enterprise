import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'react-hot-toast';
import { useLoginMutation } from '../../features/auth/authApi';
import { setCredentials } from '../../features/auth/authSlice';
import { LogIn, Loader2 } from 'lucide-react';

const schema = z.object({
    email: z.string().email('Valid email is required'),
    password: z.string().min(1, 'Password is required'),
});

const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [login, { isLoading }] = useLoginMutation();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(schema),
    });

    const onSubmit = async (data) => {
        try {
            const res = await login(data).unwrap();
            dispatch(setCredentials(res));
            toast.success(`Welcome back, ${res.user.name}!`);
            
            if (res.user.role === 'admin') {
                navigate('/admin/dashboard');
            } else {
                navigate('/dealer/dashboard');
            }
        } catch (err) {
            toast.error(err?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 py-12">
            <div className="max-w-md w-full">
                <div className="bg-white border border-gray-200 p-8 rounded-2xl shadow-xl">
                    <div className="flex flex-col items-center mb-8">
                        <div className="w-16 h-16 bg-[#16a34a] rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-green-500/20">
                            <LogIn className="text-white w-8 h-8" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900">Food Distributor</h1>
                        <p className="text-gray-500 text-sm mt-1 font-medium">Sign in to your shop account</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1.5">
                                Email Address
                            </label>
                            <input
                                {...register('email')}
                                type="email"
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:border-[#16a34a] transition-colors"
                                placeholder="name@example.com"
                            />
                            {errors.email && (
                                <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1.5">
                                Password
                            </label>
                            <input
                                {...register('password')}
                                type="password"
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:border-[#16a34a] transition-colors"
                                placeholder="••••••••"
                            />
                            {errors.password && (
                                <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-[#16a34a] hover:bg-[#15803d] text-white font-semibold py-3 rounded-lg flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-green-900/20"
                        >
                            {isLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                'Sign In'
                            )}
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                        <p className="text-gray-500 text-sm font-medium">
                            New shop? {' '}
                            <Link to="/register" className="text-[#16a34a] font-bold hover:underline">
                                Register here
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;

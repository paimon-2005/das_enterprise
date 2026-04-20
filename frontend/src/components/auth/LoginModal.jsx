import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, Eye, EyeOff, User, LogIn, Loader2, Phone, ChefHat, ArrowRight } from 'lucide-react';

import { useDispatch } from 'react-redux';
import { useLoginMutation, useRegisterMutation } from '../../features/auth/authApi';
import { setCredentials } from '../../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

// Zod Schemas
const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    rememberMe: z.boolean().optional(),
});

const registerSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    phone: z.string().optional(),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

const LoginModal = ({ isOpen, onClose }) => {
    const [isLoginView, setIsLoginView] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const [login, { isLoading: isLoginLoading }] = useLoginMutation();
    const [register, { isLoading: isRegisterLoading }] = useRegisterMutation();

    // Close on ESC
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && isOpen) onClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    // Login Form Setup
    const {
        register: registerLogin,
        handleSubmit: handleLoginSubmit,
        formState: { errors: loginErrors },
        reset: resetLogin
    } = useForm({
        resolver: zodResolver(loginSchema),
        defaultValues: { email: '', password: '', rememberMe: false }
    });

    // Register Form Setup
    const {
        register: registerSignup,
        handleSubmit: handleSignupSubmit,
        formState: { errors: signupErrors },
        reset: resetSignup
    } = useForm({
        resolver: zodResolver(registerSchema),
        defaultValues: { name: '', email: '', phone: '', password: '', confirmPassword: '' }
    });

    // Reset forms when switching tabs or closing
    useEffect(() => {
        if (!isOpen) {
            resetLogin();
            resetSignup();
            setIsLoginView(true);
        }
    }, [isOpen, resetLogin, resetSignup]);

    const onLoginSubmit = async (data) => {
        try {
            const userData = await login({ email: data.email, password: data.password }).unwrap();
            dispatch(setCredentials({ ...userData }));
            
            // Success Toast
            toast.success(`Welcome back, ${userData.user.name || 'User'}!`, {
                style: { background: '#16a34a', color: '#fff' }
            });
            
            onClose(); // Close modal on success

            // Smart Redirect
            if (userData.user.role === 'admin') {
                navigate('/admin/dashboard');
            } else {
                // If they are a customer, just close modal, they stay on current page (e.g. '/')
                // Or if we specifically want them to navigate to /shop we could do it here
                if (window.location.pathname === '/login') {
                    navigate('/'); // Fallback if they were somehow on the old path
                }
            }
        } catch (err) {
            toast.error(err?.data?.message || 'Invalid email or password', {
                style: { background: '#ef4444', color: '#fff' }
            });
        }
    };

    const onRegisterSubmit = async (data) => {
        try {
            // Remove confirmPassword before sending to API
            const { confirmPassword, ...registerData } = data;
            const userData = await register(registerData).unwrap();
            dispatch(setCredentials({ ...userData }));
            
            toast.success('Account created successfully!', {
                style: { background: '#16a34a', color: '#fff' }
            });
            
            onClose();
            // Customers stay on current page after registration
        } catch (err) {
            toast.error(err?.data?.message || 'Registration failed', {
                style: { background: '#ef4444', color: '#fff' }
            });
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
                    />

                    {/* Modal Container */}
                    <div className="fixed inset-0 flex items-center justify-center p-4 z-[101] pointer-events-none">
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
                            className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden pointer-events-auto flex flex-col max-h-[90vh]"
                        >
                            {/* Header */}
                            <div className="relative pt-8 pb-4 px-8 text-center bg-gray-50/50">
                                <button 
                                    onClick={onClose}
                                    className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
                                >
                                    <X size={20} />
                                </button>
                                
                                <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-[#16a34a]">
                                    <ChefHat size={32} />
                                </div>

                                <h2 className="text-2xl font-bold text-gray-900 font-jakarta">
                                    {isLoginView ? 'Welcome Back' : 'Create Account'}
                                </h2>
                                <p className="text-gray-500 text-sm mt-1">
                                    {isLoginView ? 'Unified login for Customers & Dealers' : 'Join us for premium food distribution'}
                                </p>
                                {isLoginView && (
                                    <div className="inline-block mt-3 px-3 py-1 bg-primary-100 text-primary-700 text-[10px] font-black uppercase tracking-widest rounded-full">
                                        B2B Partner Portal Enabled
                                    </div>
                                )}
                            </div>


                            {/* Body - Scrollable */}
                            <div className="px-8 py-6 overflow-y-auto custom-scrollbar">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={isLoginView ? 'login' : 'register'}
                                        initial={{ opacity: 0, x: isLoginView ? -20 : 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: isLoginView ? 20 : -20 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        {isLoginView ? (
                                            /* LOGIN FORM */
                                            <form onSubmit={handleLoginSubmit(onLoginSubmit)} className="space-y-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">Email Address</label>
                                                    <div className="relative">
                                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                                            <Mail size={18} />
                                                        </div>
                                                        <input
                                                            type="email"
                                                            {...registerLogin('email')}
                                                            className={`w-full bg-white border ${loginErrors.email ? 'border-red-500' : 'border-gray-300'} rounded-xl py-3 pl-10 pr-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#16a34a]/30 focus:border-[#16a34a] transition-all shadow-sm`}
                                                            placeholder="name@example.com"
                                                        />
                                                    </div>
                                                    {loginErrors.email && <p className="text-red-500 text-xs mt-1 ml-1">{loginErrors.email.message}</p>}
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">Password</label>
                                                    <div className="relative">
                                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                                            <Lock size={18} />
                                                        </div>
                                                        <input
                                                            type={showPassword ? 'text' : 'password'}
                                                            {...registerLogin('password')}
                                                            className={`w-full bg-white border ${loginErrors.password ? 'border-red-500' : 'border-gray-300'} rounded-xl py-3 pl-10 pr-12 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#16a34a]/30 focus:border-[#16a34a] transition-all shadow-sm`}
                                                            placeholder="Enter your password"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => setShowPassword(!showPassword)}
                                                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                                                        >
                                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                                        </button>
                                                    </div>
                                                    {loginErrors.password && <p className="text-red-500 text-xs mt-1 ml-1">{loginErrors.password.message}</p>}
                                                </div>

                                                <div className="flex items-center justify-between pt-1">
                                                    <label className="flex items-center space-x-2 cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            {...registerLogin('rememberMe')}
                                                            className="w-4 h-4 rounded border-gray-300 text-[#16a34a] focus:ring-[#16a34a]"
                                                        />
                                                        <span className="text-sm text-gray-600">Remember me</span>
                                                    </label>
                                                    <button type="button" className="text-sm text-[#ea580c] hover:underline font-medium">
                                                        Forgot Password?
                                                    </button>
                                                </div>

                                                <button
                                                    type="submit"
                                                    disabled={isLoginLoading}
                                                    className="w-full bg-[#16a34a] hover:bg-[#15803d] text-white font-semibold py-3.5 rounded-xl shadow-md shadow-green-500/20 flex items-center justify-center space-x-2 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed mt-4"
                                                >
                                                    {isLoginLoading ? (
                                                        <Loader2 className="animate-spin" size={20} />
                                                    ) : (
                                                        <>
                                                            <span>Sign In</span>
                                                            <LogIn size={18} />
                                                        </>
                                                    )}
                                                </button>
                                            </form>
                                        ) : (
                                            /* REGISTER FORM */
                                            <form onSubmit={handleSignupSubmit(onRegisterSubmit)} className="space-y-4">
                                                <div>
                                                    <div className="relative">
                                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400"><User size={18} /></div>
                                                        <input type="text" {...registerSignup('name')} placeholder="Full Name" className={`w-full bg-white border ${signupErrors.name ? 'border-red-500' : 'border-gray-300'} rounded-xl py-3 pl-10 pr-4 text-gray-900 focus:outline-none focus:border-[#16a34a] shadow-sm`} />
                                                    </div>
                                                    {signupErrors.name && <p className="text-red-500 text-xs mt-1 ml-1">{signupErrors.name.message}</p>}
                                                </div>

                                                <div>
                                                    <div className="relative">
                                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400"><Mail size={18} /></div>
                                                        <input type="email" {...registerSignup('email')} placeholder="Email Address" className={`w-full bg-white border ${signupErrors.email ? 'border-red-500' : 'border-gray-300'} rounded-xl py-3 pl-10 pr-4 text-gray-900 focus:outline-none focus:border-[#16a34a] shadow-sm`} />
                                                    </div>
                                                    {signupErrors.email && <p className="text-red-500 text-xs mt-1 ml-1">{signupErrors.email.message}</p>}
                                                </div>
                                                
                                                <div>
                                                    <div className="relative">
                                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400"><Phone size={18} /></div>
                                                        <input type="tel" {...registerSignup('phone')} placeholder="Phone Number" className={`w-full bg-white border ${signupErrors.phone ? 'border-red-500' : 'border-gray-300'} rounded-xl py-3 pl-10 pr-4 text-gray-900 focus:outline-none focus:border-[#16a34a] shadow-sm`} />
                                                    </div>
                                                </div>

                                                <div>
                                                    <div className="relative">
                                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400"><Lock size={18} /></div>
                                                        <input type={showPassword ? 'text' : 'password'} {...registerSignup('password')} placeholder="Password" className={`w-full bg-white border ${signupErrors.password ? 'border-red-500' : 'border-gray-300'} rounded-xl py-3 pl-10 pr-10 text-gray-900 focus:outline-none focus:border-[#16a34a] shadow-sm`} />
                                                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400"><Eye size={18} /></button>
                                                    </div>
                                                    {signupErrors.password && <p className="text-red-500 text-xs mt-1 ml-1">{signupErrors.password.message}</p>}
                                                </div>

                                                <div>
                                                    <div className="relative">
                                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400"><Lock size={18} /></div>
                                                        <input type={showPassword ? 'text' : 'password'} {...registerSignup('confirmPassword')} placeholder="Confirm Password" className={`w-full bg-white border ${signupErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'} rounded-xl py-3 pl-10 pr-10 text-gray-900 focus:outline-none focus:border-[#16a34a] shadow-sm`} />
                                                    </div>
                                                    {signupErrors.confirmPassword && <p className="text-red-500 text-xs mt-1 ml-1">{signupErrors.confirmPassword.message}</p>}
                                                </div>

                                                <button
                                                    type="submit"
                                                    disabled={isRegisterLoading}
                                                    className="w-full bg-[#16a34a] hover:bg-[#15803d] text-white font-semibold py-3.5 rounded-xl shadow-md shadow-green-500/20 flex items-center justify-center space-x-2 transition-all active:scale-[0.98] disabled:opacity-70 mt-4"
                                                >
                                                    {isRegisterLoading ? <Loader2 className="animate-spin" size={20} /> : <span>Create Account</span>}
                                                </button>
                                            </form>
                                        )}
                                    </motion.div>
                                </AnimatePresence>
                            </div>

                            {/* Footer Toggle */}
                            <div className="px-8 py-5 border-t border-gray-100 bg-gray-50 mt-auto">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                                        <span>{isLoginView ? "Don't have an account?" : "Already have an account?"}</span>
                                        <button 
                                            type="button" 
                                            onClick={() => setIsLoginView(!isLoginView)}
                                            className="font-semibold text-[#16a34a] hover:underline"
                                        >
                                            {isLoginView ? "Create an account" : "Sign in instead"}
                                        </button>
                                    </div>
                                    
                                    {!isLoginView && (
                                        <div className="pt-4 border-t border-gray-200/50">
                                            <div className="bg-primary-50 rounded-2xl p-4 border border-primary-100">
                                                <p className="text-[10px] font-black text-primary-600 uppercase tracking-widest mb-2">Are you a Retailer / Shop?</p>
                                                <button 
                                                    onClick={() => {
                                                        onClose();
                                                        navigate('/register-shop');
                                                    }}
                                                    className="w-full bg-white border border-primary-200 text-primary-700 font-bold py-2 rounded-xl text-xs hover:bg-primary-600 hover:text-white hover:border-primary-600 transition-all shadow-sm flex items-center justify-center gap-2"
                                                >
                                                    Register as B2B Dealer <ArrowRight size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
};

export default LoginModal;

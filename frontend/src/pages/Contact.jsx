import React from 'react';
import Navbar from '../components/layout/Navbar';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const Contact = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            <Navbar />
            
            <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-bold text-gray-900 font-jakarta mb-4">Contact Us</h1>
                    <p className="text-lg text-gray-500 max-w-2xl mx-auto">Have a question about a wholesale order? Reach out to our team and we'll get back to you within 24 hours.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    
                    {/* Contact Info */}
                    <div className="lg:col-span-1 space-y-8">
                        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="text-xl font-bold text-gray-900 mb-6 font-jakarta">Get in Touch</h3>
                            
                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center flex-shrink-0 text-[#16a34a]">
                                        <MapPin size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900">Head Office</h4>
                                        <p className="text-gray-500 mt-1">123 Wholesale Market Road, Industrial Area, Mumbai, 400001</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center flex-shrink-0 text-[#16a34a]">
                                        <Phone size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900">Phone</h4>
                                        <p className="text-gray-500 mt-1">+91 98765 43210</p>
                                        <p className="text-gray-500 text-sm">Mon-Sat 9am to 6pm</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center flex-shrink-0 text-[#16a34a]">
                                        <Mail size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900">Email</h4>
                                        <p className="text-gray-500 mt-1">sales@dasenterprise.in</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-white p-8 md:p-10 rounded-2xl border border-gray-100 shadow-sm">
                            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
                                        <input 
                                            type="text" 
                                            placeholder="John Doe" 
                                            className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#16a34a]/30 focus:border-[#16a34a] transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                                        <input 
                                            type="email" 
                                            placeholder="john@company.com" 
                                            className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#16a34a]/30 focus:border-[#16a34a] transition-all"
                                        />
                                    </div>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Subject</label>
                                    <input 
                                        type="text" 
                                        placeholder="Order Inquiry" 
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#16a34a]/30 focus:border-[#16a34a] transition-all"
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Message</label>
                                    <textarea 
                                        rows="5" 
                                        placeholder="How can we help your business?" 
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#16a34a]/30 focus:border-[#16a34a] transition-all resize-none"
                                    ></textarea>
                                </div>
                                
                                <button className="bg-[#16a34a] hover:bg-[#15803d] text-white font-bold py-4 px-8 rounded-xl shadow-md shadow-green-500/20 transition-all active:scale-95 flex items-center justify-center gap-2 w-full md:w-auto">
                                    Send Message <Send size={18} />
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Contact;

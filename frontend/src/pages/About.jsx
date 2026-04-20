import React from 'react';
import Navbar from '../components/layout/Navbar';
import { Target, Leaf, Heart, Users } from 'lucide-react';

const About = () => {
    return (
        <div className="min-h-screen bg-white flex flex-col font-sans">
            <Navbar />
            
            <main className="flex-1">
                {/* Hero */}
                <section className="bg-gray-50 py-20 text-center px-4">
                    <div className="max-w-4xl mx-auto">
                        <span className="text-[#16a34a] font-bold tracking-widest uppercase text-sm mb-4 block">About Das Enterprise</span>
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 font-jakarta mb-6">Distributing Quality Since 2010</h1>
                        <p className="text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
                            We are India's leading wholesale food distributor, connecting farmers directly with businesses to ensure fresh, premium ingredients reach every commercial kitchen.
                        </p>
                    </div>
                </section>

                {/* Core Values */}
                <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                        {[
                            { icon: Target, title: 'Our Mission', desc: 'To streamline the B2B food supply chain with unmatched efficiency.' },
                            { icon: Leaf, title: 'Sustainability', desc: 'We source responsibly to protect the environment and support local farmers.' },
                            { icon: Heart, title: 'Quality First', desc: 'Rigorous lab testing and quality checks on every grain.' },
                            { icon: Users, title: 'Community', desc: 'Building long-term relationships with our wholesale partners.' },
                        ].map((v, i) => (
                            <div key={i} className="text-center">
                                <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-[#16a34a]">
                                    <v.icon size={32} />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">{v.title}</h3>
                                <p className="text-gray-500 leading-relaxed">{v.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>
            </main>
        </div>
    );
};

export default About;

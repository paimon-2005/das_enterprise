import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Menu } from 'lucide-react';

const AdminLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-gray-50 font-jakarta">
            {/* Mobile Header */}
            <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b-2 border-gray-100 flex items-center px-4 z-40">
                <button 
                    onClick={() => setIsSidebarOpen(true)}
                    className="p-2 hover:bg-gray-50 rounded-xl text-gray-600 transition-colors"
                >
                    <Menu size={24} />
                </button>
                <div className="ml-4">
                    <h1 className="text-gray-900 font-black text-lg tracking-tight">
                        DAS <span className="text-[#16a34a]">Enterprise</span>
                    </h1>
                </div>
            </div>

            {/* High-end Sidebar */}
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
            
            <div className="flex-1 lg:ml-72 flex flex-col min-w-0 pt-16 lg:pt-0">
                <main className="flex-1">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;

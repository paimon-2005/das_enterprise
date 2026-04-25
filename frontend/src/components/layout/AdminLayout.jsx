import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopHeader from './TopHeader';
import { Menu } from 'lucide-react';

const AdminLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-surface font-inter">

            {/* Sidebar */}
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            {/* Main content area — offset by sidebar width */}
            <div className="flex-1 lg:ml-[260px] flex flex-col min-w-0">

                {/* Mobile top bar */}
                <div className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-primary-800 flex items-center px-4 z-40 gap-3">
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="p-1.5 text-white/80 hover:text-white transition-colors"
                    >
                        <Menu size={22} />
                    </button>
                    <h1 className="text-white font-bold text-base tracking-tight">
                        DAS <span className="text-primary-300">Enterprise</span>
                    </h1>
                </div>

                {/* Desktop top header */}
                <div className="hidden lg:block">
                    <TopHeader />
                </div>

                {/* Page content */}
                <main className="flex-1 pt-14 lg:pt-0 bg-surface">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;

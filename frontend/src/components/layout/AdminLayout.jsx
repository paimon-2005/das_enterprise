import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopHeader from './TopHeader';

const AdminLayout = () => {
    return (
        <div className="flex min-h-screen bg-gray-50 font-jakarta">
            <Sidebar />
            
            <div className="flex-1 ml-[260px] flex flex-col">
                <TopHeader />
                
                <main className="p-8 flex-1">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;

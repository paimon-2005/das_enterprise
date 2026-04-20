import React from 'react';
import { Bell, Search, ChevronDown, User, LogOut, Settings as SettingsIcon } from 'lucide-react';

const TopHeader = () => {
    const pageTitle = "Dashboard"; // This would dynamic in a real app based on route

    return (
        <header className="h-16 bg-white border-b border-gray-200 px-8 flex items-center justify-between sticky top-0 z-40">
            {/* Search */}
            <div className="flex-1 max-w-md">
                <div className="relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-500 transition-colors" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search for orders, products, customers..." 
                        className="w-full bg-gray-50 border-transparent border focus:bg-white focus:border-primary-100 focus:ring-4 focus:ring-primary-50 rounded-lg py-2 pl-10 pr-4 text-sm outline-none transition-all"
                    />
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-6">
                <button className="relative text-gray-500 hover:text-primary-600 p-2 hover:bg-primary-50 rounded-full transition-all">
                    <Bell size={20} />
                    <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>
                </button>

                <div className="h-8 w-px bg-gray-200"></div>

                <div className="flex items-center gap-3 cursor-pointer group">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-bold text-gray-900 leading-none">Abhijit Kumar</p>
                        <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-wider font-semibold">Store Manager</p>
                    </div>
                    <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-gray-200 border-2 border-transparent group-hover:border-primary-500 transition-all flex items-center justify-center overflow-hidden">
                             <img src="https://ui-avatars.com/api/?name=Abhijit+Kumar&background=16a34a&color=fff" alt="avatar" />
                        </div>
                        <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm border border-gray-100">
                             <ChevronDown size={12} className="text-gray-500" />
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default TopHeader;

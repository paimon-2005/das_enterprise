import React from 'react';
import { Bell, Search, ChevronDown, Settings } from 'lucide-react';

/**
 * Admin panel top header — standalone version used inside the admin sidebar layout.
 * Page title is static; real dynamic version is in components/layout/TopHeader.jsx
 */
const TopHeader = () => {
    return (
        <header className="h-14 bg-card border-b border-gray-200 px-6 flex items-center justify-between sticky top-0 z-40 shadow-sm">

            {/* Page context */}
            <div>
                <h2 className="text-sm font-semibold text-txt-primary">Admin Panel</h2>
                <p className="text-[11px] text-txt-secondary">DAS Enterprise</p>
            </div>

            {/* Search */}
            <div className="flex-1 max-w-sm mx-6">
                <div className="relative group">
                    <Search
                        size={15}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-txt-secondary group-focus-within:text-primary-600 transition-colors"
                    />
                    <input
                        type="text"
                        placeholder="Search orders, products, shops…"
                        className="w-full bg-surface border border-gray-200 focus:border-primary-600 focus:ring-2 focus:ring-primary-600/15
                                   rounded-lg py-2 pl-9 pr-4 text-sm outline-none transition-all text-txt-primary placeholder:text-txt-secondary"
                    />
                </div>
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-2">
                <button className="relative p-2 text-txt-secondary hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all">
                    <Bell size={18} />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent-500 rounded-full border-2 border-white" />
                </button>
                <button className="p-2 text-txt-secondary hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all">
                    <Settings size={18} />
                </button>
                <div className="w-px h-6 bg-gray-200 mx-1" />
                <div className="flex items-center gap-2 cursor-pointer group pl-1">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-semibold text-txt-primary leading-none">Admin User</p>
                        <p className="text-[10px] text-txt-secondary mt-0.5 uppercase tracking-wider font-medium">Administrator</p>
                    </div>
                    <div className="w-9 h-9 rounded-lg bg-primary-600 flex items-center justify-center text-white font-bold text-sm
                                    ring-2 ring-transparent group-hover:ring-primary-300 transition-all">
                        A
                    </div>
                    <ChevronDown size={14} className="text-txt-secondary" />
                </div>
            </div>
        </header>
    );
};

export default TopHeader;

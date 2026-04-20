import React from 'react';
import { 
  Bell, 
  Search, 
  MessageSquare, 
  Calendar,
  ChevronDown,
  Menu
} from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';
import { useGetDealersQuery, useApproveDealerMutation } from '../../features/dealers/dealersApi';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';


const TopHeader = () => {
  const location = useLocation();
  const [showNotifications, setShowNotifications] = React.useState(false);
  
  // Get pending dealers for notification
  const { data: pendingDealersResult } = useGetDealersQuery({ isApproved: false });
  const [approveDealer] = useApproveDealerMutation();
  const pendingDealers = pendingDealersResult?.data || [];
  const pendingCount = pendingDealers.length;
  
  // Get page title from path
  const getPageTitle = (path) => {
    if (path === '/admin' || path === '/admin/dashboard') return 'Business Dashboard';
    if (path.includes('/admin/dealers/')) return 'Dealer Profile';
    if (path.includes('/admin/areas/')) return 'Area Analytics';
    
    const segment = path.split('/').pop().replace('-', ' ');
    return segment.charAt(0).toUpperCase() + segment.slice(1);
  };

  const handleQuickApprove = async (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await approveDealer(id).unwrap();
      toast.success('Dealer Approved!');
    } catch (err) {
      toast.error('Approval failed');
    }
  };


  return (
    <header className="h-[80px] bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <button className="lg:hidden p-2 hover:bg-gray-50 rounded-lg">
          <Menu size={20} />
        </button>
        <div className="flex flex-col">
          <h2 className="text-xl font-black text-gray-900 font-jakarta">{getPageTitle(location.pathname)}</h2>
          <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
            <Calendar size={12} />
            <span>{new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6">
        {/* Search */}
        <div className="hidden md:flex relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-600 transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search anything..." 
            className="bg-gray-50 border-none rounded-xl py-2.5 pl-10 pr-4 text-sm font-medium w-[240px] focus:ring-2 focus:ring-primary-100 transition-all"
          />
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className={`p-2.5 rounded-xl relative transition-all ${showNotifications ? 'bg-primary-50 text-primary-600' : 'hover:bg-gray-50 text-gray-500'}`}
            >
              <Bell size={20} />
              {pendingCount > 0 && (
                <span className="absolute top-2 right-2 w-4 h-4 bg-red-500 rounded-full border-2 border-white text-[10px] text-white font-black flex items-center justify-center animate-bounce">
                  {pendingCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            <AnimatePresence>
              {showNotifications && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowNotifications(false)} />
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    className="absolute right-0 mt-3 w-[320px] bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden z-20"
                  >
                    <div className="p-5 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
                      <h3 className="font-black text-gray-900 font-jakarta">Pending Approvals</h3>
                      <span className="bg-primary-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                        {pendingCount} New
                      </span>
                    </div>
                    <div className="max-h-[300px] overflow-y-auto">
                      {pendingCount > 0 ? (
                        pendingDealers.map((dealer) => (
                          <div key={dealer._id} className="p-4 border-b border-gray-50 hover:bg-gray-50 transition-all flex items-center justify-between group">
                            <Link to={`/admin/dealers/${dealer._id}`} onClick={() => setShowNotifications(false)} className="flex-1">
                              <p className="text-sm font-bold text-gray-900 group-hover:text-primary-600 transition-colors uppercase tracking-tight">{dealer.shopName}</p>
                              <p className="text-[10px] text-gray-400 font-bold uppercase">{dealer.area?.name || 'No Area'}</p>
                            </Link>
                            <button 
                              onClick={(e) => handleQuickApprove(e, dealer._id)}
                              className="bg-primary-600 text-white p-2 rounded-lg hover:bg-primary-700 transition-all shadow-lg shadow-primary-900/10"
                            >
                              <CheckCircle size={14} />
                            </button>
                          </div>
                        ))
                      ) : (
                        <div className="p-10 text-center">
                          <CheckCircle size={32} className="mx-auto text-gray-200 mb-2" />
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">No pending requests</p>
                        </div>
                      )}
                    </div>
                    {pendingCount > 0 && (
                      <Link 
                        to="/admin/dealers" 
                        onClick={() => setShowNotifications(false)}
                        className="block p-4 text-center text-xs font-black text-primary-600 hover:bg-primary-50 transition-all border-t border-gray-100 uppercase tracking-widest"
                      >
                        See All Applications
                      </Link>
                    )}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
          
          <button className="p-2.5 hover:bg-gray-50 rounded-xl text-gray-500 hover:text-primary-600 transition-all">
            <MessageSquare size={20} />
          </button>
        </div>


        <div className="h-8 w-px bg-gray-100 mx-2"></div>

        {/* Profile */}
        <button className="flex items-center gap-3 p-1.5 pr-3 hover:bg-gray-50 rounded-2xl transition-all group">
          <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center font-bold text-gray-900 border border-gray-200">
            A
          </div>
          <div className="text-left hidden sm:block">
            <p className="text-xs font-black text-gray-900 group-hover:text-primary-600 transition-colors">Abhijit Kumar</p>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Main Admin</p>
          </div>
          <ChevronDown size={14} className="text-gray-400" />
        </button>
      </div>
    </header>
  );
};

export default TopHeader;

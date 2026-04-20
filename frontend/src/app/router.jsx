import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';

// Layouts
import AdminLayout from '../components/layout/AdminLayout';
import MainLayout from '../components/layout/MainLayout';

// Main UI Pages
import LandingPage from '../pages/LandingPage';
import Shop from '../pages/Shop';
import Cart from '../pages/Cart';
import About from '../pages/About';
import Contact from '../pages/Contact';

// Admin Pages
import Dashboard from '../pages/admin/Dashboard';
import AdminProducts from '../pages/admin/AdminProducts';
import Orders from '../pages/admin/Orders';
import StockManagement from '../pages/admin/StockManagement';
import Customers from '../pages/admin/Customers';
import Reports from '../pages/admin/Reports';
import Areas from '../pages/admin/Areas';
import AreaStats from '../pages/admin/AreaStats';
import Dealers from '../pages/admin/Dealers';
import DealerDetail from '../pages/admin/DealerDetail';

// Auth Pages
import RegisterShop from '../pages/auth/RegisterShop';


// Customer Pages
import Home from '../pages/customer/Home';
import Checkout from '../pages/customer/Checkout';
import MyOrders from '../pages/customer/MyOrders';


// Components
import { RequireAdmin, RequireCustomer } from '../components/auth/ProtectedRoute';

export const router = createBrowserRouter([
    // Main Landing Page
    {
        path: '/',
        element: <LandingPage />,
    },
    
    // Main UI Routes
    {
        path: '/products',
        element: <Shop />,
    },
    {
        path: '/cart',
        element: <Cart />,
    },
    {
        path: '/about',
        element: <About />,
    },
    {
        path: '/contact',
        element: <Contact />,
    },

    // Admin Routes (Protected)
    {
        path: '/admin',
        element: <RequireAdmin />,
        children: [
            {
                element: <AdminLayout />,
                children: [
                    { path: '', element: <Navigate to="dashboard" replace /> },
                    { path: 'dashboard', element: <Dashboard /> },
                    { path: 'products', element: <AdminProducts /> },
                    { path: 'orders', element: <Orders /> },
                    { path: 'stock', element: <StockManagement /> },
                    { path: 'customers', element: <Customers /> },
                    { path: 'dealers', element: <Dealers /> },
                    { path: 'dealers/:id', element: <DealerDetail /> },
                    { path: 'areas', element: <Areas /> },
                    { path: 'areas/:id', element: <AreaStats /> },
                    { path: 'reports', element: <Reports /> },
                ],
            },
        ],
    },

    // B2B Shop Registration
    {
        path: '/register-shop',
        element: <RegisterShop />,
    },


    // Customer Routes (Protected)
    {
        path: '/shop',
        element: <RequireCustomer />,
        children: [
            {
                element: <MainLayout />,
                children: [
                    { path: '', element: <Home /> },
                    { path: 'product/:slug', element: <div className="p-8 text-white">Product Details (Coming Soon)</div> },
                    { path: 'cart', element: <Cart /> },
                    { path: 'checkout', element: <Checkout /> },
                    { path: 'my-orders', element: <MyOrders /> },

                    { path: 'profile', element: <div className="p-8 text-white">Profile (Coming Soon)</div> },
                ],
            },
        ],
    },

    // Catch-all 404
    {
        path: '*',
        element: (
            <div className="min-h-screen flex items-center justify-center bg-[#0f1115] text-white text-2xl font-bold italic tracking-tighter">
                404 | PAGE NOT FOUND
            </div>
        ),
    },
]);

export default router;


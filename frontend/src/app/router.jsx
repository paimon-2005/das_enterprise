import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';

// Layouts
import AdminLayout from '../components/layout/AdminLayout';
import MainLayout from '../components/layout/MainLayout';

// Auth Pages
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';

// Admin Pages
import AdminDashboard from '../pages/admin/Dashboard';
import AdminOrders from '../pages/admin/Orders';
import OrderDetail from '../pages/admin/OrderDetail';
import AdminShops from '../pages/admin/AdminShops';
import AdminProducts from '../pages/admin/AdminProducts';
import StockManagement from '../pages/admin/StockManagement';
import Areas from '../pages/admin/Areas';

// Dealer Pages
import DealerDashboard from '../pages/dealer/DealerDashboard';
import DealerProducts from '../pages/dealer/DealerProducts';
import DealerCart from '../pages/Cart'; // Reusing Cart or specialized DealerCart
import DealerOrders from '../pages/dealer/DealerOrders';
import DealerProfile from '../pages/dealer/DealerProfile';
import OrderSuccess from '../pages/customer/OrderSuccess';

// Guards
import { RequireAdmin, RequireDealer } from '../components/auth/ProtectedRoute';

export const router = createBrowserRouter([
    // Root → redirect directly to dealer dashboard
    {
        path: '/',
        element: <Navigate to="/dealer/dashboard" replace />,
    },
    {
        path: '/login',
        element: <Login />,
    },
    {
        path: '/register',
        element: <Register />,
    },

    // Dealer Routes
    {
        path: '/dealer',
        element: <RequireDealer />,
        children: [
            {
                element: <MainLayout />,
                children: [
                    { path: '', element: <Navigate to="dashboard" replace /> },
                    { path: 'dashboard', element: <DealerDashboard /> },
                    { path: 'products', element: <DealerProducts /> },
                    { path: 'cart', element: <DealerCart /> },
                    { path: 'orders', element: <DealerOrders /> },
                    { path: 'profile', element: <DealerProfile /> },
                    { path: 'order-success/:id', element: <OrderSuccess /> },
                ],
            },
        ],
    },

    // /products shortcut → same DealerProducts view (RequireDealer protected)
    {
        path: '/products',
        element: <RequireDealer />,
        children: [
            {
                element: <MainLayout />,
                children: [
                    { path: '', element: <DealerProducts /> },
                ],
            },
        ],
    },

    // Admin Routes
    {
        path: '/admin',
        element: <RequireAdmin />,
        children: [
            {
                element: <AdminLayout />,
                children: [
                    { path: '', element: <Navigate to="dashboard" replace /> },
                    { path: 'dashboard', element: <AdminDashboard /> },
                    { path: 'orders', element: <AdminOrders /> },
                    { path: 'orders/:id', element: <OrderDetail /> },
                    { path: 'shops', element: <AdminShops /> },
                    { path: 'products', element: <AdminProducts /> },
                    { path: 'stock', element: <StockManagement /> },
                    { path: 'areas', element: <Areas /> },
                ],
            },
        ],
    },

    // 404
    {
        path: '*',
        element: (
            <div className="min-h-screen flex items-center justify-center bg-[#0f1115] text-[#16a34a] text-2xl font-bold tracking-tighter">
                404 | NOT FOUND
            </div>
        ),
    },
]);

export default router;

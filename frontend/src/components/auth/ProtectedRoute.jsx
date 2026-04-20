import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCurrentUser, selectIsAuthenticated } from '../../features/auth/authSlice';

/**
 * Type 1: RequireAuth (Generic logged in guard)
 */
export const RequireAuth = () => {
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const location = useLocation();

    return isAuthenticated ? (
        <Outlet />
    ) : (
        <Navigate to="/" state={{ from: location, openLogin: true }} replace />
    );
};

export const RequireAdmin = () => {
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const user = useSelector(selectCurrentUser);
    const location = useLocation();

    if (!isAuthenticated) {
        return <Navigate to="/" state={{ from: location, openLogin: true }} replace />;
    }

    if (user?.role !== 'admin') {
        return <Navigate to="/shop" replace />;
    }

    return <Outlet />;
};

export const RequireCustomer = () => {
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const user = useSelector(selectCurrentUser);
    const location = useLocation();

    if (!isAuthenticated) {
        return <Navigate to="/" state={{ from: location, openLogin: true }} replace />;
    }

    if (user?.role === 'admin') {
        return <Navigate to="/admin/dashboard" replace />;
    }

    return <Outlet />;
};

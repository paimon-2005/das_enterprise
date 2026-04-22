import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCurrentUser, selectIsAuthenticated } from '../../features/auth/authSlice';

/**
 * RequireAdmin guard
 */
export const RequireAdmin = () => {
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const user = useSelector(selectCurrentUser);
    const location = useLocation();

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (user?.role !== 'admin') {
        return <Navigate to="/dealer/dashboard" replace />;
    }

    return <Outlet />;
};

/**
 * RequireDealer guard
 */
export const RequireDealer = () => {
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const user = useSelector(selectCurrentUser);
    const location = useLocation();

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (user?.role === 'admin') {
        return <Navigate to="/admin/dashboard" replace />;
    }

    return <Outlet />;
};

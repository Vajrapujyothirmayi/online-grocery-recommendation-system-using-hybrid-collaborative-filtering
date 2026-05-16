import { Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, loading } = useContext(AuthContext);

    if (loading) {
        return <div className="loading-spinner">Loading...</div>;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.some(role => user.roles?.includes(role))) {
        // If not allowed, redirect to appropriate home or unauthorized page
        if (user.roles?.includes('ROLE_PRODUCER')) {
            return <Navigate to="/producer" replace />;
        } else {
            return <Navigate to="/consumer" replace />;
        }
    }

    return children;
};

export default ProtectedRoute;

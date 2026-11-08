import { Navigate, useLocation } from "react-router-dom";

// Wrap admin pages with this. No admin token = go to /admin-login (and come back after login).
export default function AdminRoute({ children }) {
    const location = useLocation();

    if (!sessionStorage.getItem("adminToken")) {
        return (
            <>
            <Navigate to="/admin-login" replace state={{ from: location.pathname }} />
            <Navigate to="/admin-register" replace state={{ from: location.pathname }} />
            </>
        );
    }

    return children;
}
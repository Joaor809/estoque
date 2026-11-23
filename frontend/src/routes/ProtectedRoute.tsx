import { Navigate, Outlet } from "react-router-dom";
import { getRole, getToken } from "../services/authService";

interface ProtectedRouteProps {
    allowedRoles: number[];
}

function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
    const token = getToken();
    const idRole = getRole();

    if (!token) {
        return <Navigate to="/login" replace/>
    }
    if (idRole === null || !allowedRoles.includes(Number(idRole))) {
        return <Navigate to="/unauthorized" replace/>
    }

    return <Outlet/>
}

export default ProtectedRoute;
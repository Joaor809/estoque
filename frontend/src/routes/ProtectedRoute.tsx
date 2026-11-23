
import { Navigate, Outlet } from "react-router-dom";
import { getIdUser, getToken, logout, whatRole } from "../services/authService";
import { useEffect, useState } from "react";

interface ProtectedRouteProps {
    allowedRoles: string[];
}

function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
    const token = getToken();
    const idUser = getIdUser();

    const [role, setRole] = useState<string | null>(null);
    const [checked, setChecked] = useState(false);

    useEffect(() => {
        async function checkRole() {
            try {
                if (!idUser) return;

                const userRole = await whatRole(idUser);
                setRole(userRole);
            } catch (error) {
                console.error("Erro ao verificar cargo:", error);
            } finally {
                setChecked(true);
            }
        }

        if (token && idUser) {
            checkRole();
        }
    }, [token, idUser]);

    if (!token || !idUser) {
        return <Navigate to="/login" replace />;
    }

    if (!checked) {
        return null;
    }

    if (!role || !allowedRoles.includes(role)) {
        logout();
        return <Navigate to="/unauthorized" replace />;
    }

    return <Outlet />;
}

export default ProtectedRoute;

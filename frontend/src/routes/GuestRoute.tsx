import { useEffect, useState } from "react";
import { getIdUser, getToken, whatRole } from "../services/authService";
import { Navigate, Outlet } from "react-router-dom";

function GuestRoute() {
    const token = getToken();
    const idUser = getIdUser();

    const [role, setRole] = useState<string | null>("");

    useEffect(() => {
        async function checkRole() {
            try {
                if (!idUser) return;

                const userRole = await whatRole(String(idUser));
                
                setRole(userRole)
            } catch (error) {
                console.error("Erro ao verificar cargo: ", error);
            }
        }

        if (token && idUser) {
            checkRole();
        } else {
            return;
        }
    }, [token, idUser]);

    if (token && idUser && role) {
        switch (role) {
            case "admin":
                return <Navigate to="/admin" replace/>;
            case "seller":
                return <Navigate to="/seller" replace />
            case "stock_clerk":
                return <Navigate to="/stock_clerk" replace/>
        }
    }
    return <Outlet/>
}

export default GuestRoute;
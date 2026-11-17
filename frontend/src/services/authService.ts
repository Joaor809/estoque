import api from "./api";

export const isAuthenticated = () => localStorage.getItem("token")  !== null;

export const getToken = () => {
    return localStorage.getItem("token");
};

export const getRole = async (): Promise<string> => {
    const idRole: Number = Number(localStorage.getItem("role"));

    const response = await fetch(`${api}/users/roles/${idRole}`);
    const data = await response.json();

    return data.role;
};

export const login = (token: string, idRole: number) => {
    localStorage.setItem("token", token);
    localStorage.setItem("role", String(idRole));
};

export const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("idRole");
};
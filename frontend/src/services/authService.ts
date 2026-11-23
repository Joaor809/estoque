import api from "./api";

export const isAuthenticated = () => localStorage.getItem("token")  !== null;

export const getToken = () => {
    return localStorage.getItem("token");
};

export const getRole = (): number => {
    const idRole = localStorage.getItem("idRole");

    return Number(idRole);
};

export const login = (token: string, idRole: number) => {
    localStorage.setItem("token", token);
    localStorage.setItem("idRole", String(idRole));
};

export const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("idRole");
};
import api from "./api";

export const isAuthenticated = () => localStorage.getItem("token")  !== null;

export const getToken = () => {
    return localStorage.getItem("token");
};

export const getIdUser = () => {
    return localStorage.getItem("idUser");
}

export const whatRole = async (idUser: string): Promise<string> => {
    const response = await api.get(`/users/whatRole/${idUser}`);
    const data = await response.data;

    return data.role;
};


export const loginAuthenticated = (token: string, idUser: string) => {
    localStorage.setItem("token", token);
    localStorage.setItem("idUser", idUser);
};

export const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("idUser");
    window.location.reload();
};
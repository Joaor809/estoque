import { getToken } from "./authService";

export const header = {
    headers: {
        'Authorization': `Bearer ${getToken()}`
    }
};

export const headerWithJson = {
    headers: {
        'Authorization': `Bearer ${getToken()}`,
        'Content-Type': 'application/json'
    }
}
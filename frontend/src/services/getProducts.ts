import type { ProductsResponse } from "../types/Product";
import api from "./api";
import { getToken } from "./authService";
import { header } from "./headers";

export default async function getProducts(): Promise<ProductsResponse> {
    const token = getToken();

    if (!token) {
        throw new Error("Token não fornecido!");
    }

    const response = await api.get("/products/availableProducts", header)

    return await response.data;
}
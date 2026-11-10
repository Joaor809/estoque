import type { ProductsResponse } from "../types/Product";
import api from "./api";

export default async function getProducts(): Promise<ProductsResponse> {
    const token = localStorage.getItem("token");

    if (!token) {
        throw new Error("Token não fornecido!");
    }

    const response = await fetch(`${api}/products`, {
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json"
        }
    });

    return await response.json();
}
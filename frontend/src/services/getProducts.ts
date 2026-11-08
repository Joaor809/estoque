import type { ProductsResponse } from "../types/Product";
import api from "./api";

export default async function getProducts(token: string): Promise<ProductsResponse> {

    const response = await fetch(`${api}/products`, {
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json"
        }
    });

    return await response.json();
}
import Swal from "sweetalert2";
import api from "./api";
import { getToken } from "./authService";

const token = getToken();

export default async function searchProduct(nameProduct: string = "", codProduct: string = "", idCategory: string = ""): Promise<any[] | undefined> {
    if (!nameProduct && !codProduct && !idCategory) {
        Swal.fire({
            title: "Preencha alguns dos campos!"
        });
        return;
    }

    const params = new URLSearchParams();

    if (nameProduct) {
        params.append("nameProduct", nameProduct);
    }

    if (codProduct) {
        params.append("codProduct", codProduct);
    }

    if (idCategory) {
        params.append("idCategory", idCategory);
    }

    const response = await fetch(`${api}/products/search?${params.toString()}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    const data = await response.json();

    return data.data;
}
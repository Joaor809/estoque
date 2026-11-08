import api from "../../services/api";
import "./Products.css";
import { useEffect, useState } from "react";
import type { Product } from "../../types/Product";
import getProducts from "../../services/getProducts";

function Products() {
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        async function loadProducts() {
            try {
                const response = await getProducts("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZFVzZXIiOiI4NDkxNDc3Ny05NWRhLTRjZjgtOTQ0My1mNGI0YzU2OGJiZDMiLCJpZFJvbGUiOjEsImlhdCI6MTc5NDEzOTIzMiwiZXhwIjoxNzk0MjI1NjMyfQ.NzFZwl4HPFCOaCgbrYJVyyPpKNIgpV9RXIZx9ewrWLo");

                console.log(response);

                if (response.success) {
                    setProducts(response.data);
                }
            } catch (error) {
                console.error("Erro ao carregar produtos:", error);
            }
        }

        loadProducts();
    }, []);

    return (
        <div className="products-container">
            <div className="products-content">

            {products.length > 0 ? (
                products.map((product, index) => (
                    <div className="card-product" key={index}>
                        <div className="card-img">
                            <img src={`${api}${product.image}`} alt={product.name} />
                        </div>
                        <div className="card-info">
                            <h2>{product.name}</h2>
                            <p>Cod: <strong>{product.codProduct}</strong></p>
                            <p>Marca: {product.mark}</p>
                            <p>Preço: {product.price.toLocaleString("pt-BR", {
                                style: "currency",
                                currency: "BRL"
                            })}</p>
                        </div>
                    </div>
                ))
            ) : (
                <h1>Por favor, faça login.</h1>
            )}
            </div>
        </div>
    );
}

export default Products;
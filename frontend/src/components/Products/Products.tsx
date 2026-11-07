import api from "../../services/api";
import "./Products.css";
import { useEffect, useState } from "react";

type Product = {
    codProduct: string;
    name: string;
    mark: string;
    price: number;
    category: string;
    image: string;
};

async function getProducts() {
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZFVzZXIiOiI4NDkxNDc3Ny05NWRhLTRjZjgtOTQ0My1mNGI0YzU2OGJiZDMiLCJpZFJvbGUiOjEsImlhdCI6MTc5NDA1MDU0OCwiZXhwIjoxNzk0MTM2OTQ4fQ.x48dlWx1sCk-2pS6D0JI2TjRNcBpHvd_b7-aTFzeRUw";

    const response = await fetch("http://localhost:3000/products", {
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json"
        }
    });

    return await response.json();
}

function Products() {
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        async function loadProducts() {
            try {
                const response = await getProducts();

                console.log(response);

                setProducts(response.data);
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
                            <p>Preço: R$ {product.price.replace(".", ",")}</p>
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
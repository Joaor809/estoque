    import api from "../../services/api";
    import "./Products.css";
    import { useEffect, useState } from "react";
    import type { Product } from "../../types/Product";
    import getProducts from "../../services/getProducts";

    function Products() {
        const [products, setProducts] = useState<Product[]>([]);
        const token = localStorage.getItem("token");

        if (!token) {
            return window.location.href = "/login";
        }

        useEffect(() => {
            async function loadProducts() {
                try {
                    const response = await getProducts();

                    console.log(response);

                    if (response.success) {
                        setProducts(response.data);
                    }
                } catch (error) {
                    console.error("Erro ao carregar produtos:", error);
                }
            }

            loadProducts();
        }, [token]);

        return (
            <div className="products-container">
                <div className="products-content">

                {products.length > 0 ? (
                    products.map((product) => (
                        <div className="card-product" key={product.codProduct}>
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
                                <p>Quantidade: {product.quantity}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="error">
                        <h1>Erro ao buscar produtos</h1>
                    </div>
                )}
                </div>
            </div>
        );
    }

    export default Products;
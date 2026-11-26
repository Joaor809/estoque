import type { Product } from "../../types/Product";
import api from "../../services/api";
import "./CardProduct.css"

interface CardProductProps {
    product: Product;
}

export default function CardProduct({ product }: CardProductProps) {

    return (
        <div className="card-product" key={product.codProduct}>
            <div className="card-img">
                <img src={`${api}${product.image}`} alt={product.name} />
            </div>
            <div className="card-info">
                <h2>{product.name}</h2>
                <p>Cod: <strong>{product.codProduct}</strong></p>
                <p>Marca: {product.mark}</p>
                <p>Preço: {Number(product.price).toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL"
                })}</p>
                <p>Categoria: <strong>{product.category}</strong></p>
            </div>
        </div>
    )
}
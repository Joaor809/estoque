import "./Products.css";
import Navbar from "./../../../components/Navbar/Navbar.tsx";
import {useEffect, useState} from "react";
import type { Product } from "../../../types/Product.ts";
import api from "../../../services/api.ts"
import {buttonsAdmin, buttonsSeller, buttonsStockClerck} from "../../../config/NavbarItems.ts";
import Swal from "sweetalert2";
function Products() {

    const [products, setProducts] = useState<Product[]>([]);
    const [buttonsNavbar, setButtonsNavbar] = useState([]);
    const token: string = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZFVzZXIiOiI4NDkxNDc3Ny05NWRhLTRjZjgtOTQ0My1mNGI0YzU2OGJiZDMiLCJpZFJvbGUiOjEsImlhdCI6MTc5NDQ4MzEzNSwiZXhwIjoxNzk0NTY5NTM1fQ.588M3uIRohd0pFIcAUGWh8eRryGHx9qgNCWd4Nj0O7c"
    const idRole: number = localStorage.getItem("idRole");

    useEffect(() => {
        async function loadProducts(): Promise<void> {
            const response = await fetch(`${api}/products`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (!response.ok) {
                Swal.fire({
                    title: "Erro ao carregar produtos!"
                });
            }

            const data = await response.json();

            setProducts(data.data);
        }

        async function whatRole(idRole: number): Promise<void> {
            const response = await fetch(`${api}/users/roles/${idRole}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            console.log(data.role)

            if (data.role === "admin") {
                setButtonsNavbar(buttonsAdmin);
                return;
            } else if (data.role === "stock_clerk") {
                setButtonsNavbar(buttonsStockClerck);
                return;
            } else if (data.role === "seller") {
                setButtonsNavbar(buttonsSeller);
                return;
            } else {
                return window.location.href = "/login";
            }
        }

        whatRole(idRole);
        loadProducts();
    }, [idRole, token])
    return (
        <div className="products-page">
            <Navbar btn={buttonsNavbar}/>
            <div className="title-products-page">
                <h1>Produtos</h1>
            </div>
            <main className="products-page-container">
                {products.map((product) => (
                    <div className="card-products-page" key={product.codProduct}>
                        <div className="card-image-products-page">
                            <img src={api + product.image} />
                        </div>
                        <div className="card-info-products-page">
                            <div className="card-header-products-page">
                                <h2>{product.name}</h2>
                            </div>
                            <div className="card-body-products-page">
                                <p><strong>Marca:</strong> {product.mark}</p>
                                <p><strong>Preço:</strong> {Number(product.price).toLocaleString("pt-BR", {
                                    style: "currency",
                                    currency: "BRL"
                                })}</p>
                                <p><strong>Categoria:</strong> {product.category}</p>
                                <p><strong>Código:</strong> {product.codProduct}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </main>
        </div>
    );
}

export default Products;
import "./Products.css";
import Navbar from "./../../../components/Navbar/Navbar.tsx";
import { useEffect, useState } from "react";
import type { Product } from "../../../types/Product.ts";
import api from "../../../services/api.ts"
import { buttonsAdmin, buttonsSeller, buttonsStockClerck } from "../../../config/NavbarItems.ts";
import Swal from "sweetalert2";
import socket from "../../../services/socket.ts";
import type { Category } from "../../../types/Category.ts";
function Products() {

    const [products, setProducts] = useState<Product[]>([]);
    const [buttonsNavbar, setButtonsNavbar] = useState([]);
    const [categorys, setCategorys] = useState<Category[]>([]);
    const [nameProduct, setNameProduct] = useState("");
    const [codProduct, setCodProduct] = useState("");
    const [idCategory, setIdCategory] = useState("");
    const [searchProducts, setSearchProducts] = useState<Product[]>([]);
    const [openModal, setOpenModal] = useState(false);

    const token = localStorage.getItem("token");
    const idRole = localStorage.getItem("idRole");

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

    async function loadCategorys(): Promise<void> {
        const response = await fetch(`${api}/categorys`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();

        setCategorys(data.data);
    }

    async function searchProduct(): Promise<void> {
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

        setSearchProducts(data.data);
        setOpenModal(true);
    }

    useEffect(() => {

        loadProducts();
        loadCategorys()
    }, [idRole, token])
    return (
        <div className="products-page">
            <Navbar btn={buttonsNavbar} />
            <header className="header-products-page">
                <h1>Produtos</h1>
                <div className="search-products-page">
                    <form method="post" onSubmit={(event) => {
                        event.preventDefault()
                        searchProduct();
                    }}>
                        <input type="text" name="nameProduct" id="nameProduct" value={nameProduct} placeholder="Nome do produto" onChange={(event) => setNameProduct(event?.target.value)} />
                        <input type="text" name="codProduct" id="codProduct" value={codProduct} placeholder="Código do produto" onChange={(event) => setCodProduct(event?.target.value)} />
                        <select name="idCategory" id="idCategory" defaultValue="" onChange={(event) => setIdCategory(event.target.value)}>
                            <option disabled value="">Selecionar...</option>
                            {categorys.map((category) => (
                                <option key={category.idCategory} value={category.idCategory}>{category.name}</option>
                            ))}
                        </select>
                        <button className="btn" type="submit">Buscar</button>
                    </form>
                </div>

                {openModal && (
                    <div className="modal-search-products-page">
                        <div className="modal-header-products-page">
                            <div className="modal-title-header-products-page">
                                <h1>Produtos</h1>
                            </div>
                            <button className="btn-close" onClick={(event) => {
                                setOpenModal(false);
                                setSearchProducts([]);
                            }}>X</button>
                        </div>
                        <div className="modal-body-products-page">
                            {searchProducts.map((product) => (
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
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </header>
            <main className="products-page-container" style={{ pointerEvents: openModal ? "none" : "auto"}}>
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
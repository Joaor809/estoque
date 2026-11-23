git import "./Products.css";
import Navbar from "../../../components/Navbar/Navbar.tsx";
import { useEffect, useState } from "react";
import type { Product } from "../../../types/Product.ts";
import api from "../../../services/api.ts"
import { buttonsSeller } from "../../../config/NavbarItems.ts";
import Swal from "sweetalert2";
import type { Category } from "../../../types/Category.ts";
import { getToken } from "../../../services/authService.ts";
import searchProduct from "../../../services/search.ts";
import CardProduct from "../../../components/CardProduct/CardProduct.tsx";
function ProductsSeller() {

    const [products, setProducts] = useState<Product[]>([]);
    const [categorys, setCategorys] = useState<Category[]>([]);
    const [nameProduct, setNameProduct] = useState("");
    const [codProduct, setCodProduct] = useState("");
    const [idCategory, setIdCategory] = useState("");
    const [searchProducts, setSearchProducts] = useState<Product[]>([]);
    const [openModal, setOpenModal] = useState(false);

    const token = getToken();

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

    async function search(): Promise<void> {

        if (!nameProduct && !codProduct && !idCategory) {
            Swal.fire({
                title: "Preencha algum dos campos!"
            });
            return;
        }

        const response = await searchProduct(nameProduct, codProduct, idCategory);

        if (!response || response.length === 0) {
            Swal.fire({
                title: "Produto não encontrado!"
            });
            return;
        }
        
        setOpenModal(true);
        setSearchProducts(response);

    }

    useEffect(() => {

        loadProducts();
        loadCategorys()
    }, [token])
    return (
        <div className="products-page">
            <Navbar btn={buttonsSeller} />
            <header className="header-products-page">
                <h1>Produtos</h1>
                <div className="search-products-page">
                    <form method="post" onSubmit={(event) => {
                        event.preventDefault()
                        search();
                    }}>
                        <input type="text" name="nameProduct" id="nameProduct" value={nameProduct} placeholder="Nome do produto" onChange={(event) => setNameProduct(event?.target.value)} />
                        <input type="text" name="codProduct" id="codProduct" value={codProduct} placeholder="Código do produto" onChange={(event) => setCodProduct(event?.target.value)} />
                        <select name="idCategory" id="idCategory" value={idCategory} onChange={(event) => setIdCategory(event.target.value)}>
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
                                <CardProduct product={product}/>
                            ))}
                        </div>
                    </div>
                )}
            </header>
            <main className="products-page-container" style={{ pointerEvents: openModal ? "none" : "auto" }}>
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

export default ProductsSeller;
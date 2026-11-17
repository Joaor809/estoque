import { useEffect, useState } from "react";
import Navbar from "../../../components/Navbar/Navbar";
import { buttonsStockClerck } from "../../../config/NavbarItems";
import "./Products.css";
import type { Product } from "../../../types/Product";
import { getToken } from "../../../services/authService";
import api from "../../../services/api";
import socket from "../../../services/socket";
import Swal from "sweetalert2";
import type { Category } from "../../../types/Category";

function ProductsStockClerk() {

    const [products, setProducts] = useState<Product[]>([]);
    const [category, setCategory] = useState<Category[]>([]);
    const [openModal, setOpenModal] = useState(false);
    const [codProduct, setCodProduct] = useState("");
    const [nameProduct, setNameProduct] = useState("");
    const [markProduct, setMarkProduct] = useState("");
    const [priceProduct, setPriceProduct] = useState("");
    const [categoryProduct, setCategoryProduct] = useState("");

    const token: string | null = getToken();

    async function loadProducts(): Promise<void> {

        if (!token) return;

        try {
            const response = await fetch(`${api}/products`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error("Erro ao carregar produtos.");
            }

            const data = await response.json();

            setProducts(data.data);
        } catch (error) {
            Swal.fire({
                title: "Erro ao carregar produtos."
            });
        }
    }

    async function loadCategorys(): Promise<void> {

        if (!token) return;

        try {

            const response = await fetch(`${api}/categorys`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error("Erro ao buscar categorias");
            }

            const data = await response.json();

            setCategory(data.data);

        } catch (error) {
            Swal.fire({
                title: "Erro ao buscar categorias."
            });
        }
    }

    async function edit(codProduct: string) {
        if (!token) return;

        try {
            const response = await fetch(`${api}/products/search?codProduct=${codProduct}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (!response.ok) {
                throw new Error("Erro ao buscar produto.");
            }

            const data = await response.json();

            const product = data.data[0];

            const selectedCategory = category.find((item) => item.name = product.category);

            setNameProduct(product.name);
            setMarkProduct(product.mark);
            setPriceProduct(String(product.price));
            setCategoryProduct(selectedCategory ? String(selectedCategory.idCategory) : "");
        } catch (error) {
            Swal.fire({
                title: "Erro ao buscar produto."
            });
        }
    }

    async function saveEdit(codProduct: string): Promise<void> {
        try {

            const response = await fetch(`${api}/products/${codProduct}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    nameProduct: nameProduct,
                    mark: markProduct,
                    price: priceProduct,
                    idCategory: categoryProduct
                })
            });
            
            if (!response.ok) {
                throw new Error("Erro ao editar produtos.");
            }
            
            Swal.fire({
                title: "Produto atualizado com sucesso!"
            });

            setCodProduct("");
            setNameProduct("");
            setMarkProduct("");
            setPriceProduct("");
            setCategoryProduct("");
            setOpenModal(false);
        } catch(error) {
            console.log(error)
            Swal.fire({
                title: "Erro ao editar produto"
            })
        }
    }

    useEffect(() => {
        socket.connect();

        loadProducts();
        loadCategorys();

        socket.on("products:update", loadProducts);

        return () => {
            socket.off("products:update", loadProducts);
            socket.disconnect();
        }

    }, [])

    return (
        <div className="container-page-stock-clerk">
            <Navbar btn={buttonsStockClerck} />
            <main className="container-products-page-stock-clerk">
                <div className="card-products-page-stock-clerk">
                    <div className="card-header-products-stock-clerk">
                        <h1>Produtos</h1>
                        <div className="tbn-register-product">
                            <button type="button" className="btn" onClick={() => { setOpenModal(true) }}>Cadastrar novo produto</button>
                        </div>
                    </div>
                    <div className="card-body-products-stock-clerk">
                        <table>
                            <thead>
                                <tr>
                                    <th>Cód. Produto</th>
                                    <th>Nome</th>
                                    <th>Marca</th>
                                    <th>Preço</th>
                                    <th>Categoria</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.length > 0 ? (
                                    products.map((product) => (
                                        <tr key={product.codProduct}>
                                            <td>{product.codProduct}</td>
                                            <td>{product.name}</td>
                                            <td>{product.mark}</td>
                                            <td>{Number(product.price).toLocaleString("pt-BR", {
                                                style: "currency",
                                                currency: "BRL"
                                            })}</td>
                                            <td>{product.category}</td>
                                            <td><button className="btn" type="button" onClick={() => {
                                                edit(product.codProduct);
                                                setOpenModal(true);
                                                setCodProduct(product.codProduct);
                                            }}>Editar</button></td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6}>Nenhum produto carregado</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
            {openModal && (
                <div className="modal-edit-products-stock-clerk">
                    <div className="button-close">
                        <button type="button" className="btn-close" onClick={() => { setOpenModal(false) }}>X</button>
                    </div>
                    <form method="post" onSubmit={(event) => {
                        event.preventDefault();
                        saveEdit(codProduct);
                    }}>
                        <div className="form-group">
                            <label>Nome</label>
                            <input type="text" name="nameProduct" id="nameProduct" value={nameProduct} onChange={(event) => setNameProduct(event.target.value)} />
                        </div>
                        <div className="form-group">
                            <label>Marca</label>
                            <input type="text" name="markProduct" id="markProduct" value={markProduct} onChange={(event) => setMarkProduct(event.target.value)} />
                        </div>
                        <div className="form-group">
                            <label>Preço</label>
                            <input type="text" name="priceProduct" id="priceProduct" value={priceProduct} onChange={(event) => setPriceProduct(event.target.value)} />
                        </div>
                        <div className="form-group">
                            <select name="category" id="category" value={categoryProduct} onChange={(event) => setCategoryProduct
                                (event.target.value)}>
                                <option disabled value="">Selecionar...</option>
                                {category.map((category) => (
                                    <option key={category.idCategory} value={category.idCategory}>{category.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="button-modal">
                            <button type="submit" className="btn">Confirmar edição</button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}

export default ProductsStockClerk;
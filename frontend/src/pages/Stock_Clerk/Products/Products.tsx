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
import searchProduct from "../../../services/search";
import CardProduct from "../../../components/CardProduct/CardProduct";

function ProductsStockClerk() {

    const [products, setProducts] = useState<Product[]>([]);
    const [category, setCategory] = useState<Category[]>([]);
    const [openModalEdit, setOpenModalEdit] = useState(false);
    const [codProduct, setCodProduct] = useState("");
    const [nameProduct, setNameProduct] = useState("");
    const [markProduct, setMarkProduct] = useState("");
    const [priceProduct, setPriceProduct] = useState("");
    const [categoryProduct, setCategoryProduct] = useState("");

    // Registro
    const [nameProductRegister, setNameProductRegister] = useState("");
    const [markProductRegister, setMarkProductRegister] = useState("");
    const [priceProductRegister, setPriceProductRegister] = useState("");
    const [categoryProductRegister, setCategoryProductRegister] = useState(0);
    const [imageProductRegister, setImageProductRegister] = useState<File | null>(null);
    const [openModalRegister, setOpenModalRegister] = useState(false);

    // Busca
    const [searchNameProduct, setSearchNameProduct] = useState("");
    const [searchCodProduct, setSearchCodProduct] = useState("");
    const [searchIdCategory, setSearchIdCategory] = useState("");
    const [openModalSearch, setOpenModalSearch] = useState(false);
    const [searchProducts, setSearchProducts] = useState<Product[]>([])

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

    async function edit(codProduct: string): Promise<void> {
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

            const selectedCategory = category.find((item) => item.name === product.category);

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
            setOpenModalEdit(false);
        } catch (error) {
            console.log(error)
            Swal.fire({
                title: "Erro ao editar produto"
            })
        }
    }

    async function registerProduct(): Promise<void> {
        const result = await Swal.fire({
            title: "Você deseja realmente cadastrar este produto?",
            confirmButtonText: "Sim, cadastrar!",
            cancelButtonText: "Não, cancelar"
        });

        if (!result.isConfirmed) {
            Swal.fire({
                icon: "error",
                title: "Operação cancelada!"
            });
            return;
        }

        const formData = new FormData();
        formData.append("nameProduct", nameProductRegister);
        formData.append("mark", markProductRegister);
        formData.append("price", priceProductRegister);
        formData.append("idCategory", String(categoryProductRegister));

        if (imageProductRegister) {
            formData.append("image", imageProductRegister);
        }

        try {
            const response = await fetch(`${api}/products`, {
                method: "POST",
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            if (!response.ok) {
                throw new Error("Erro ao cadastrar produto");
            }

            Swal.fire({
                icon: "success",
                title: "Produto cadastrado com sucesso!",
            });

            setNameProductRegister("");
            setMarkProductRegister("");
            setPriceProductRegister("");
            setCategoryProductRegister(0);
            setOpenModalRegister(false);
        } catch (error) {
            console.log(error);
            Swal.fire({
                title: "Erro ao cadastrar produto."
            });
        }
    }

    async function search(): Promise<void> {

        if (!searchNameProduct && !searchCodProduct && !searchIdCategory) {
            Swal.fire({
                title: "Preencha pelo menos algum dos campos!"
            });
            return;
        }

        const response = await searchProduct(searchNameProduct, searchCodProduct, searchIdCategory);

        if (!response || response.length === 0) {
            Swal.fire({
                title: "Produto não encontrado!"
            });
            return;
        }

        setSearchProducts(response);
        setOpenModalSearch(true);
    }

    useEffect(() => {
        socket.connect();

        loadProducts();
        loadCategorys();

        socket.on("products:update", loadProducts);

        return () => {
            socket.off("products:update", loadProducts);
        }

    }, [])

    return (
        <div className="container-page-stock-clerk">
            <Navbar btn={buttonsStockClerck} />
            <main className="container-products-page-stock-clerk">
                <div className="card-products-page-stock-clerk">
                    <div className="card-header-products-stock-clerk">
                        <h1>Produtos</h1>
                        <div className="btn-register-product">
                            <button type="button" className="btn" onClick={() => { setOpenModalRegister(true) }}>Cadastrar novo produto</button>
                        </div>
                        <div className="search-products-page-stock-clerk">
                            <form method="post" onSubmit={(event) => {
                                event.preventDefault()
                                search()
                            }}>
                                <input type="text" value={searchNameProduct} onChange={(event) => setSearchNameProduct(event.target.value)}
                                    placeholder="Nome do produto" />
                                <input type="text" value={searchCodProduct} onChange={(event) => { setSearchCodProduct(event.target.value) }} placeholder="Cód. Produto" />
                                <select value={searchIdCategory} onChange={(event) => { setSearchIdCategory(event.target.value) }}>
                                    <option value="">Selecionar...</option>
                                    {category.map((item) => (
                                        <option key={item.idCategory} value={item.idCategory}>{item.name}</option>
                                    ))}
                                </select>
                                <button className="btn">Buscar</button>
                            </form>
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
                                                setOpenModalEdit(true);
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
            {openModalEdit && (
                <div className="modal-edit-products-stock-clerk">
                    <div className="button-close">
                        <button type="button" className="btn-close" onClick={() => { setOpenModalEdit(false) }}>X</button>
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
                                {category.map((item) => (
                                    <option key={item.idCategory} value={item.idCategory}>{item.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="button-modal">
                            <button type="submit" className="btn">Confirmar edição</button>
                        </div>
                    </form>
                </div>
            )}
            {openModalRegister && (

                <div className="modal-register-products-stock-clerk">
                    <div className="button-close">
                        <button type="button" className="btn-close" onClick={() => setOpenModalRegister(false)}>X</button>
                    </div>
                    <form method="post" onSubmit={(event) => {
                        event.preventDefault();
                        registerProduct();
                    }}>
                        <div className="form-group">
                            <label>Nome</label>
                            <input type="text" value={nameProductRegister} onChange={(event) => setNameProductRegister(event.target.value)} />
                        </div>
                        <div className="form-group">
                            <label>Marca</label>
                            <input type="text" value={markProductRegister} onChange={(event) => setMarkProductRegister(event.target.value)} />
                        </div>
                        <div className="form-group">
                            <label>Preço</label>
                            <input type="text" value={priceProductRegister} onChange={(event) => setPriceProductRegister(event.target.value)} />
                        </div>
                        <div className="form-group">
                            <label>Categoria</label>
                            <select value={categoryProductRegister} onChange={(event) => setCategoryProductRegister(Number(event.target.value))}>
                                <option value="" selected>Selecionar...</option>
                                {category.map((category) => (
                                    <option value={category.idCategory} key={category.idCategory}>{category.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <input className="input-image" type="file" accept="image/*" onChange={(event) => {
                                const file = event.target.files?.[0];

                                if (!file) {
                                    setImageProductRegister(null);
                                    return;
                                }

                                if (!file.type.startsWith("image/")) {
                                    Swal.fire({
                                        icon: "error",
                                        title: "Arquivo inválido!",
                                        text: "Selecione apenas imagens."
                                    });

                                    event.target.value = "";
                                    setImageProductRegister(null);
                                    return;
                                }

                                setImageProductRegister(file);
                            }}
                            />
                        </div>
                        <div className="button-register">
                            <button type="submit" className="btn">Registrar produto</button>
                        </div>
                    </form>
                </div>
            )}

            {openModalSearch && (
                <div className="modal-search-products-page">
                    <div className="modal-header-products-page">
                        <div className="modal-title-header-products-page">
                            <h1>Produtos</h1>
                        </div>
                        <button className="btn-close" onClick={(event) => {
                            setOpenModalSearch(false);
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
        </div>
    );
}

export default ProductsStockClerk;
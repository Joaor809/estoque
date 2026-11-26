import "./Products.css";
import { useEffect, useState } from "react";
import Navbar from "../../../components/Navbar/Navbar";
import { buttonsAdmin } from "../../../config/NavbarItems";
import api from "../../../services/api";
import { header } from "../../../services/headers";
import type { Product } from "../../../types/Product";
import CardProduct from "../../../components/CardProduct/CardProduct";
import type { Category } from "../../../types/Category";
import Button from "../../../components/Button/Button";
import Swal from "sweetalert2";
import searchProduct from "../../../services/search";
import socket from "../../../services/socket";

function ProductsAdmin() {

    const [products, setProducts] = useState<Product[]>([]);
    const [categorys, setCategorys] = useState<Category[]>([]);

    // register 
    const [openModalRegister, setOpenModalRegister] = useState<boolean>(false);
    const [nameProductRegister, setNameProductRegister] = useState<string>("");
    const [markProductRegister, setMarkProductRegister] = useState<string>("");
    const [priceProductRegister, setPriceProductRegister] = useState<string>("");
    const [categoryProductRegister, setCategoryProductRegister] = useState(0);
    const [imageProductRegister, setImageProductRegister] = useState<File | null>(null);

    // search
    const [searchNameProduct, setSearchNameProduct] = useState<string>("");
    const [searchCodProduct, setSearchCodProduct] = useState<string>("");
    const [searchCategory, setSearchCategory] = useState<string>("");
    const [searchProducts, setSearchProducts] = useState<Product[]>([]);
    const [openModalSearch, setOpenModalSearch] = useState<boolean>(false);

    async function loadProducts() {
        const response = await fetch(`${api}/products`, header)
        const data = await response.json();

        setProducts(data.data);
    }

    async function loadCategorys() {
        const response = await fetch(`${api}/categorys`, header);
        const data = await response.json()

        setCategorys(data.data);
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
                ...header,
                method: "POST",
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

        if (!searchNameProduct && !searchCodProduct && !searchCategory) {
            Swal.fire({
                title: "Preencha pelo menos algum dos campos!"
            });
            return;
        }

        const response = await searchProduct(searchNameProduct, searchCodProduct, searchCategory);

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
        <div className="products-admin-container-page">
            <Navbar btn={buttonsAdmin} />
            <div className="container-products-admin">
                <div className="header-info">
                    <h1>Produtos</h1>
                    <Button nameButton="Cadastrar produto" onClick={() => setOpenModalRegister(true)} />
                    <div className="search-products-admin">
                        <form onSubmit={(event) => {
                            event.preventDefault()
                            search()
                        }}>
                            <input type="text" value={searchNameProduct} onChange={(event) => setSearchNameProduct(event.target.value)} />
                            <input type="text" value={searchCodProduct} onChange={(event) => setSearchCodProduct(event.target.value)} />
                            <select value={searchCategory} onChange={(event) => setSearchCategory(event.target.value)}>
                                <option value="">Selecionar...</option>
                                {categorys.map((category) => (
                                    <option key={category.idCategory} value={category.idCategory}>{category.name}</option>
                                ))}
                            </select>
                            <Button nameButton="buscar" typeButton="submit"/>
                        </form>
                    </div>
                </div>
                <div className="card-products-admin">
                    {products.map((product) => (
                        <CardProduct product={product} />
                    ))}
                </div>
            </div>
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
                                {categorys.map((category) => (
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
                            <CardProduct product={product} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default ProductsAdmin;
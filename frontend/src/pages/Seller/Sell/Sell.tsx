import "./Sell.css";
import Button from "../../../components/Button/Button";
import Navbar from "../../../components/Navbar/Navbar";
import Products from "../../../components/Products/Products";
import { useEffect, useState } from "react";
import Input from "../../../components/Input/Input";
import type { Product } from "../../../types/Product";
import getProducts from "../../../services/getProducts";
import Modal from "../../../components/Modal/Modal";
import type { CartItem } from "../../../types/Cart";
import CardCart from "../../../components/CardCart/CardCart";
import api from "../../../services/api";
import Swal from "sweetalert2";

function Sell() {

    const [totalValue, setTotalValue] = useState(0);
    const [products, setProducts] = useState<Product[]>([]);
    const [codProduct, setCodProduct] = useState("");
    const [quantity, setQuantity] = useState("");
    const [cart, setCart] = useState<CartItem[]>([]);

    const [modalTitle, setModalTitle] = useState("");
    const [modalMessage, setModalMessage] = useState("");
    const [modalOpen, setModalOpen] = useState(false);

    const token = localStorage.getItem("token");

    if (!token) {
        return window.location.href = "/";
    }

    const buttons = [
        { name: "Produtos", link: "/products" },
        { name: "Vender", link: "/seller/sell" },
        { name: "Vendas", link: "/seller/sales" }
    ]

    function addToCart(codProduct: string) {

        if (!codProduct || !quantity) {
            alert("Preencha todos os campos!");
            return;
        }

        const product = products.find(
            product => product.codProduct == codProduct
        )

        if (!product) {
            alert("Produto não encontrado!");
            return;
        }
        if (Number(quantity) <= 0) {
            alert("Quantidade inválida!");
            return;
        }

        const itemCart = {
            codProduct: product.codProduct,
            name: product.name,
            mark: product.mark,
            value: product.price * Number(quantity),
            price: product.price,
            quantity: Number(quantity),
            imageLink: product.image
        }

        setCart([...cart, itemCart]);
        setCodProduct("");
        setQuantity("")

        setTotalValue(prev => prev + product.price * Number(quantity))
    }

    function removeItemFromCart(codProduct: string) {

        Swal.fire({
            title: "Deletar produto do carrinho",
            text: "Você deseja mesmo remover o produto do carrinho",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sim, remover!",
            cancelButtonText: "Cancelar"
        }).then((result) => {
            if (result.isConfirmed) {
                const item = cart.find(item => item.codProduct === codProduct);

                if (!item) return;

                setCart(prev => prev.filter(item => item.codProduct !== codProduct));

                setTotalValue(prev => prev - item.value);

                Swal.fire("Produto removido!");
            } else if (result.isDismissed) {
                Swal.fire("Operação cancelada!");
            }
        })


    }

    async function shopping(): Promise<void> {

        if (cart.length === 0) {
            Swal.fire("Carrinho vazio", "Adicione produtos antes de vender.", "warning")
        }

        try {
            const response = await fetch(`${api}/sales`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    products: cart,
                    totalValue
                })
            });

            const data = await response.json()

            if (!response.ok) {
                Swal.fire("Erro!", data.message, "warning");
                return;
            }

            Swal.fire("Sucesso", data.message, "success");

            setCart([]);
            setTotalValue(0);
        } catch (error) {
            console.log(error)
            Swal.fire("Erro", "Erro ao realizar venda", "error");
        }
    }

    useEffect(() => {
        async function loadProducts() {
            try {
                const response = await getProducts(token)

                if (!response.success) {
                    setModalTitle("Erro");
                    setModalMessage(response.message);

                    setModalOpen(true)
                    return;
                }

                setProducts(response.data)

            } catch (error) {
                setModalTitle("Erro");
                setModalMessage("Não foi possível conectar ao servidor.");
                setModalOpen(true);
            }
        }

        loadProducts()
    }, [])

    return (
        <div className="sell-container">
            <Navbar btn={buttons} />

            <div className="sell-content">
                <section className="products">
                    <Products />
                </section>
                <section className="cart">
                    <div className="cart-products">
                        <div className="cart-container">
                            {cart.map((item) => (
                                <CardCart key={item.codProduct} codProduct={item.codProduct} imgProduct={api + item.imageLink} nameProduct={item.name} quantity={item.quantity} value={item.value} mark={item.mark} onRemove={removeItemFromCart} />
                            ))}
                        </div>
                    </div>
                    <div className="total">
                        <form onSubmit={(event) => {
                            event.preventDefault();
                            addToCart(codProduct)
                        }}>
                            <section className="input-code">

                                <div className="inputs">
                                    <Input type="string" placeholder="código" value={codProduct} onChange={setCodProduct} />
                                    <Input type="number" placeholder="quantidade" value={quantity} onChange={setQuantity} />
                                </div>
                                <Button nameButton="Adicionar" typeButton="submit" />
                            </section>
                            <p>Total: {totalValue.toLocaleString("pt-BR", {
                                style: "currency",
                                currency: "BRL"
                            })}</p>
                        </form>
                        <div className="btn-sell">
                            <Button nameButton="Vender" typeButton="button" onClick={shopping} />
                        </div>
                    </div>
                </section>
            </div>
            <Modal title={modalTitle} message={modalMessage} isOpen={modalOpen} onClose={() => setModalOpen(false)} />
        </div>
    );
}

export default Sell;
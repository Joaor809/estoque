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

function Sell() {

    const [totalValue, setTotalValue] = useState(0);
    const [products, setProducts] = useState<Product[]>([]);
    const [codProduct, setCodProduct] = useState("");
    const [quantity, setQuantity] = useState("");
    const [cart, setCart] = useState<CartItem[]>([]);

    const [modalTitle, setModalTitle] = useState("");
    const [modalMessage, setModalMessage] = useState("");
    const [modalOpen, setModalOpen] = useState(false);



    const buttons = [
        { name: "Produtos", link: "/products" },
        { name: "Vender", link: "/seller/sell" },
        { name: "Vendas", link: "/seller/sales" }
    ]

    function addToCart(codProduct: string) {
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
            quantity: Number(quantity),
            imageLink: product.image
        }

        setCart([...cart, itemCart]);
        setCodProduct("");
        setQuantity("")

        setTotalValue(prev => prev += product.price * Number(quantity))
    }

    useEffect(() => {
        async function loadProducts() {
            try {
                const response = await getProducts("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZFVzZXIiOiI4NDkxNDc3Ny05NWRhLTRjZjgtOTQ0My1mNGI0YzU2OGJiZDMiLCJpZFJvbGUiOjEsImlhdCI6MTc5NDE2NDYxMCwiZXhwIjoxNzk0MjUxMDEwfQ.D1gzqOiq_GDLTvHrA5h40PdNcMxdtCeCP3uHDhLqpQw");

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
                        {cart.map((item) => (
                            <CardCart imgProduct={api + item.imageLink} nameProduct={item.name} quantity={item.quantity} value={item.value} mark={item.mark}/>
                        ))}
                    </div>
                    <div className="total">
                        <section className="input-code">
                            <div className="inputs">
                                <Input type="string" placeholder="código" value={codProduct} onChange={setCodProduct}/>
                                <Input type="number" placeholder="quantidade" value={quantity} onChange={setQuantity}/>
                            </div>
                            <Button nameButton="Adicionar" typeButton="button" onClick={() => addToCart(codProduct)}/>
                        </section>
                        <p>Total: {totalValue.toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL"
                        })}</p>
                        <div className="btn-sell">
                            <Button nameButton="Vender" typeButton="button"/>
                        </div>
                    </div>
                </section>
            </div>
            <Modal title={modalTitle} message={modalMessage} isOpen={modalOpen} onClose={() => setModalOpen(false)} />
        </div>
    );
}

export default Sell;
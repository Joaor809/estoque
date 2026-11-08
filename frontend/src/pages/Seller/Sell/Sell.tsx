import "./Sell.css";
import Button from "../../../components/Button/Button";
import Navbar from "../../../components/Navbar/Navbar";
import Products from "../../../components/Products/Products";
import { useState } from "react";
import Input from "../../../components/Input/Input";

function Sell() {

    const [totalValue, setTotalValue] = useState(0)


    const buttons = [
        { name: "Produtos", link: "/products" },
        { name: "Vender", link: "/sell" },
        { name: "Vendas", link: "/sales" }
    ]

    return (
        <div className="sell-container">
            <Navbar btn={buttons} />

            <div className="sell-content">
                <section className="products">
                    <Products />
                </section>
                <section className="cart">
                    <div className="cart-products">

                    </div>
                    <div className="total">
                        <section className="input-code">
                            <Input type="string" />
                            <Button nameButton="Adicionar" typeButton="submit" />
                        </section>
                        <p>Total: {totalValue}</p>
                        <div className="btn-sell">
                            <Button nameButton="Vender" />
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default Sell;
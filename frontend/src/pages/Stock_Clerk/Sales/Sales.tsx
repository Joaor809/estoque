import { useEffect, useState } from "react";
import Navbar from "../../../components/Navbar/Navbar";
import { buttonsStockClerck } from "../../../config/NavbarItems";
import "./Sales.css";
import type { productSold, Sale } from "../../../types/Sales";
import api from "../../../services/api";
import { header } from "../../../services/headers";
import Swal from "sweetalert2";
import socket from "../../../services/socket";
import Button from "../../../components/Button/Button";

function SalesStockClerk() {

    const [sales, setSales] = useState<Sale[]>([])
    const [listProducts, setListProducts] = useState<productSold[]>([]);
    const [openModal, setOpenModal] = useState<Boolean>(false);

    async function loadSales() {
        try {

            const response = await fetch(`${api}/sales`, header);
            const data = await response.json();

            setSales(data.data);
        } catch (error) {
            console.log(error);
        }
    }

    async function loadProductsSold(idSale: number): Promise<void> {
        try {

            const response = await fetch(`${api}/sales/items/${idSale}`, header);
            const data = await response.json();
            
            setListProducts(data.data);
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        socket.connect()

        loadSales();

        socket.on("sales:update", loadSales);

        return () => {
            socket.off("sales:update", loadSales);
        }
    })

    return (
        <div className="sales-container-stock-clerk">
            <Navbar btn={buttonsStockClerck} />
            <div className="card-sales-stock-clerk">
                <div className="card-header-stock-clerk">
                    <h1>Vendas</h1>
                </div>
                <div className="card-body-stock-clerk">
                    <table>
                        <thead>
                            <tr>
                                <th>ID da venda</th>
                                <th>Data</th>
                                <th>Valor</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sales.map((sale) => (
                                <tr>
                                    <td>{sale.idSale}</td>
                                    <td>{new Date(sale.date).toLocaleDateString("pt-BR")}</td>
                                    <td>{Number(sale.totalValue).toLocaleString("pt-BR", {
                                        style: "currency",
                                        currency: "BRL"
                                    })}</td>
                                    <td><Button nameButton="Ver produtos" onClick={() => {
                                        setOpenModal(true);
                                        loadProductsSold(sale.idSale);
                                    }} /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {openModal && (
                        <div className="modal-products">
                            <div className="modal-header">
                                <h1>Produtos</h1>
                                <button className="btn-close" onClick={() => setOpenModal(false)}>
                                    <i className="bi bi-x"></i>
                                </button>
                            </div>
                            <div className="modal-body">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Produto</th>
                                            <th>Marca</th>
                                            <th>Quantidade</th>
                                            <th>Preço total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {listProducts.map((product) => (
                                            <tr>
                                                <td>{product.name}</td>
                                                <td>{product.mark}</td>
                                                <td>{product.quantity}</td>
                                                <td>{Number(product.price * product.quantity).toLocaleString("pt-BR", {
                                                    style: "currency",
                                                    currency: "BRL"
                                                })}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default SalesStockClerk;
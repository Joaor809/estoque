import Swal from "sweetalert2";
import Button from "../../../components/Button/Button";
import Navbar from "../../../components/Navbar/Navbar"
import { buttonsSeller } from "../../../config/NavbarItems"
import api from "../../../services/api";
import socket from "../../../services/socket";
import type { productSold, Sale } from "../../../types/Sales";
import "./Sales.css"
import { useEffect, useState } from "react";

export default function Sales() {

    const [sales, setSales] = useState<Sale[]>([]);
    const [openModal, setOpenModal] = useState(false)
    const [listProducts, setListProducts] = useState<productSold[]>([])

    async function loadProductsSold(idSale: number): Promise<void> {
        const response = await fetch(`${api}/sales/items/${idSale}`);
        const data = await response.json();

        setListProducts(data.data);
    }


    useEffect(() => {
        async function loadSales(): Promise<void> {
            const response = await fetch(`${api}/sales`);

            const data = await response.json();

            if (!response.ok) {
                Swal.fire({
                    title: "Erro ao buscar vendas"
                });
            }

            setSales(data.data);
        }

        // função executada quando o backend avisar que alguma alteração foi feita
        function handleStockUpdate() {
            loadSales();
        }

        loadSales();

        // Registra o evento que será recebido do backend
        socket.on("stock:update", handleStockUpdate);

        // inicia a coneção com o servidor
        socket.connect();

        // remove o evento e encerra a conexão ao sair da página
        return () => {
            socket.off("stock:update", handleStockUpdate);
            socket.disconnect();
        }

    }, [])

    return (
        <div className="sales-container">
            <Navbar btn={buttonsSeller} />
            <main className="container">
                <div className="sales">
                    <div className="sales-header">
                        <h1>Vendas</h1>
                    </div>
                    <div className="sales-body">

                        {sales.map((sale) => (
                            <div className="card-sale" key={sale.idSale}>
                                <div className="card-header">
                                    <p><i className="bi bi-cart"></i> <strong>Venda</strong> #{sale.idSale}</p>
                                </div>
                                <div className="card-body">
                                    <div className="icon">
                                        <i className="bi bi-cart4"></i>
                                    </div>
                                    <div className="card-info">
                                        <div className="dataSale">
                                            <i className="bi bi-calendar"></i>
                                            <div className="dataSaleInfo">
                                                <p><strong>Data:</strong></p>
                                                {new Date(`${sale.date}`).toLocaleDateString("pt-BR")}
                                            </div>
                                        </div>
                                        <div className="valueSale">
                                            <i className="bi bi-coin"></i>
                                            <div className="valueSaleInfo">
                                                <p><strong>Valor:</strong></p>
                                                {Number(sale.totalValue).toLocaleString("pt-BR", {
                                                    style: "currency",
                                                    currency: "BRL"
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="card-footer">
                                    <Button nameButton="Ver produtos" onClick={() => {
                                        setOpenModal(true);
                                        loadProductsSold(sale.idSale);
                                    }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>

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
                                    <th>Preço unitátio</th>
                                    <th>Preço total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {listProducts.map((product) => (
                                    <tr>
                                        <td>{product.name}</td>
                                        <td>{product.mark}</td>
                                        <td>{product.quantity}</td>
                                        <td>{product.price}</td>
                                        <td>{product.price * product.quantity}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    )
}

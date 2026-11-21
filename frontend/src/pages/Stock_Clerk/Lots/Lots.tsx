import "./Lots.css";
import { useEffect, useState } from "react";
import Navbar from "../../../components/Navbar/Navbar";
import api from "../../../services/api";
import { buttonsStockClerck } from "../../../config/NavbarItems";
import type { Lots } from "../../../types/Lot";
import CardLot from "../../../components/CardLot/CardLot";
import Swal from "sweetalert2";
import { getToken } from "../../../services/authService";
import socket from "../../../services/socket";
import type { Product } from "../../../types/Product";
import { header, headerWithJson } from "../../../services/headers";
import Button from "../../../components/Button/Button";

function LotsStockClerk() {

    const token = getToken();

    const [validLots, setValidLots] = useState<Lots[]>([]);
    const [invalidLots, setInvalidLots] = useState<Lots[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [openModal, setOpenModal] = useState<Boolean>(false)

    const [codProduct, setCodProduct] = useState<string>("");
    const [quantity, setQuantity] = useState<Number>(0);
    const [expirationDate, setExpirationDate] = useState<string>("")

    async function getValidLots() {
        try {

            const response = await fetch(`${api}/lots/valid`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();

            setValidLots(data.data);
        } catch (error) {
            console.log(error);
            Swal.fire({
                title: "Erro ao buscar lotes"
            })
        }
    }

    async function getInvalidLots() {
        try {
            const response = await fetch(`${api}/lots/invalid`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();

            setInvalidLots(data.data);
        } catch (error) {
            console.log(error);
            Swal.fire({
                title: "Erro ao buscar lotes"
            })
        }
    }

    async function loadProducts() {
        try {

            const response = await fetch(`${api}/products`, header)

            const data = await response.json();

            setProducts(data.data)
        } catch (error) {
            Swal.fire({
                title: "Erro ao buscar produtos."
            });
        }
    }

    async function registerLot() {
        try {

            const response = await fetch(`${api}/lots`, {
                ...headerWithJson,
                method: "POST",
                body: JSON.stringify({
                    codProduct,
                    quantity,
                    expirationDate
                })
            });

            
            Swal.fire({
                title: "Lote cadastrado com sucesso!",
                icon: "success"
            });
            setOpenModal(false);
        } catch (error) {
            console.log("error")
            Swal.fire({
                title: "Erro ao cadastrar lote."
            })
        }
    }

    useEffect(() => {
        socket.connect();

        getValidLots();
        getInvalidLots();
        loadProducts();

        socket.on("stock:update", getValidLots);
        socket.on("stock:update", getInvalidLots);

        return () => {
            socket.off("stock:update", getValidLots);
            socket.off("stock:update", getInvalidLots);
            socket.disconnect();
        }
    }, [])

    return (
        <div className="container-lots-page-stock-clerk">
            <Navbar btn={buttonsStockClerck} />
            <div className="card-lots-stock-clerk">
                <div className="card-header-lots">
                    <h1>Lotes</h1>
                    <div className="button-register">
                        <button type="button" className="btn" onClick={() => setOpenModal(true)}>Cadastrar lote</button>
                    </div>
                </div>
            </div>
            {openModal && (
                <div className="modal-register-lots-stock-clerk">
                    <div className="modal-register-lots-info-stock-clerk">
                        <h2>Cadastro de lotes</h2>
                        <button type="button" className="btn-close" onClick={() => setOpenModal(false)}>X</button>
                    </div>
                    <form onSubmit={registerLot}>
                        <div className="form-group">
                            <select value={codProduct} onChange={(event) => setCodProduct(event.target.value)}>
                                <option value="">Selecionar...</option>
                                {products.map((product) => (
                                    <option value={product.codProduct}>{product.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Quantidade</label>
                            <input type="number" value={Number(quantity)} onChange={(event) => setQuantity(Number(event.target.value))} />
                        </div>
                        <div className="form-group">
                            <label>Data de validade</label>
                            <input type="date" value={expirationDate} onChange={(event) => setExpirationDate(event.target.value)} />
                        </div>
                        <div className="button-submit">
                            <Button nameButton="Cadastrar" />
                        </div>
                    </form>
                </div>
            )}
            <section className="good-products">
                <h1>Lotes dentro da data de validade</h1>
                {validLots.length > 0 ? (
                    <div className="lots">
                        {validLots.map((lot) => (
                            <CardLot key={lot.codLot} lot={lot} />
                        ))}
                    </div>
                ) : (
                    <div className="not-lots">
                        <h3>Nenhum lote válido!</h3>
                    </div>
                )}
            </section>
            <section className="invalid-products">
                <h1>Lotes inválidos ou deletados</h1>
                {invalidLots.length > 0 ? (
                    <div className="lots">
                        {invalidLots.map((lot) => (
                            <CardLot key={lot.codLot} lot={lot} />
                        ))}
                    </div>
                ) : (
                    <div className="not-lots">
                        <h3>Nenhum lote válido!</h3>
                    </div>
                )}
            </section>
        </div>
    );
}

export default LotsStockClerk;
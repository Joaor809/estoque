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

function Lots() {

    const token = getToken();

    const [lots, setLots] = useState<Lots[]>([])

    async function loadLots() {
        try {

            const response = await fetch(`${api}/lots`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();

            setLots(data.data);
        } catch (error) {
            console.log(error);
            Swal.fire({
                title: "Erro ao buscar lotes"
            })
        }
    }

    useEffect(() => {
        socket.connect();

        loadLots();

        socket.on("stock:update", loadLots);

        return () => {
            socket.off("stock:update", loadLots);
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
                        <button type="button" className="btn">Cadastrar lote</button>
                    </div>
                </div>
                <div className="card-body-lots">
                    {lots.map((lot, index) => (
                        <CardLot key={index} lot={lot} />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Lots;
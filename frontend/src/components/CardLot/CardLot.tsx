import { useState } from "react";
import "./CardLot.css";
import type { Lots } from "../../types/Lot";
import api from "../../services/api";
import { formatDate } from "../../services/formatDate";
import { getToken } from "../../services/authService";
import Swal from "sweetalert2";

function CardLot({ lot }: { lot: Lots }) {

    const [openModalLot, setOpenModalLot] = useState(false);
    const [available, setAvailable] = useState(Number(lot.available))

    const token = getToken();

    async function handleAvailability(): Promise<void> {
        try {
            const newAvailability = available === 1 ? 0 : 1;

            const response = await fetch(`${api}/lots/${lot.codLot}/availability`, {
                method: "PUT",
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    available: newAvailability
                })
            });

            if (!response.ok) {
                throw new Error("Erro ao atualizar disponibilidade");
            }

            setAvailable(newAvailability);

            Swal.fire({
                title: "Disponibilidade atualizada com sucesso!"
            });
        } catch (error) {
            console.log(error);
            Swal.fire({
                title: "Erro ao atualizar disponibilidade"
            });
        }
    }

    return (
        <div className="card-lot">
            <div className="card-lot-header">
                <h2>{lot.codLot}</h2>
                <i className="bi bi-box-seam-fill"></i>
            </div>
            <div className="card-lot-body">
                <img src={api + lot.image} alt={lot.name} />
                <div className="info">
                    <h3>{lot.name}</h3>
                    <div className="lot-info-item">
                        <i className="bi bi-box-seam-fill"></i>
                        <div>
                            <p>Quantidade:</p>
                            <strong>{lot.quantity}</strong>
                        </div>
                    </div>
                    <div className="lot-info-item">
                        <i className="bi bi-calendar"></i>
                        <div>
                            <p>Validade:</p>
                            <strong>{formatDate(lot.expirationDate)}</strong>
                        </div>
                    </div>
                </div>
            </div>
            <div className="card-lot-footer">
                <button type="button" className="button-modal-info-lot" onClick={() => setOpenModalLot(true)}><i className="bi bi-eye"></i> Ver mais</button>
                <button className={available === 1 ? "btn-block" : "btn-release"} onClick={handleAvailability}>
                    {available === 1 ? "Bloquear vendas" : "Liberar para vendas"}
                </button>
            </div>
            {openModalLot && (
                <div className="card-modal-lots">
                    <div className="card-modal-header">
                        <h2><i className="bi bi-box-seam-fill"></i> Lote: {lot.codLot}</h2>
                        <button type="button" className="btn-close" onClick={() => setOpenModalLot(false)}>X</button>
                    </div>
                    <div className="card-modal-body">
                        <img src={api + lot.image} alt={lot.name} />
                        <div className="info-lot">
                            <h2>{lot.name}</h2>
                            <p><i className="bi bi-box-seam-fill"></i> Código do Produto: <strong>{lot.name}</strong></p>
                            <p><i className="bi bi-tag-fill"></i> Marca: <strong>{lot.mark}</strong></p>
                            <p><i className="bi bi-box-seam-fill"></i> Quantidade: <strong>{lot.quantity}</strong></p>
                            <p><i className="bi bi-coin"></i> Preço unitário: <strong>{Number(lot.price).toLocaleString("pt-BR", {
                                style: "currency",
                                currency: "BRL"
                            })}</strong></p>
                            <p><i className="bi bi-calculator"></i> Preço Total do Lote: <strong>{(Number(lot.price) * lot.quantity).toLocaleString("pt-BR", {
                                style: "currency",
                                currency: "BRL"
                            })}</strong></p>
                            <p><i className="bi bi-calendar-fill"></i> Data de entrada: <strong>{formatDate(lot.entryDate)}</strong></p>
                            <p><i className="bi bi-calendar-check-fill"></i> Data de validade: <strong>{formatDate(lot.expirationDate)}</strong></p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CardLot;
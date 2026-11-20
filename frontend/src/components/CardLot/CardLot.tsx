import { useState } from "react";
import Button from "../Button/Button";
import "./CardLot.css";
import type { Lots } from "../../types/Lot";
import api from "../../services/api";
import { formatDate } from "../../services/formatDate";

function CardLot({ lot }: { lot: Lots }) {

    const [openModalLot, setOpenModalLot] = useState(false);

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
            </div>
            {openModalLot && (
                <div className="card-modal-lots">
                    <div className="card-modal-header">
                        <i className="bi bi-box-seam-fill"></i>
                        <h2>Lote: {lot.codLot}</h2>
                        <div className="btn-close">
                            <button type="button" className="btn-close" onClick={() => setOpenModalLot(false)}>X</button>
                        </div>
                    </div>
                    <div className="card-modal-body">
                        <img src={api + lot.image} alt={lot.name} />
                        <div className="info-lot">
                            <h2>{lot.name}</h2>
                            <p><i className="bi bi-box-seam-fill"></i> Código do Produto: {lot.name}</p>
                            <p><i className="bi bi-tag-fill"></i> Marca: {lot.mark}</p>
                            <p><i className="bi bi-box-seam-fill"></i> Quantidade: {lot.quantity}</p>
                            <p><i className="bi bi-coin"></i> Preço unitário: {lot.price}</p>
                            <p><i className="bi bi-calculator"></i> Preço Total do Lote: {(Number(lot.price) * lot.quantity).toLocaleString("pt-BR", {
                                style: "currency",
                                currency: "BRL"
                            })}</p>
                            <p><i className="bi bi-calendar-fill"></i> Data de entrada: {formatDate(lot.entryDate)}</p>
                            <p><i className="bi bi-calendar-check-fill"> Data de validade: {formatDate(lot.expirationDate)}</i></p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CardLot;
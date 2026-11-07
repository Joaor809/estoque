import { useState } from "react";
import Button from "../Button/Button";
import "./CardLot.css";

type Lot = {
    codProduct: string;
    codLot: string;
    nameProduct: string;
    imgProduct: string;
    quantity: number;
    entryDate: string;
    expirationDate: string;
}

function CardLot({ codProduct, codLot, nameProduct, imgProduct, quantity, entryDate, expirationDate }: Lot) {

    const [openModal, setOpenModal] = useState(false);

    return (
        <>
            <div className="card-lot">
                <div className="card-header">
                    <h1>LOT00001{codLot}</h1>
                </div>
                <div className="card-body">
                    <h3>{nameProduct}</h3>
                    <img src={imgProduct} alt={nameProduct} />
                    <div className="card-info">
                        <span>Quantidade: {quantity}</span>
                        <span>Data de validade: {expirationDate}</span>
                    </div>
                </div>
                <div className="card-footer">
                    <Button nameButton="Ver mais" onClick={() => setOpenModal(true)}/>
                </div>
            </div>

            {openModal && (
                <div className="modal">
                    <div className="modal-header">
                        <h1>Código: {codLot}</h1>
                    </div>
                    <div className="modal-content">
                        <h3>INFORMAÇÕES DO LOTE</h3>

                        <p>Código do produto: {codProduct}</p>
                        <p>Produto: {nameProduct}</p>
                        <p>Quantidade: {quantity}</p>
                        <p>Data de entrada: {entryDate}</p>
                        <p>Data de validade: {expirationDate}</p>
                    </div>
                    <div className="modal-footer">
                        <Button nameButton="Fechar" onClick={() => setOpenModal(false)} />
                    </div>
                </div>
            )}
        </>
    );
}

export default CardLot;
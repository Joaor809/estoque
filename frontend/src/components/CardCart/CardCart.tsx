import Button from "../Button/Button";
import "./CardCart.css";

type CardCatProps = {
    codProduct: string;
    nameProduct: string;
    quantity: number;
    value: number;
    mark: string;
    imgProduct: string;
    onRemove: (codProduct: string) => void;
}

function CardCart({ codProduct, nameProduct, mark, value, quantity, imgProduct, onRemove }: CardCatProps){

    

    return (
        <div className="card-cart">
            <div className="img-product">
                <img src={imgProduct} alt={nameProduct} />
            </div>
            <div className="info-product">
                <h4>{nameProduct} - {mark}</h4>
                <span><strong>Quantidade:</strong> {quantity}</span>
                <span><strong>Preço:</strong> {value.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL"
                })}</span>
                <div className="btn-remove">
                    <Button nameButton="Remover" onClick={() => onRemove(codProduct)}/>
                </div>
            </div>
        </div>
    )
}

export default CardCart;
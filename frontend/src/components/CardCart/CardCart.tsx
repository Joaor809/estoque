import "./CardCart.css";

type CardCatProps = {
    imgProduct: string;
    nameProduct: string;
    quantity: number;
    value: number;
    mark: string;
}

function CardCart({ imgProduct, nameProduct, quantity, value, mark }: CardCatProps){
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
            </div>
        </div>
    )
}

export default CardCart;
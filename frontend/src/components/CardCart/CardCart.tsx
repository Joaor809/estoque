import "./CardCart.css";

type CardCatProps = {
    imgProduct: string;
    nameProduct: string;
    quantity: number;
    value: number;
}

function CardCart({ imgProduct, nameProduct, quantity, value }: CardCatProps){
    return (
        <div className="card-cart">
            <div className="img-product">
                <img src={imgProduct} alt={nameProduct} />
            </div>
            <div className="info-product">
                <h4>{nameProduct}</h4>
                <span>Quantidade: {quantity}</span>
                <span>Preço: {value}</span>
            </div>
        </div>
    )
}

export default CardCart;
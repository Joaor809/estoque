export type Product = {
    codProduct: string;
    name: string;
    mark: string;
    price: number;
    category: string;
    image: string;
    quantity: number;
}

export type ProductsResponse = {
    success: boolean;
    message: string;
    data: Product[];
};
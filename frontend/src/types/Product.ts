export type Product = {
    codProduct: string;
    name: string;
    mark: string;
    price: number;
    category: string;
    image: string
}

export type ProductsResponse = {
    success: boolean;
    message: string;
    data: Product[];
};
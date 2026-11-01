import type { Request, Response } from "express";
import type { ResultSetHeader, RowDataPacket } from "mysql2";
import conn from "../config/db.js";

// interface para Produtos
interface Products {
    codProduct: string,
    nameProduct: string,
    mark: string,
    price: number,
    idCategory: number
}

// Função que é usada para listar todos os produtos
export async function getProducts(req: Request, res: Response) {
    try {
        const sql: string = `
            SELECT p.codProduct, p.name, p.mark, p.price, c.name as "category"
            FROM products AS p
            INNER JOIN categorys AS c ON c.idCategory = p.idCategory;
        `;
        const [products] = await conn.query<RowDataPacket[]>(sql);
        
        if (products.length === 0) {
            return res.status(200).json({
                success: true,
                message: "Nenhum produto encontrado!"
            });
        }
        return res.status(200).json({
            success: true,
            products
        });

    } catch(error) {
        return res.status(500).json({
            success: false,
            message: "Erro ao buscar produtos!"
        });
    }
}

// Função que é usadas para cadastrar produtos
export async function postProducts(req: Request, res: Response){
    try {
        const { codProduct, nameProduct, mark, price, idCategory } = req.body as Products;
        const sql: string = `
            INSERT INTO products(codProduct, name, mark, price, idCategory) VALUES(?, ?, ?, ?, ?);
        `;

        const response = await conn.query(sql, [codProduct, nameProduct, mark, price, idCategory]);

        return res.status(200).json({
            success: true,
            message: "Produto cadastrado com sucesso!"
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            messagem: "Erro ao cadastrar produto!"
        });
    }
}

// Função que é usada para deletar produtos
export async function deleteProduct(req: Request, res: Response){
    const { codProduct } = req.params;
    
    if (!codProduct) {
        return res.status(400).json({
            success: false,
            message: "Código do produto não encontrado!"
        });
    } else {
        try {
            const sql = `
                DELETE FROM products where codProduct = ?;
            `;
            
            const [response] = await conn.query<ResultSetHeader>(sql, [codProduct]);
            
            if (response.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Produto não encontrado para ser deletado."
                });
            }
            
            return res.status(200).json({
                success: true,
                message: "Produto deletado com sucesso!"
            });

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Erro ao deletar produto!"
            });
        }
    }
}

export async function updateProduct(req: Request, res: Response){
    const { codProduct } = req.params;  

    const { nameProduct, mark, price, idCategory } = req.body as Products;

    if (!codProduct) {
        return res.status(400).json({
            success: false,
            message: "Código do produto não informado!"
        });
    }

    try {
        const sql: string = `
            UPDATE products SET name = ?, mark = ?, price = ?, idCategory = ? WHERE codProduct = ?;
        `;

        const [response] = await conn.query<ResultSetHeader>(sql, [nameProduct, mark, price, idCategory, codProduct]);

        if (response.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Produto não encontrado!"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Produto atualizado com sucesso!"
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Erro ao atualizar produto!"
        });
    }
}

export async function searchProduct(req: Request, res: Response) {
    const { codProduct, nameProduct } = req.query;
    
    const code = String(codProduct || "");
    const name = String(nameProduct || "");

    try {
        let sql = `
            SELECT
                p.codProduct,
                p.name,
                p.mark,
                p.price,
                c.name as "category"
            FROM products AS p
            INNER JOIN categorys AS c ON c.idCategory = p.idCategory
        `;
        let params: string [] = [];

        if (code && name) {
            sql += ` WHERE p.name = ? AND p.codProduct = ?`;
            params = [name, code];

        } else if (code) {
            sql += ` WHERE p.codProduct = ?`;
            params = [code];

        } else if (name) {
            sql += ` WHERE p.name LIKE ?`;
            params = [`%${name}%`];

        } else {
            return getProducts(req, res);
        }

        const [response] = await conn.query<RowDataPacket[]>(sql, params);

        if (response.length === 0) {
            return res.status(200).json({
                success: true,
                message: "Nenhum produto cadastrado"
            });
        }
        return res.status(200).json({
            success: true,
            data: response
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Erro ao buscar produto!"
        });
    }
}
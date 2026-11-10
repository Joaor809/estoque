import type { Request, Response } from "express";
import conn from "../config/db.js";
import type { RowDataPacket, ResultSetHeader } from "mysql2/promise";

interface Lot extends RowDataPacket {
    codLot: string;
    quantity: number;
    expirationDate: Date;
    available: Boolean;
}

// Função para poder realizar a venda


interface Lot extends RowDataPacket {
    codLot: string;
    quantity: number;
    expirationDate: Date;
}

export async function shopping(req: Request, res: Response) {
    const { products, totalValue } = req.body;
    console.log(products)

    const connection = await conn.getConnection();

    try {
        
        (await connection).beginTransaction()
        const [result] = await connection.query<ResultSetHeader>("INSERT INTO sales (totalValue) VALUES (?);", totalValue)
        const idSale = result.insertId;

        for (const product of products) {
            const sql = `
            SELECT p.name as product, l.codLot, l.quantity, l.expirationDate
            FROM lots as l
            INNER JOIN products AS p ON p.codProduct = l.codProduct
            WHERE l.codProduct = ?
	            AND l.quantity > 0
	            AND l.expirationDate >= CURDATE()
	            AND l.available = 1
            ORDER BY l.expirationDate ASC;
        `
            const [lots] = await connection.query<Lot[]>(sql, [product.codProduct])

            if (lots.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: `Nenhum lote disponível para o produto: ${product.codProduct}`
                })
            }

            let remaining = product.quantity;
            
            
            
            for (const lot of lots) {
                if (remaining <= 0) {
                    break;
                }
                const sqlItemSale = "INSERT INTO item_sale(idSale, codLot, quantity, price) VALUES (?, ?, ?, ?)";
                
                const quantity = Math.min(remaining, lot.quantity);
                
                await connection.query(sqlItemSale, [idSale, lot.codLot, quantity, product.price])
                await connection.query("UPDATE lots SET quantity = quantity - ? WHERE codLot = ?", [quantity, lot.codLot])

                remaining -= quantity;
            }
            
            (await connection).commit()

            if (remaining > 0) {
                return res.status(400).json({
                    success: false,
                    message: `Estoque insuficiente para o produto: ${product.codProduct}`
                })
            }
        }

        return res.status(200).json({
            success: true,
            message: "Venda realizada com sucesso"
        });
        
    } catch (error) {
        (await connection).rollback()
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Erro ao realizar venda"
        });
    } finally {
        (await connection).release()
    }

}



// Função para pegar todas as vendas que foram realizadas
export async function getSales(req: Request, res: Response) {
    try {
        const sql: string = `
            SELECT * FROM sales;
        `
        const [response] = await conn.query(sql);

        return res.status(200).json({
            success: true,
            data: response
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Erro ao buscar vendas"
        });
    }
}

// Função para pegar todos os itens de uma determinada venda
export async function getItemsSale(req: Request, res: Response) {
    const { idSale } = req.params;

    if (!idSale) {
        return res.status(400).json({
            success: false,
            message: "ID da compra não fornecido."
        });
    }

    try {
        const sql: string = `
            SELECT i.idItem, p.name, i.quantity, i.price
            FROM item_sale AS i
            INNER JOIN lots AS l ON l.codLot = i.codLot
            INNER JOIN products AS p ON p.codProduct = l.codProduct
            WHERE i.idSale = ?;
        `;

        const [response] = await conn.query<RowDataPacket[]>(sql, [idSale]);

        return res.status(200).json({
            success: true,
            data: response
        });
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Erro ao pegar items da venda."
        });
    }
}

// Função que busca vendas acima de um determinado valor
export async function getSalesAboveValue(req: Request, res: Response) {
    const { minValue } = req.params;

    if (!minValue) {
        return res.status(400).json({
            success: false,
            message: "Valor mínimo não fornecido."
        });
    }

    try {
        const sql: string = `
            SELECT * FROM sales
            WHERE totalValue >= ?;
        `;

        const [response] = await conn.query(sql, [minValue]);

        return res.status(200).json({
            success: true,
            data: response
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Erro ao buscar vendas."
        });
    }
}
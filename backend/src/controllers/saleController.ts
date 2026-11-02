import type { Request, Response } from "express";
import conn from "../config/db.js";
import type { RowDataPacket, ResultSetHeader } from "mysql2";

// Função para poder realizar a venda
export async function shopping(req: Request, res: Response) {
    const { products, totalValue } = req.body;

    const connection = await conn.getConnection(); // getConnection() solicita uma conexão individual

    try {

        await connection.beginTransaction() // beginTransaction() inicia uma transação no banco de dados.

        const [sale] = await conn.query<ResultSetHeader>("INSERT INTO sales(totalValue) VALUES (?)", [totalValue]);

        const idSale: number = sale.insertId;

        for (const product of products) {
            await connection.query("INSERT INTO item_sale(idSale, codLot, quantity, price) VALUES (?, ?, ?, ?)", [idSale, product.codLot, product.quantity, product.price]);

            const [response] = await connection.query<ResultSetHeader>("UPDATE lots SET quantity = quantity - ? WHERE codLot = ? AND quantity >= ?", [product.quantity, product.codLot, product.quantity]);

            if (response.affectedRows === 0) {
                await connection.rollback(); // rollback() desfaz todas as alterações realizadas na transação desde o último beginTransaction()
                
                return res.status(400).json({
                    success: false,
                    message: "Lote inexistente ou quantidade insuficiente."
                });
            }

        }

        await connection.commit(); // commit() se tudo funcionar, confirma as alterações.

        return res.status(201).json({
            success: true,
            message: "Venda realizada com sucesso!"
        });
    } catch (error) {
        await connection.rollback();

        return res.status(500).json({
            success: false,
            message: "Erro ao realizar venda."
        });
    } finally {
        connection.release();
    }
}

// Função para pegar todas as vendas que foram realizadas
export async function getSales(req: Request, res: Response){
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
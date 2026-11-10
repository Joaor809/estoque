import type { Request, Response } from "express";
import conn from "../config/db.js";
import { generateCode } from "../utils/generateCode.js";
import type { ResultSetHeader, RowDataPacket } from "mysql2";
import type { Interface } from "readline";

interface Lot {
    codLot: string,
    codProduct: string,
    quantity: number,
    entryDate: string,
    expirationDate: string
}

// Função usada para buscar todos os Lotes
export async function getLots(req: Request, res: Response) {
    try {
        const sql: string = `
            SELECT p.codProduct, l.codLot, p.name, l.quantity, l.entryDate, l.expirationDate
            FROM lots AS l
            INNER JOIN products AS p ON l.codProduct = p.codProduct;
        `;

        const [response] = await conn.query(sql);

        return res.status(200).json({
            success: true,
            data: response
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Erro ao buscar lotes."
        });
    }
}

// Função usada para pegar um lote pelo seu código
export async function getLotByCodLot(req: Request, res: Response) {
    const { codLot } = req.params;

    if (!codLot) {
        return res.status(400).json({
            success: false,
            message: "Código do lote não informado"
        });
    }

    try {
        const sql: string = `
            SELECT l.codLot, p.name, l.quantity, l.entryDate, l.expirationDate
            FROM lots AS l
            INNER JOIN products AS p ON l.codProduct = p.codProduct
            WHERE l.codLot = ?;
        `;

        const [response] = await conn.query<RowDataPacket[]>(sql, [codLot]);

        return res.status(200).json({
            success: true,
            data: response[0]
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Erro ao buscar lote."
        });
    }
}

// Função usada para buscar lotes de acordo com o código do produto
export async function getLotByCodProduct(req: Request, res: Response) {
    const { codProduct } = req.params;

    if (!codProduct) {
        return res.status(400).json({
            success: false,
            message: "Código do produto não fornecido."
        });
    }

    try {
        const sql: string = `
            SELECT l.codLot, p.name, l.quantity, l.entryDate, l.expirationDate
            FROM lots AS l
            INNER JOIN products AS p ON l.codProduct = p.codProduct
            WHERE p.codProduct = ?;
        `;

        const [response] = await conn.query<RowDataPacket[]>(sql, [codProduct]);

        return res.status(200).json({
            success: true,
            data: response
        });

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Erro ao buscar lotes."
        });
    }
}

// Função usada para cadastrar novos lotes
export async function postLots(req: Request, res: Response) {
    
    
    try {
        let codLot: string = "";
        let exists: boolean = true;
        let attempts: number = 0;

        while (exists && attempts < 5) {
            const prefix: string = "LOT";
            const code: string = generateCode(10000, 90000);

            codLot = prefix + code;

            const [response] = await conn.query<RowDataPacket[]>("SELECT * FROM lots WHERE codLot = ?", [codLot]);

            exists = response.length > 0;
            attempts++;
        }
        
        const { codProduct, quantity, expirationDate } = req.body as Lot;

        if (!codProduct || !quantity || !expirationDate) {
                return res.status(400).json({
                        success: false,
                        message: "Preencha todos os campos"
            });
        }

        const sql: string = `
            INSERT INTO lots(codLot, codProduct, quantity, expirationDate)
            VALUES (?, ?, ?, ?)
        `

        await conn.query(sql, [codLot, codProduct, quantity, expirationDate]);

        return res.status(201).json({
            success: true,
            message: "Lote cadastrado com sucesso!"
        });

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Erro ao cadastrar produto."
        });
    }
}

// Função usada para atualizar lotes
export async function updateLots(req: Request, res: Response) {
    const { codLot } = req.params;

    if (!codLot) {
        return res.status(400).json({
            success: false,
            message: "Código do lote não fornecido."
        });
    }

    try {
        const { codProduct, quantity, entryDate, expirationDate } = req.body as Lot;

        const sql: string = "UPDATE lots SET codProduct = ?, quantity = ?, entryDate = ?, expirationDate = ? WHERE codLot = ?;";

        const [response] = await conn.query<ResultSetHeader>(sql, [codProduct, quantity, entryDate, expirationDate, codLot]);

        if (response.affectedRows > 0) {
            return res.status(200).json({
                success: true,
                message: "Produto atualizado com sucesso!"
            });
        } else {
            return res.status(404).json({
                success: false,
                message: "Lote não encontrado!"
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Erro ao atualizar lote."
        });
    }
}

// Função usada para deletar lotes
export async function deleteLots(req: Request, res: Response) {
    const { codLot } = req.params;

    if (!codLot) {
        return res.status(400).json({
            success: false,
            message: "Código do lote não fornecido."
        });
    }

    try {
        const sql: string = "DELETE FROM lots WHERE codLot = ?;";

        await conn.query(sql, [codLot]);

        return res.status(400).json({
            success: true,
            message: "Lote deletado com sucesso!"
        });

    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Erro ao deletar lote."
        });
    }
}

export async function alterStatus(req: Request, res: Response) {
    const { codProduct } = req.params;
    const { type } = req.body;

    
}
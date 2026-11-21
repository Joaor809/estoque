import type { Request, Response } from "express";
import conn from "../config/db.js";
import { generateCode } from "../utils/generateCode.js";
import type { ResultSetHeader, RowDataPacket } from "mysql2";
import type { Interface } from "readline";
import { getIO } from "../config/socket.js";

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
            SELECT p.codProduct, l.codLot, p.name, p.mark, l.quantity, l.entryDate, l.expirationDate, p.price, p.image, l.available
            FROM products AS p
            INNER JOIN lots AS l ON l.codProduct = l.codProduct;
        `;

        
        const [response] = await conn.query(sql);
        
        getIO().emit("stock:update");

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
            WHERE l.codLot = ?
            AND expirationDate >= CURDATE()
            AND l.quantity > 0.;
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

        getIO().emit("stock:update");

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
        const sql = `
            UPDATE lots
            SET deleted = 1, available = 0
            WHERE codLot = ?
        `;

        const [result] = await conn.query<ResultSetHeader>(sql, [codLot]);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Lote não encontrado."
            });
        }

        getIO().emit("stock:update");

        return res.status(200).json({
            success: true,
            message: "Lote removido com sucesso!"
        });

    } catch (error) {
        console.error("Erro ao deletar lote:", error);

        return res.status(500).json({
            success: false,
            message: "Erro ao deletar lote."
        });
    }
}

// Função usada para mudar o status do lote 
export async function updateAvailableLots(req: Request, res: Response) {
    try {
        const { codLot } = req.params;
        const { available } = req.body;

        if (available !== 0 && available !== 1) {
            return res.status(400).json({
                success: false,
                message: "Disponibilidade inválida"
            });
        }

        const [result] = await conn.query<ResultSetHeader>("UPDATE lots SET available = ? WHERE codLot = ?", [available, codLot]);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Lote não encontrado."
            });
        }

        getIO().emit("stock:update");

        return res.status(200).json({
            success: true,
            message: "Disponibilidade atualizada."
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Erro ao atualizar disponibilidade."
        });
    }
}

// Função usada para pegar produtos válidos
export async function getValidLots(req: Request, res: Response) {
    try {
        const sql: string = `
        SELECT p.codProduct, l.codLot, p.name, l.quantity, l.entryDate, l.expirationDate, p.price, p.mark, l.available, l.deleted
        FROM products AS p
        INNER JOIN lots AS l ON l.codProduct = p.codProduct
            WHERE l.expirationDate >= CURDATE()
            AND l.quantity > 0
            AND l.deleted = 0;`;

        const [result] = await conn.query<RowDataPacket[]>(sql);
        console.log(result);

        getIO().emit("stock:update");

        return res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Erro ao buscar lotes."
        });
    }
}


// Função usada para pegar produtos inválidos
export async function getInvalidLots(req: Request, res: Response) {
    try {
        const sql: string = `
            SELECT p.codProduct, l.codLot, p.name, l.quantity, l.entryDate, l.expirationDate, p.price, p.mark, l.available, l.deleted
            FROM products AS p
            INNER JOIN lots AS l ON l.codProduct = p.codProduct
            WHERE
                p.codProduct IS NULL
                OR l.quantity IS NULL OR l.quantity <= 0
                OR l.entryDate IS NULL
                OR l.expirationDate IS NULL
                OR l.expirationDate < l.entryDate
                OR l.deleted = 1;`

        const [result] = await conn.query<RowDataPacket[]>(sql);

        return res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Erro ao buscar lotes."
        });
    }
}

import type { Request, Response } from "express";
import type { ResultSetHeader, RowDataPacket } from "mysql2";
import conn from "../config/db.js";

export async function getCategorys(req: Request, res: Response) {
    try {
        const sql: string = "SELECT * FROM categorys;";

        const [response] = await conn.query<RowDataPacket[]>(sql);

        return res.status(200).json({
            success: true,
            data: response
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Erro ao buscar categorias."
        });
    }
}

export async function postCategorys(req: Request, res: Response) {
    const { nameCategory } = req.body;

    if (!nameCategory) {
        return res.status(400).json({
            success: false,
            message: "Preencha o nome da categoria!"
        });
    }

    try {
        const sql: string = "INSERT INTO categorys(name) VALUES (?);";

        await conn.query(sql, [nameCategory]);

        return res.status(201).json({
            success: true,
            message: "Categoria cadastrada com sucesso!"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Erro ao cadastrar categoria."
        });
    }
}

export async function deleteCategorys(req: Request, res: Response) {
    const { idCategory } = req.params;

    if (!idCategory) {
        return res.status(400).json({
            success: false,
            message: "ID da categoria não informado."
        });
    }

    try {
        const sql: string = "DELETE FROM categorys WHERE idCategory = ?;";

        await conn.query(sql, [idCategory]);

        return res.status(200).json({
            success: true,
            message: "Categoria deletada com sucesso!"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Erro ao deletar categoria."
        });
    }
}
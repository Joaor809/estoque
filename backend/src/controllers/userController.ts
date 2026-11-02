import type { Request, Response } from "express";
import conn from "../config/db.js";

interface User{
    name: string,
    userName: string,
    cpf: string,
    email: string,
    telephone: string,
    idRole: number
}

export async function postUser(req: Request, res: Response) {
    const { name, userName, cpf, email, telephone, idRole } = req.body as User;

    if (!name || !userName || !cpf || !email || !telephone){
        return res.status(400).json({
            success: false,
            message: "Preencha todos os campos!"
        });
    }

    try {
        const sql: string = `
            INSERT INTO users(name, userName, cpf, email, telephone, idRole)
        `
    }
}
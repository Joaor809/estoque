import type { Request, Response } from "express";
import conn from "../config/db.js";
import { key } from "../config/key.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import type { RowDataPacket } from "mysql2";

// Função que faz o login do usuário
export default async function login(req: Request, res: Response) {
    const { userName, password } = req.body;

    try {

        const sql: string = `
            SELECT
                idUser,
                userName,
                password,
                idRole
            FROM users
            WHERE userName = ?;
        `
    
        const [rows] = await conn.query<RowDataPacket[]>(sql, [userName])
    
        if (rows.length === 0) {
            return res.status(401).json({
                success: false,
                message: "Nome de usuário ou senha inválidos!"
            });
        }
    
        const user = rows[0];
    
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Nome de usuário ou senha inválidos!"
            });
        }
    
        const passwordMatch: boolean = await bcrypt.compare(password, user?.password);
    
        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                message: "Nome de usuário ou senha inválidos!"
            });
        }
    
        const token = jwt.sign(
            {
                idUser: user.idUser,
                idRole: user.idRole
            },
            process.env.JWT_SECRET as string,
            {
                expiresIn: "1d"
            }
        );

        return res.status(200).json({
            success: true,
            token: token,
            user: {
                idUser: user.idUser,
                userName: user.userName,
                idRole: user.idRole
            }
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Erro ao fazer login!"
        });
    }

}
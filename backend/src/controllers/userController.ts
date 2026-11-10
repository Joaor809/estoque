import type { Request, Response } from "express";
import conn from "../config/db.js";
import { hashData } from "../utils/hashData.js";
import { generateUUID } from "../utils/generateUUID.js";
import { key } from "../config/key.js";

interface User {
    name: string,
    userName: string,
    cpf: string,
    email: string,
    telephone: string,
    password: string,
    idRole: number
}

// Função usada para cadastrar novos usuários
export async function postUser(req: Request, res: Response) {
    const { name, userName, cpf, email, telephone, password, idRole } = req.body as User;

    if (!name || !userName || !cpf || !email || !telephone) {
        return res.status(400).json({
            success: false,
            message: "Preencha todos os campos!"
        });
    }

    try {

        const idUser: string = await generateUUID();

        const passwordHash: string = await hashData(password);

        const sql: string = `
            INSERT INTO users(idUser, name, userName, cpf, email, telephone, password, idRole) VALUES
            (?, ?, ?, AES_ENCRYPT(?, ?), AES_ENCRYPT(?, ?), AES_ENCRYPT(?, ?), ?, ?);
        `;

        const response = await conn.query(sql, [idUser, name, userName, cpf, key, email, key, telephone, key, passwordHash, idRole]);

        return res.status(201).json({
            success: true,
            message: "Usuário cadastrado com sucesso!"
        });

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Erro ao cadastrar usuário."
        });
    }
}

// Função usada para pegar todos os usuários
export async function getUsers(req: Request, res: Response) {
    try {
        const sql: string = `
            SELECT
                u.idUser,
                u.name, 
                u.userName, 
                CAST(AES_DECRYPT(u.cpf, ?) AS CHAR) AS cpf, 
                CAST(AES_DECRYPT(u.email, ?) AS CHAR) AS email, 
                CAST(AES_DECRYPT(u.telephone, ?) AS CHAR) AS telephone, 
                r.name as role,
            FROM users AS u
            INNER JOIN roles AS r ON u.idRole = r.idRole;
        `;
        // CAST(... AS CHAR): converte o resultado binário da descriptografia para texto.

        const [response] = await conn.query(sql, [key, key, key]);

        return res.status(200).json({
            success: true,
            data: response
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Erro ao buscar usuários"
        });
        console.log(error)
    }
}

// Função usada para buscar usuários pelo CPF
export async function getUserByCPF(req: Request, res: Response) {
    const { cpf } = req.params;

    if (!cpf) {
        return res.status(400).json({
            success: false,
            message: "CPF não fornecido."
        });
    }

    try {
        const sql: string = `
            SELECT
                u.idUser 
	            u.name,
                u.userName, 
                CAST(AES_DECRYPT(u.cpf, ?) AS CHAR) AS cpf, 
                CAST(AES_DECRYPT(u.email, ?) AS CHAR) AS email,
                CAST(AES_DECRYPT(u.telephone, ?) AS CHAR) AS telephone, 
                r.name as role
            FROM users AS u
            INNER JOIN roles AS r ON u.idRole = r.idRole
            WHERE u.cpf = AES_ENCRYPT(?, ?);
        `;

        const [response] = await conn.query(sql, [key, key, key, cpf, key]);

        return res.status(200).json({
            success: true,
            data: response
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Erro ao buscar usuário."
        });
    }
}

// Função usada para editar dados dos usuários
export async function updateUser(req: Request, res: Response) {
    const { idUser } = req.params;
    const { name, userName, cpf, email, telephone } = req.body as User;

    if (!idUser) {
        return res.status(400).json({
            success: false,
            message: "ID do usuário não fornecido."
        });
    }

    if (!name || !userName || !cpf || !email || !telephone) {
        return res.status(400).json({
            success: false,
            message: "Preencha todos os campos!"
        });
    }

    try {
        const sql: string = `
            UPDATE users
            SET 
                name = ?, 
                userName = ?, 
                cpf = AES_ENCRYPT(?, ?),
                email = AES_ENCRYPT(?, ?),
                telephone = AES_ENCRYPT(?, ?)
            WHERE idUser = ?;
        `;

        await conn.query(sql, [name, userName, cpf, key, email, key, telephone, key, idUser])

        return res.status(200).json({
            success: true,
            message: "Usuário atualizado com sucesso."
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Erro ao editar usuário."
        });
    }
}
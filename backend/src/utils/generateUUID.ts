import { randomUUID } from "crypto";
import conn from "../config/db.js";

export async function generateUUID(): Promise<string> {
    let idUser: string;
    let exists: boolean;

    do {
        idUser = crypto.randomUUID()

        const sql: string = "SELECT idUser FROM users WHERE idUser = ?;";

        const [rows] = await conn.query(sql, [idUser]);

        exists = (rows as any[]).length > 0;

    } while (exists);

    return idUser;
}
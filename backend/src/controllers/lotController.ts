import type { Request, Response } from "express";
import conn from "../config/db.js";

export async function getLots(req: Request, res: Response) {
    try {
        const sql: string = `
            SELECT 
        `
    }
}
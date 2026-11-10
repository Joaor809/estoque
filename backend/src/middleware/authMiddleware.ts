import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// Função de autenticação
export function authMiddleware(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Token não fornecido."
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string);

        (req as any).user = decoded;

        return next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Token inválido ou expirado."
        });
    }
}
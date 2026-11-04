declare global {
    namespace Express {
        interface Request {
            user?: {
                idUser: number;
                role: string;
            };
        }
    }
}

export {};
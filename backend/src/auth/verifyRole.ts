export function verifyRole(...roles: Number[]) {
    return (req: any, res: any, next: any) => {
        if (!req.user || !roles.includes(req.user.idRole)) {
            return res.status(403).json({
                success: false,
                message: "Acesso negado!"
            });
        }

        next();
    };
}
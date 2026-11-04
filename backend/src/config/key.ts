import dotenv from "dotenv";

dotenv.config();

export const key = process.env.ENCRYPTION_KEY as string;
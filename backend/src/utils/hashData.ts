import bcrypt from "bcrypt"

export async function hashData(data: string): Promise<string> {
    return await bcrypt.hash(data, 10);
}
export function generateCode(param1: number, param2: number){
    return Math.floor(param1 + Math.random() * param2).toString();
}
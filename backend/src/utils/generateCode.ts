export function generateCode(param1: number, param2: number){
    return Math.floor(param1 + Math.random() * param2).toString();
}

const test = generateCode(10000000, 90000000);
console.log(test)
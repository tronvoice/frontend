import { BigNumber } from "ethers";

// Make object with BigNumbers and object with numbers
export function simplifyObjectWithBigNumbers(obj: { [key: string]: any }): any {
    const copy = { ...obj };
    for (const [key, value] of Object.entries(obj)) {
        if (value._isBigNumber) {
            copy[key] = value.toNumber();
        }
    }
    return copy;
}
export function simplifyArrayWithBigNumbers(arr: BigNumber[]): number[] {
    return arr.map(v => v.toNumber());
}
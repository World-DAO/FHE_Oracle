declare module 'fhevmjs' {
    export function createFhevmInstance(options: { chainId: number }): Promise<any>;
    export interface FhevmInstance {
        encrypt(value: number): Promise<any>;
        decrypt(encryptedValue: string): Promise<any>;
        serialize(encryptedValues: any[]): Uint8Array;
    }
}
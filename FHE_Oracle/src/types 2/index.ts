import { ethers } from "ethers";

// 计算请求
export interface ComputationRequest {
    requestId: string;
    data: number[];
    operationType: number;
    additionalParams?: any;
}

// 计算结果
export interface ComputationResult {
    requestId: string;
    result: string;
    timestamp: number;
}

// FHE操作类型
export enum FHEOperationType {
    ADDITION = 1,
    MULTIPLICATION = 2,
    COMPARISON = 3,
}

// FHEVM合约交互类型
export interface FHEVMContract {
    performComputation(
        requestId: string,
        encryptedData: string,
        operationType: number
    ): Promise<ethers.ContractTransaction>;

    getResult(requestId: string): Promise<string>;
}
import { ethers } from 'ethers';
import { FHEOperationType } from '../types';
import { logger } from '../utils/logger';
import { createFhevmInstance } from 'fhevmjs';

export class FHEComputer {
    private provider: ethers.JsonRpcProvider;
    private wallet: ethers.Wallet;
    private contract: ethers.Contract;
    private fhevm: any;

    constructor(
        rpcUrl: string,
        privateKey: string,
        contractAddress: string,
        contractAbi: any
    ) {
        this.provider = new ethers.JsonRpcProvider(rpcUrl);
        this.wallet = new ethers.Wallet(privateKey, this.provider);
        this.contract = new ethers.Contract(contractAddress, contractAbi, this.wallet);

        this.initFhevm();

        logger.info('FHE Computer initialized');
    }

    private async initFhevm() {
        const network = await this.provider.getNetwork();
        const chainId = Number(network.chainId);

        this.fhevm = await createFhevmInstance({ chainId });
        logger.info('fhEVM instance initialized');
    }

    async compute(
        requestId: string,
        data: number[],
        operationType: FHEOperationType
    ): Promise<string> {
        logger.info(`Processing computation request: ${requestId}`);

        try {
            const encryptedData = await this.encryptData(data);

            const tx = await this.contract.performComputation(
                requestId,
                encryptedData,
                operationType
            );

            logger.info(`Transaction submitted: ${tx.hash}`);

            const receipt = await tx.wait();
            logger.info(`Transaction confirmed in block: ${receipt.blockNumber}`);

            const result = await this.contract.getResult(requestId);
            return this.decryptResult(result);

        } catch (error) {
            logger.error(`Computation failed: ${(error as Error).message}`);
            throw new Error(`Failed to perform FHE computation: ${(error as Error).message}`);
        }
    }

    private async encryptData(data: number[]): Promise<Uint8Array> {
        const encryptedValues = await Promise.all(
            data.map(value => this.fhevm.encrypt(value))
        );

        return this.fhevm.serialize(encryptedValues);
    }

    private async decryptResult(encryptedResult: string): Promise<string> {
        const result = await this.fhevm.decrypt(encryptedResult);
        return result.toString();
    }

    async getResult(requestId: string): Promise<string> {
        try {
            const encryptedResult = await this.contract.getResult(requestId);
            return this.decryptResult(encryptedResult);
        } catch (error) {
            logger.error(`Failed to get result: ${(error as Error).message}`);
            throw new Error(`Failed to retrieve computation result: ${(error as Error).message}`);
        }
    }
}
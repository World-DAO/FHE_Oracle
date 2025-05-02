import { ethers } from 'ethers';
import { FHEOperationType } from '../types';
import { logger } from '../utils/logger';

export class FHEComputer {
    private provider: ethers.providers.JsonRpcProvider;
    private wallet: ethers.Wallet;
    private contract: ethers.Contract;

    constructor(
        rpcUrl: string,
        privateKey: string,
        contractAddress: string,
        contractAbi: any
    ) {
        this.provider = new ethers.providers.JsonRpcProvider(rpcUrl);
        this.wallet = new ethers.Wallet(privateKey, this.provider);
        this.contract = new ethers.Contract(contractAddress, contractAbi, this.wallet);

        logger.info('FHE Computer initialized');
    }

    async compute(
        requestId: string,
        encryptedData: string,
        operationType: FHEOperationType
    ): Promise<string> {
        logger.info(`Processing computation request: ${requestId}`);

        try {
            const tx = await this.contract.performComputation(
                requestId,
                encryptedData,
                operationType
            );

            logger.info(`Transaction submitted: ${tx.hash}`);

            const receipt = await tx.wait();
            logger.info(`Transaction confirmed in block: ${receipt.blockNumber}`);

            const result = await this.contract.getResult(requestId);
            return result;

        } catch (error) {
            logger.error(`Computation failed: ${(error as Error).message}`);
            throw new Error(`Failed to perform FHE computation: ${(error as Error).message}`);
        }
    }

    async getResult(requestId: string): Promise<string> {
        try {
            const result = await this.contract.getResult(requestId);
            return result;
        } catch (error) {
            logger.error(`Failed to get result: ${(error as Error).message}`);
            throw new Error(`Failed to retrieve computation result: ${(error as Error).message}`);
        }
    }
}
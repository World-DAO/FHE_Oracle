import { ethers } from 'ethers';
import { FHEOperationType } from '../types';
import { logger } from '../utils/logger';
import { createInstance } from 'fhevmjs';

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

        this.initFhevm().then(() => {
            logger.info('FHE Computer fully initialized');
        }).catch(error => {
            logger.error(`FHEVM initialize failed: ${error.message}`);
            throw error;
        });
    }

    private async initFhevm() {
        try {
            logger.info(`Initializing fhEVM`);
            this.fhevm = await createInstance({
                networkUrl: "https://eth-sepolia.public.blastapi.io",
                gatewayUrl: "https://gateway.sepolia.zama.ai",
                kmsContractAddress: "0x9D6891A6240D6130c54ae243d8005063D05fE14b",
                aclContractAddress: "0xFee8407e2f5e3Ee68ad77cAE98c434e637f516e5",
            });
            if (!this.fhevm) {
                throw new Error('Failed to create fhEVM instance');
            }
            console.log('fhevm structure:', this.fhevm);
            logger.info('fhEVM instance initialized successfully');
        } catch (error) {
            logger.error(`fhEVM initialization failed: ${(error as Error).message}`);
            throw error;
        }
    }

    async compute(
        requestId: string,
        data: number[],
        operationType: FHEOperationType
    ): Promise<string> {
        if (!this.fhevm) {
            throw new Error(' No fhEVM instance!');
        }
        logger.info(`Processing computation request: ${requestId}`);

        try {
            const userAddress = "0xa5e1defb98EFe38EBb2D958CEe052410247F4c80";
            const contractAddress = "0xfCefe53c7012a075b8a711df391100d9c431c468";
            const input = this.fhevm.createEncryptedInput(contractAddress, userAddress);
            data.forEach(value => {
                input.add16(value);
            });
            const encrypted = await input.encrypt();
            const handles = encrypted.handles;
            console.log('handle[0]:', handles[0]);
            console.log('handle[1]:', handles[1]);
            console.log('inputProof:', input.inputProof);
            // const merged = new Uint8Array(handles[0].length + handles[1].length);
            // merged.set(handles[0], 0);
            // // merged.set(handles[1], handles[0].length);
            // const encryptedData = ethers.hexlify(merged);
            // logger.info(`EncryptedData: ${encryptedData}`);

            const tx = await this.contract.performComputation(
                requestId,
                handles[0],
                handles[1],
                encrypted.inputProof,
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
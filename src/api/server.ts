import express from 'express';
import bodyParser from 'body-parser';
import { FHEComputer } from '../services/fhe-computer';
import { ComputationRequest, FHEOperationType } from '../types';
import { logger } from '../utils/logger';
import { contractABI } from '../config/contract-abi';

const PORT = process.env.PORT || 3000;
const FHEVM_RPC_URL = process.env.FHEVM_RPC_URL || 'http://localhost:8545';
const PRIVATE_KEY = process.env.PRIVATE_KEY || '';
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS || '';

const app = express();
app.use(bodyParser.json());

// 初始化FHE计算服务
const fheComputer = new FHEComputer(
    FHEVM_RPC_URL,
    PRIVATE_KEY,
    CONTRACT_ADDRESS,
    contractABI
);

// 健康检查
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

// 提交计算请求
app.post('/compute', async (req, res) => {
    try {
        const { requestId, encryptedData, operationType } = req.body as ComputationRequest;

        // 验证请求
        if (!requestId || !encryptedData || operationType === undefined) {
            res.status(400).json({
                success: false,
                error: 'Missing required parameters'
            });
        }

        // 验证操作类型
        if (!Object.values(FHEOperationType).includes(operationType)) {
            res.status(400).json({
                success: false,
                error: 'Invalid operation type'
            });
        }

        logger.info(`Received computation request: ${requestId}`);

        // 执行计算
        const computationPromise = fheComputer.compute(
            requestId,
            encryptedData,
            operationType
        );

        // 立即返回响应
        res.status(202).json({
            success: true,
            message: 'Computation request accepted',
            requestId
        });

        // 在后台处理计算
        computationPromise
            .then(result => {
                logger.info(`Computation completed for request: ${requestId}`);
            })
            .catch(error => {
                logger.error(`Computation failed for request ${requestId}: ${error.message}`);
            });
    } catch (error) {
        logger.error(`Error processing computation request: ${(error as Error).message}`);
        res.status(500).json({
            success: false,
            error: (error as Error).message
        });
    }
});

// 获取计算结果端点
app.get('/result/:requestId', async (req, res) => {
    try {
        const { requestId } = req.params;

        logger.info(`Retrieving result for request: ${requestId}`);

        const result = await fheComputer.getResult(requestId);

        res.json({
            success: true,
            requestId,
            result
        });
    } catch (error) {
        logger.error(`Error retrieving result: ${(error as Error).message}`);
        res.status(500).json({
            success: false,
            error: (error as Error).message
        });
    }
});

// 启动服务器
app.listen(PORT, () => {
    logger.info(`FHE Computation Service running on port ${PORT}`);
});
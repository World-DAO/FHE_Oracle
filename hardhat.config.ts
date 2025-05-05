import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "dotenv/config";

const privateKey = process.env.PRIVATE_KEY;
const zamaTestnetUrl = process.env.ZAMA_TESTNET_URL || "https://testnet.zama.ai";

const config: HardhatUserConfig = {
    solidity: {
        compilers: [
            {
                version: "0.8.20",
                settings: {
                    optimizer: {
                        enabled: true,
                        runs: 200,
                    },
                    evmVersion: "paris"
                },
            },
            {
                version: "0.8.19",
                settings: {
                    optimizer: {
                        enabled: true,
                        runs: 200,
                    },
                    evmVersion: "paris"
                },
            }
        ],
    },
    networks: {
        hardhat: {
        },
        zama_testnet: {
            url: zamaTestnetUrl,
            accounts: privateKey ? [privateKey] : [],
        },
    },
    paths: {
        sources: "./contracts",
        tests: "./contracts/test",
        cache: "./cache",
        artifacts: "./artifacts",
    },
    mocha: {
        timeout: 40000,
    },
};

export default config;
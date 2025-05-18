import "@nomicfoundation/hardhat-toolbox";

export const solidity = {
    version: "0.8.19",
    settings: {
        optimizer: {
            enabled: true,
            runs: 200
        }
    }
};
export const networks = {
    fhevm: {
        url: "https://testnet.fhevm.network",
        chainId: 9090
    }
};
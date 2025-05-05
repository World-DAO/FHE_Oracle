// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
import "./interfaces/IFHEComputation.sol";
import "./FHEStorage.sol";

import "fhevm/lib/TFHE.sol";

contract FHEComputation is IFHEComputation, FHEStorage {
    enum OperationType {
        ADDITION,
        MULTIPLICATION,
        COMPARISON
    }

    constructor() {}

    function performComputation(
        string memory requestId,
        bytes memory encryptedData,
        uint8 operationType
    ) external returns (bool) {
        require(!resultExists(requestId), "Result already exists");
        require(
            operationType <= uint8(OperationType.COMPARISON),
            "Invalid operation type"
        );

        bytes memory result;

        if (operationType == uint8(OperationType.ADDITION)) {
            result = performAddition(encryptedData);
        } else if (operationType == uint8(OperationType.MULTIPLICATION)) {
            result = performMultiplication(encryptedData);
        } else if (operationType == uint8(OperationType.COMPARISON)) {
            result = performComparison(encryptedData);
        }

        storeResult(requestId, result);

        emit ComputationPerformed(requestId, result);
        emit ResultStored(requestId);

        return true;
    }

    function getResult(
        string memory requestId
    ) external view override returns (bytes memory) {
        require(resultExists(requestId), "Result not found");
        return getStoredResult(requestId);
    }

    function performAddition(
        bytes memory encryptedData
    ) private pure returns (bytes memory) {
        euint8 a = TFHE.asEuint8(uint8(encryptedData[0]));
        euint8 b = TFHE.asEuint8(uint8(encryptedData[1]));
        euint8 result = TFHE.add(a, b);
        return abi.encode(result);
    }

    function performMultiplication(
        bytes memory encryptedData
    ) private pure returns (bytes memory) {
        euint8 a = TFHE.asEuint8(uint8(encryptedData[0]));
        euint8 b = TFHE.asEuint8(uint8(encryptedData[1]));
        euint8 result = TFHE.mul(a, b);
        return abi.encode(result);
    }

    function performComparison(
        bytes memory encryptedData
    ) private pure returns (bytes memory) {
        euint8 a = TFHE.asEuint8(uint8(encryptedData[0]));
        euint8 b = TFHE.asEuint8(uint8(encryptedData[1]));
        ebool result = TFHE.gt(a, b);
        return abi.encode(result);
    }
}

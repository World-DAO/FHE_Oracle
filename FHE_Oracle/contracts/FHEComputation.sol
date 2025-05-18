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
        einput inputHandleA,
        einput inputHandleB,
        bytes memory inputProof,
        uint8 operationType
    ) external {
        emit ComputationPerformed(requestId, abi.encode("start", 0));
        require(!resultExists(requestId), "Result already exists");
        require(
            operationType <= uint8(OperationType.COMPARISON),
            "Invalid operation type"
        );

        bytes memory result;

        euint8 data_a = TFHE.asEuint8(inputHandleA, inputProof);
        euint8 data_b = TFHE.asEuint8(inputHandleB, inputProof);

        if (operationType == uint8(OperationType.ADDITION)) {
            result = performAddition(data_a, data_b);
        } else if (operationType == uint8(OperationType.MULTIPLICATION)) {
            result = performMultiplication(data_a, data_b);
        } else if (operationType == uint8(OperationType.COMPARISON)) {
            result = performComparison(data_a, data_b);
        }

        storeResult(requestId, result);
        emit ComputationPerformed(requestId, result);
        emit ResultStored(requestId);
    }

    function getResult(
        string memory requestId
    ) external view override returns (bytes memory) {
        require(resultExists(requestId), "Result not found");
        return getStoredResult(requestId);
    }

    function performAddition(
        euint8 data_a,
        euint8 data_b
    ) private returns (bytes memory) {
        euint8 result = TFHE.add(data_a, data_b);
        return abi.encode(result);
    }

    function performMultiplication(
        euint8 data_a,
        euint8 data_b
    ) private returns (bytes memory) {
        euint8 result = TFHE.mul(data_a, data_b);
        return abi.encode(result);
    }

    function performComparison(
        euint8 data_a,
        euint8 data_b
    ) private returns (bytes memory) {
        ebool result = TFHE.gt(data_a, data_b);
        return abi.encode(result);
    }
}

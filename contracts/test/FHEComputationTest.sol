// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "../FHEComputation.sol";

contract FHEComputationTest {
    FHEComputation private fheComputation;

    constructor() {
        fheComputation = new FHEComputation();
    }

    function testAddition(
        string memory requestId,
        bytes memory data
    ) external returns (bool) {
        return
            fheComputation.performComputation(
                requestId,
                data,
                uint8(FHEComputation.OperationType.ADDITION)
            );
    }

    function testMultiplication(
        string memory requestId,
        bytes memory data
    ) external returns (bool) {
        return
            fheComputation.performComputation(
                requestId,
                data,
                uint8(FHEComputation.OperationType.MULTIPLICATION)
            );
    }

    function testComparison(
        string memory requestId,
        bytes memory data
    ) external returns (bool) {
        return
            fheComputation.performComputation(
                requestId,
                data,
                uint8(FHEComputation.OperationType.COMPARISON)
            );
    }
}

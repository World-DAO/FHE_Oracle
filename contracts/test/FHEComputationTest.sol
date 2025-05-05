// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../FHEComputation.sol";

contract FHEComputationTest is FHEComputation {
    function testAddition(
        bytes memory data
    ) external pure returns (bytes memory) {
        return performAddition(data);
    }

    function testMultiplication(
        bytes memory data
    ) external pure returns (bytes memory) {
        return performMultiplication(data);
    }

    function testComparison(
        bytes memory data
    ) external pure returns (bytes memory) {
        return performComparison(data);
    }
}

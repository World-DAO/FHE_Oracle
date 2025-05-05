// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";

contract FHEStorage is Ownable {
    mapping(string => bytes) private results;

    function storeResult(
        string memory requestID,
        bytes memory result
    ) internal {
        results[requestID] = result;
    }

    function getStoredResult(
        string memory requestId
    ) public view returns (bytes memory) {
        return results[requestId];
    }

    function resultExists(
        string memory requestId
    ) internal view returns (bool) {
        return results[requestId].length > 0;
    }
}

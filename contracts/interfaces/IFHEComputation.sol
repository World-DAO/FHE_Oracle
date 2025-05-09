// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "fhevm/lib/TFHE.sol";

interface IFHEComputation {
    event ComputationPerformed(string requestId, bytes encryptedResult);
    event ResultStored(string requestId);

    function performComputation(
        string memory requestId,
        einput inputHandleA,
        einput inputHandleB,
        bytes memory inputProof,
        uint8 operationType
    ) external;

    function getResult(
        string memory requestId
    ) external view returns (bytes memory);
}

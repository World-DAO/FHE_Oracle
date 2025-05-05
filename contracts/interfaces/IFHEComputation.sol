// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface IFHEComputation {
    event ComputationPerformed(string requestId, bytes encryptedResult);
    event ResultStored(string requestId);

    function performComputation(
        string memory requestId,
        bytes memory encryptedData,
        uint8 operationType
    ) external returns (bool);

    function getResult(
        string memory requestId
    ) external view returns (bytes memory);
}

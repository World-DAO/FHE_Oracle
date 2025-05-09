"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FHEOperationType = void 0;
// FHE操作类型
var FHEOperationType;
(function (FHEOperationType) {
    FHEOperationType[FHEOperationType["ADDITION"] = 1] = "ADDITION";
    FHEOperationType[FHEOperationType["MULTIPLICATION"] = 2] = "MULTIPLICATION";
    FHEOperationType[FHEOperationType["COMPARISON"] = 3] = "COMPARISON";
})(FHEOperationType || (exports.FHEOperationType = FHEOperationType = {}));

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const LoadingAnimation = ({ isLoading }) => {
    if (!isLoading) {
        return null;
    }
    return (react_1.default.createElement("div", { className: "loader animate-spin h-12 w-12 border-t-4 border-green-500 rounded-full absolute top-0 bottom-0 left-0 right-0 m-auto" }));
};
exports.default = LoadingAnimation;
//# sourceMappingURL=LoadingAnimation.js.map
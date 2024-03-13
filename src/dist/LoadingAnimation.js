"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_loader_spinner_1 = require("react-loader-spinner");
const LoadingAnimation = ({ isLoading }) => {
    if (!isLoading) {
        return null;
    }
    return (react_1.default.createElement("div", { style: {
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)'
        } },
        react_1.default.createElement(react_loader_spinner_1.Triangle, { visible: true, height: "80", width: "80", color: "#2EBD59", ariaLabel: "triangle-loading", wrapperStyle: {}, wrapperClass: "" })));
};
exports.default = LoadingAnimation;
//# sourceMappingURL=LoadingAnimation.js.map
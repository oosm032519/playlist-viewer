"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const MessageDisplay = ({ message, type }) => {
    const [isVisible, setIsVisible] = (0, react_1.useState)(true);
    const messageClass = type === 'success' ? 'bg-green-500 border-green-500' : 'bg-red-500 border-red-500';
    (0, react_1.useEffect)(() => {
        console.log('メッセージを表示します');
        setIsVisible(true);
        const timer = setTimeout(() => {
            setIsVisible(false);
        }, 3000);
        return () => clearTimeout(timer);
    }, [message]);
    return (react_1.default.createElement("div", { className: `message-display ${messageClass} text-lg font-bold border-2 p-2 fixed bottom-0 right-0 m-6 transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'} shadow-lg rounded-lg flex items-center justify-center text-2xl` }, message));
};
exports.default = MessageDisplay;
//# sourceMappingURL=MessageDisplay.js.map
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
const CombinedContext_1 = __importStar(require("./CombinedContext"));
const useWindowWidth_1 = require("./useWindowWidth");
const RadioButton = () => {
    const { selectedOption, setSelectedOption, isOpen } = (0, react_1.useContext)(CombinedContext_1.default);
    const windowWidth = (0, useWindowWidth_1.useWindowWidth)();
    const handleOptionChange = (event) => {
        setSelectedOption(event.target.value);
    };
    const options = [
        { id: 'playlistIdOption', value: CombinedContext_1.Option.PlaylistIdOption, label: 'プレイリストIDを入力' },
        { id: 'searchQueryOption', value: CombinedContext_1.Option.SearchOption, label: 'プレイリスト名で検索' },
    ];
    // Calculate the position of the radio buttons based on the isOpen state
    const positionStyle = isOpen ? { marginRight: (windowWidth / 4) } : {};
    return (react_1.default.createElement("div", { className: `radio-group flex justify-center my-5 transition-all duration-200 ease-in-out`, style: positionStyle }, options.map((option) => (react_1.default.createElement("div", { className: "mx-2", key: option.id },
        react_1.default.createElement("input", { type: "radio", id: option.id, value: option.value, name: "option", className: "hidden", onChange: handleOptionChange, checked: selectedOption === option.value, style: { position: 'absolute', opacity: 0 } }),
        react_1.default.createElement("label", { htmlFor: option.id, className: `inline-block p-2 px-5 m-2 border-2 border-green-500 rounded-md ${selectedOption === option.value ? 'bg-green-500 text-white' : 'bg-white text-green-500'} transition-all duration-300 ease-in-out cursor-pointer w-11/10 hover:bg-green-500 hover:text-white hover:shadow-lg hover:border-transparent hover:ring-4 hover:ring-green-300` }, option.label))))));
};
exports.default = RadioButton;
//# sourceMappingURL=RadioButton.js.map
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const FetchUserPlaylistsButton_1 = __importDefault(require("./FetchUserPlaylistsButton"));
const FetchVisitedPlaylistsButton_1 = __importDefault(require("./FetchVisitedPlaylistsButton"));
const MessageDisplay_1 = __importDefault(require("./MessageDisplay"));
const Button_1 = require("./Button");
const SideMenu = ({ authorize }) => {
    const [isOpen, setIsOpen] = (0, react_1.useState)(false);
    const [message] = (0, react_1.useState)("");
    const [messageType] = (0, react_1.useState)(null);
    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };
    const menuClass = isOpen ? '' : 'translate-x-full';
    const handleAuthorize = () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield authorize();
            console.log("認証が完了しました");
        }
        catch (error) {
            console.error('There was a problem with the fetch operation: ', error);
        }
    });
    return (react_1.default.createElement("div", null,
        react_1.default.createElement("button", { onClick: toggleMenu, className: "bg-green-500 text-white rounded-lg h-10 p-3 absolute top-5 right-5 flex items-center justify-center transition-transform duration-500 ease-in-out hover:bg-green-600 hover:text-gray-900" }, "\u30E1\u30CB\u30E5\u30FC\u3092\u958B\u304F"),
        react_1.default.createElement("div", { id: "side-menu", className: `fixed right-0 top-0 w-64 h-screen bg-gray-800 text-white p-5 shadow-md transform ${menuClass} transition-transform duration-300 ease-in-out rounded-l-lg border-l-4 border-green-500 z-50` },
            react_1.default.createElement(Button_1.Button, { onClick: toggleMenu }, "\u30E1\u30CB\u30E5\u30FC\u3092\u9589\u3058\u308B"),
            react_1.default.createElement(Button_1.Button, { onClick: handleAuthorize }, "Spotify\u306B\u30ED\u30B0\u30A4\u30F3"),
            react_1.default.createElement(FetchUserPlaylistsButton_1.default, null),
            react_1.default.createElement(FetchVisitedPlaylistsButton_1.default, null)),
        message && messageType && react_1.default.createElement(MessageDisplay_1.default, { message: message, type: messageType })));
};
exports.default = SideMenu;
//# sourceMappingURL=SideMenu.js.map
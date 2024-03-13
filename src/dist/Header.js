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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const CombinedContext_1 = __importDefault(require("./CombinedContext"));
const SideMenu_1 = __importDefault(require("./SideMenu"));
const useSpotifyAuth_1 = require("./useSpotifyAuth");
const Header = () => {
    const { isOpen, setIsOpen } = (0, react_1.useContext)(CombinedContext_1.default);
    const authorize = (0, useSpotifyAuth_1.useSpotifyAuth)();
    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };
    return (react_1.default.createElement("header", { className: "fixed top-0 w-full z-50 flex justify-between items-center bg-black text-white p-5 h-10 shadow-md" },
        react_1.default.createElement("h1", { className: "text-3xl font-light" }, "Playlist Viewer"),
        react_1.default.createElement("button", { onClick: toggleMenu, className: "z-50 space-y-2 ml-auto", style: { width: '50px', height: '50px' } },
            "                ",
            react_1.default.createElement("span", { className: isOpen
                    ? "block w-8 h-0.5 bg-white translate-y-3.5 rotate-45 duration-300"
                    : "block w-8 h-0.5 bg-white duration-300" }),
            react_1.default.createElement("span", { className: isOpen ? "block opacity-0 duration-300" : "block w-8 h-0.5 bg-white duration-300" }),
            react_1.default.createElement("span", { className: isOpen
                    ? "block w-8 h-0.5 bg-white -rotate-45 duration-300"
                    : "block w-8 h-0.5 bg-white duration-300" })),
        react_1.default.createElement(SideMenu_1.default, { authorize: authorize, isOpen: isOpen, toggleMenu: toggleMenu })));
};
exports.default = Header;
//# sourceMappingURL=Header.js.map
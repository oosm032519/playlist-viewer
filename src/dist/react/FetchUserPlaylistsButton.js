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
const CombinedContext_1 = __importDefault(require("./CombinedContext"));
const FetchUserPlaylistsButton = () => {
    const { setPlaylists, setIsLoading, setShowPlaylists, setMessage, setMessageType } = (0, react_1.useContext)(CombinedContext_1.default);
    const fetchUserPlaylists = (0, react_1.useCallback)(() => __awaiter(void 0, void 0, void 0, function* () {
        setIsLoading(true);
        try {
            console.log('fetchUserPlaylistsが呼び出されました');
            const response = yield fetch('/java/spotify/user/playlists');
            if (!response.ok) {
                const message = yield response.text();
                throw new Error(message);
            }
            const data = yield response.json();
            setPlaylists(data);
            setShowPlaylists(true);
        }
        catch (error) {
            console.error('There was a problem with the fetch operation: ', error);
            setMessage('プレイリストの取得に失敗しました。');
            setMessageType('error');
        }
        finally {
            setIsLoading(false);
        }
    }), []);
    return (react_1.default.createElement("button", { onClick: fetchUserPlaylists, className: "w-full bg-green-500 hover:bg-green-600 text-white hover:text-gray-900 rounded-lg h-10 p-3 mt-4 flex items-center justify-center transition-colors duration-300" }, "\u30D5\u30A9\u30ED\u30FC\u4E2D\u306E\u30D7\u30EC\u30A4\u30EA\u30B9\u30C8"));
};
exports.default = FetchUserPlaylistsButton;
//# sourceMappingURL=FetchUserPlaylistsButton.js.map
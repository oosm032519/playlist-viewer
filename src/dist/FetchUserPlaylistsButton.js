"use strict";
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
const react_1 = __importDefault(require("react"));
const react_2 = require("react");
const CombinedContext_1 = __importDefault(require("./CombinedContext"));
const useApi_1 = require("./useApi");
const Button_1 = require("./Button");
const FetchUserPlaylistsButton = () => {
    const { setPlaylists, setIsLoading, setShowPlaylists, setMessage, setMessageType } = (0, react_2.useContext)(CombinedContext_1.default);
    const { fetchUserPlaylists } = (0, useApi_1.useApi)();
    const handleClick = () => __awaiter(void 0, void 0, void 0, function* () {
        setIsLoading(true);
        try {
            const data = yield fetchUserPlaylists();
            setPlaylists(data);
            setShowPlaylists(true);
        }
        catch (error) {
            setMessage('プレイリストの取得に失敗しました。');
            setMessageType('error');
        }
        finally {
            setIsLoading(false);
        }
    });
    return (react_1.default.createElement(Button_1.Button, { onClick: handleClick }, "\u30D5\u30A9\u30ED\u30FC\u4E2D\u306E\u30D7\u30EC\u30A4\u30EA\u30B9\u30C8"));
};
exports.default = FetchUserPlaylistsButton;
//# sourceMappingURL=FetchUserPlaylistsButton.js.map
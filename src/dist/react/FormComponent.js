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
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const CombinedContext_1 = __importStar(require("./CombinedContext"));
const useApi_1 = require("./useApi");
const FormComponent = ({ setIsLoading }) => {
    const { selectedOption, setShowPlaylists, setShowTracks, setPlaylists } = (0, react_1.useContext)(CombinedContext_1.default);
    const { fetchPlaylistById, fetchPlaylistsByName } = (0, useApi_1.useApi)();
    const inputRef = (0, react_1.useRef)(null);
    (0, react_1.useEffect)(() => {
        if (inputRef.current) {
            inputRef.current.value = '';
        }
    }, [selectedOption]);
    const handleSubmit = (event) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        event.preventDefault();
        setIsLoading(true);
        const inputValue = (_a = inputRef.current) === null || _a === void 0 ? void 0 : _a.value;
        try {
            if (selectedOption === CombinedContext_1.Option.PlaylistIdOption) {
                console.log('fetchPlaylistByIdを呼び出します');
                yield fetchPlaylistById(inputValue);
                setShowTracks(true);
                setShowPlaylists(false);
            }
            else {
                console.log('fetchPlaylistsByNameを呼び出します');
                const playlists = yield fetchPlaylistsByName(inputValue);
                if (JSON.stringify(playlists) !== JSON.stringify(playlists)) {
                    setPlaylists(playlists);
                }
                setShowPlaylists(true);
                setShowTracks(false);
            }
        }
        catch (error) {
            console.error(error);
        }
        finally {
            setIsLoading(false);
        }
    });
    return (react_1.default.createElement("div", null,
        react_1.default.createElement("form", { className: "m-5 form-container flex items-center", onSubmit: handleSubmit },
            react_1.default.createElement("input", { ref: inputRef, type: "text", name: "inputField", placeholder: selectedOption === CombinedContext_1.Option.PlaylistIdOption ? "プレイリストIDを入力してください" : "プレイリスト名を入力してください", className: "border-2 border-gray-300 hover:border-green-500 transition-colors duration-300 rounded-lg h-10 w-11/12 p-3 mr-2" }),
            react_1.default.createElement("button", { type: "submit", className: "bg-green-500 text-white rounded-lg h-10 p-3 flex items-center justify-center transition transform ease-in-out duration-500 hover:bg-green-500 hover:text-white hover:shadow-lg hover:border-transparent hover:ring-4 hover:ring-green-300 z-10" }, selectedOption === CombinedContext_1.Option.PlaylistIdOption ? "送信" : "検索"))));
};
exports.default = FormComponent;
//# sourceMappingURL=FormComponent.js.map
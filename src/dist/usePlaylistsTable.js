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
exports.usePlaylistsTable = void 0;
const react_1 = require("react");
const CombinedContext_1 = __importDefault(require("./CombinedContext"));
const useApi_1 = require("./useApi");
const usePlaylistsTable = () => {
    const { playlists, setShowTracks, setShowPlaylists, setIsLoading, setShowRecommendations } = (0, react_1.useContext)(CombinedContext_1.default);
    const { fetchPlaylistById } = (0, useApi_1.useApi)();
    const [selectedPlaylistId, setSelectedPlaylistId] = (0, react_1.useState)(null);
    const [prevSelectedPlaylistId, setPrevSelectedPlaylistId] = (0, react_1.useState)(null);
    const fetchAndSetPlaylist = (0, react_1.useCallback)((id) => __awaiter(void 0, void 0, void 0, function* () {
        if (id) {
            console.log('fetchAndSetPlaylistが呼び出されました');
            setIsLoading(true);
            yield fetchPlaylistById(id);
            setShowPlaylists(false);
            setIsLoading(false);
            setShowTracks(true);
        }
    }), [fetchPlaylistById, setIsLoading, setShowTracks, setShowPlaylists, setShowRecommendations]);
    (0, react_1.useEffect)(() => {
        if (selectedPlaylistId !== prevSelectedPlaylistId) {
            console.log('selectedPlaylistIdが変更されました');
            fetchAndSetPlaylist(selectedPlaylistId);
            setPrevSelectedPlaylistId(selectedPlaylistId);
        }
    }, [selectedPlaylistId, prevSelectedPlaylistId, fetchAndSetPlaylist]);
    return { playlists, setSelectedPlaylistId };
};
exports.usePlaylistsTable = usePlaylistsTable;
//# sourceMappingURL=usePlaylistsTable.js.map
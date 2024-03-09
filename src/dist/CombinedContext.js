"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Option = void 0;
const react_1 = __importDefault(require("react"));
var Option;
(function (Option) {
    Option["PlaylistIdOption"] = "playlistIdOption";
    Option["SearchOption"] = "searchOption";
})(Option || (exports.Option = Option = {}));
const CombinedContext = react_1.default.createContext({
    selectedOption: Option.PlaylistIdOption,
    setSelectedOption: () => {
    },
    playlists: [],
    setPlaylists: () => {
    },
    selectedPlaylist: null,
    setSelectedPlaylist: () => {
    },
    visitedPlaylists: [],
    setVisitedPlaylists: () => {
    },
    isLoading: false,
    setIsLoading: () => {
    },
    showPlaylists: false,
    setShowPlaylists: () => {
    },
    showTracks: false,
    setShowTracks: () => {
    },
    showVisitedPlaylists: false,
    setShowVisitedPlaylists: () => {
    },
    showRecommendations: false,
    setShowRecommendations: () => {
    },
    setMessage: () => {
    },
    setMessageType: () => {
    },
});
exports.default = CombinedContext;
//# sourceMappingURL=CombinedContext.js.map
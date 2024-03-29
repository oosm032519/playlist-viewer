"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const RadioButton_1 = __importDefault(require("./RadioButton"));
const SideMenu_1 = __importDefault(require("./SideMenu"));
const FormComponent_1 = __importDefault(require("./FormComponent"));
const PlaylistsTable_1 = __importDefault(require("./PlaylistsTable"));
const LoadingAnimation_1 = __importDefault(require("./LoadingAnimation"));
const CombinedContext_1 = __importDefault(require("./CombinedContext"));
const TracksTable_1 = __importDefault(require("./TracksTable"));
const VisitedPlaylistsTable_1 = __importDefault(require("./VisitedPlaylistsTable"));
const RecommendationTable_1 = __importDefault(require("./RecommendationTable"));
const PlaylistIdContext_1 = __importDefault(require("./PlaylistIdContext"));
const MessageDisplay_1 = __importDefault(require("./MessageDisplay"));
const useSpotifyAuth_1 = require("./useSpotifyAuth");
const useApp_1 = require("./useApp");
const App = () => {
    const { selectedOption, setSelectedOption, playlists, setPlaylists, selectedPlaylist, setSelectedPlaylist, visitedPlaylists, setVisitedPlaylists, isLoading, setIsLoading, showPlaylists, setShowPlaylists, showTracks, setShowTracks, showVisitedPlaylists, setShowVisitedPlaylists, showRecommendations, setShowRecommendations, playlistId, setPlaylistId, message, setMessage, messageType, setMessageType, } = (0, useApp_1.useApp)();
    const authorize = (0, useSpotifyAuth_1.useSpotifyAuth)();
    return (react_1.default.createElement(CombinedContext_1.default.Provider, { value: {
            selectedOption,
            setSelectedOption,
            playlists,
            setPlaylists,
            selectedPlaylist,
            setSelectedPlaylist,
            visitedPlaylists,
            setVisitedPlaylists,
            isLoading,
            setIsLoading,
            showPlaylists,
            setShowPlaylists,
            showTracks,
            setShowTracks,
            showVisitedPlaylists,
            setShowVisitedPlaylists,
            showRecommendations,
            setShowRecommendations,
            setMessage,
            setMessageType,
        } },
        react_1.default.createElement(PlaylistIdContext_1.default.Provider, { value: { playlistId, setPlaylistId } },
            react_1.default.createElement("div", { className: "App" },
                react_1.default.createElement("h1", { className: "text-3xl font-light ml-5 text-center py-5" }, "Playlist Viewer"),
                react_1.default.createElement(SideMenu_1.default, { authorize: authorize }),
                react_1.default.createElement(RadioButton_1.default, null),
                react_1.default.createElement(FormComponent_1.default, { setIsLoading: setIsLoading, isLoading: isLoading }),
                react_1.default.createElement("div", { className: "my-4" }, showPlaylists && react_1.default.createElement(PlaylistsTable_1.default, null)),
                react_1.default.createElement("div", { className: "my-4" }, showTracks && react_1.default.createElement(TracksTable_1.default, { playlist: selectedPlaylist })),
                react_1.default.createElement("div", { className: "my-4" }, showRecommendations && react_1.default.createElement(RecommendationTable_1.default, { playlist: selectedPlaylist, setMessage: setMessage, setMessageType: setMessageType })),
                react_1.default.createElement("div", { className: "my-4" }, !isLoading && showVisitedPlaylists && react_1.default.createElement(VisitedPlaylistsTable_1.default, null)),
                react_1.default.createElement(LoadingAnimation_1.default, { isLoading: isLoading }),
                message && messageType && react_1.default.createElement(MessageDisplay_1.default, { message: message, type: messageType })))));
};
exports.default = App;
//# sourceMappingURL=App.js.map
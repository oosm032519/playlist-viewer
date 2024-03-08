var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import React, { useEffect, useState } from 'react';
import RadioButton from './RadioButton';
import SideMenu from './SideMenu';
import Form from './FormComponent';
import PlaylistsTable from './PlaylistsTable';
import LoadingAnimation from './LoadingAnimation';
import CombinedContext from './CombinedContext';
import TracksTable from './TracksTable';
import { Option } from './CombinedContext';
import VisitedPlaylistsTable from './VisitedPlaylistsTable';
import { useApi } from './useApi';
import RecommendationsTable from './RecommendationTable';
import PlaylistIdContext from './PlaylistIdContext';
import MessageDisplay from './MessageDisplay';
import { useSpotifyAuth } from './useSpotifyAuth';
const App = () => {
    const [selectedOption, setSelectedOption] = useState(Option.PlaylistIdOption);
    const [playlists, setPlaylists] = useState([]);
    const [selectedPlaylist, setSelectedPlaylist] = useState(null);
    const [visitedPlaylists, setVisitedPlaylists] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showPlaylists, setShowPlaylists] = useState(false);
    const [showTracks, setShowTracks] = useState(false);
    const [showVisitedPlaylists, setShowVisitedPlaylists] = useState(false);
    const [showRecommendations, setShowRecommendations] = useState(false);
    const { fetchVisitedPlaylists } = useApi();
    const [playlistId, setPlaylistId] = useState(null);
    const [message, setMessage] = useState(null);
    const [messageType, setMessageType] = useState(null);
    const authorize = useSpotifyAuth(setMessage, setMessageType);
    useEffect(() => {
        const fetchPlaylists = () => __awaiter(void 0, void 0, void 0, function* () {
            setIsLoading(true);
            try {
                const visitedPlaylists = yield fetchVisitedPlaylists();
                setVisitedPlaylists(visitedPlaylists);
            }
            catch (error) {
                console.error(error);
            }
            finally {
                setIsLoading(false);
            }
        });
        fetchPlaylists();
    }, []);
    useEffect(() => {
        if (showTracks) {
            setShowRecommendations(showTracks);
        }
    }, [showTracks]);
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const loginResult = urlParams.get('loginResult');
        if (loginResult === 'success') {
            setMessage("Spotifyへのログインが完了しました");
            setMessageType('success');
        }
    }, []);
    return (React.createElement(CombinedContext.Provider, { value: {
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
        } },
        React.createElement(PlaylistIdContext.Provider, { value: { playlistId, setPlaylistId } },
            React.createElement("div", { className: "App" },
                React.createElement("h1", { className: "text-3xl font-light ml-5 text-center py-5" }, "Playlist Viewer"),
                React.createElement(SideMenu, { authorize: authorize }),
                React.createElement(RadioButton, null),
                React.createElement(Form, { setIsLoading: setIsLoading, isLoading: isLoading }),
                React.createElement("div", { className: "my-4" }, showPlaylists && React.createElement(PlaylistsTable, null)),
                React.createElement("div", { className: "my-4" }, showTracks && React.createElement(TracksTable, { playlist: selectedPlaylist })),
                React.createElement("div", { className: "my-4" }, showRecommendations &&
                    React.createElement(RecommendationsTable, { playlist: selectedPlaylist, setMessage: setMessage, setMessageType: setMessageType })),
                React.createElement("div", { className: "my-4" }, !isLoading && showVisitedPlaylists && React.createElement(VisitedPlaylistsTable, null)),
                React.createElement(LoadingAnimation, { isLoading: isLoading }),
                message && messageType && React.createElement(MessageDisplay, { message: message, type: messageType }),
                "                "))));
};
export default App;
//# sourceMappingURL=App.js.map
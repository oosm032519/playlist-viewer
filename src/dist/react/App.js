import React from 'react';
import RadioButton from './RadioButton';
import SideMenu from './SideMenu';
import Form from './FormComponent';
import PlaylistsTable from './PlaylistsTable';
import LoadingAnimation from './LoadingAnimation';
import CombinedContext from './CombinedContext';
import TracksTable from './TracksTable';
import VisitedPlaylistsTable from './VisitedPlaylistsTable';
import RecommendationsTable from './RecommendationTable';
import PlaylistIdContext from './PlaylistIdContext';
import MessageDisplay from './MessageDisplay';
import { useSpotifyAuth } from './useSpotifyAuth';
import { useApp } from './useApp';
const App = () => {
    const { selectedOption, setSelectedOption, playlists, setPlaylists, selectedPlaylist, setSelectedPlaylist, visitedPlaylists, setVisitedPlaylists, isLoading, setIsLoading, showPlaylists, setShowPlaylists, showTracks, setShowTracks, showVisitedPlaylists, setShowVisitedPlaylists, showRecommendations, setShowRecommendations, playlistId, setPlaylistId, message, setMessage, messageType, setMessageType, } = useApp();
    const authorize = useSpotifyAuth();
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
                message && messageType && React.createElement(MessageDisplay, { message: message, type: messageType })))));
};
export default App;
//# sourceMappingURL=App.js.map
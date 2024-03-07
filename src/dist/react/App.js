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
        setShowRecommendations(showTracks);
    }, [showTracks]);
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
        React.createElement("div", { className: "App" },
            React.createElement("h1", { className: "text-3xl font-light ml-5 text-center py-5" }, "Playlist Viewer"),
            React.createElement(SideMenu, null),
            React.createElement(RadioButton, null),
            React.createElement(Form, { setIsLoading: setIsLoading, isLoading: isLoading }),
            React.createElement("div", { className: "my-4" }, showPlaylists && React.createElement(PlaylistsTable, null)),
            React.createElement("div", { className: "my-4" }, showTracks && React.createElement(TracksTable, { playlist: selectedPlaylist })),
            React.createElement("div", { className: "my-4" }, showRecommendations && React.createElement(RecommendationsTable, { playlist: selectedPlaylist })),
            React.createElement("div", { className: "my-4" }, !isLoading && showVisitedPlaylists && React.createElement(VisitedPlaylistsTable, null)),
            React.createElement(LoadingAnimation, { isLoading: isLoading }))));
};
export default App;
//# sourceMappingURL=App.js.map
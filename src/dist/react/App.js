import React, { useState } from 'react';
import RadioButton from './RadioButton';
import SideMenu from './SideMenu';
import Form from './FormComponent';
import PlaylistsTable from './PlaylistsTable';
import LoadingAnimation from './LoadingAnimation';
import CombinedContext from './CombinedContext';
import TracksTable from './TracksTable';
import { Option } from './CombinedContext';
const App = () => {
    const [selectedOption, setSelectedOption] = useState(Option.PlaylistIdOption);
    const [playlists, setPlaylists] = useState([]);
    const [selectedPlaylist, setSelectedPlaylist] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showPlaylists, setShowPlaylists] = useState(false);
    const [showTracks, setShowTracks] = useState(false);
    return (React.createElement(CombinedContext.Provider, { value: {
            selectedOption,
            setSelectedOption,
            playlists,
            setPlaylists,
            selectedPlaylist,
            setSelectedPlaylist,
            isLoading,
            setIsLoading,
            showPlaylists,
            setShowPlaylists,
            showTracks,
            setShowTracks
        } },
        React.createElement("div", { className: "App" },
            React.createElement("h1", { className: "text-3xl font-light ml-5 text-center py-5" }, "Playlist Viewer"),
            React.createElement(SideMenu, null),
            React.createElement(RadioButton, null),
            React.createElement(Form, { setIsLoading: setIsLoading, isLoading: isLoading }),
            showPlaylists && React.createElement(PlaylistsTable, null),
            showTracks && React.createElement(TracksTable, { playlist: selectedPlaylist }),
            React.createElement(LoadingAnimation, { isLoading: isLoading }))));
};
export default App;
//# sourceMappingURL=App.js.map
import React, { useState } from 'react';
import RadioButton from './RadioButton';
import SideMenu from './SideMenu';
import Form from './FormComponent';
import UserPlaylistTable from './UserPlaylistTable';
import LoadingAnimation from './LoadingAnimation';
import { SelectedOptionContext } from './SelectedOptionContext';
import PlaylistContext from './PlaylistContext';
import PlaylistTable from './PlaylistTable';
const App = () => {
    const [selectedOption, setSelectedOption] = useState(localStorage.getItem('selectedOption') || 'playlistIdOption');
    const [playlists, setPlaylists] = useState([]);
    const [isUserPlaylistTableVisible, setUserPlaylistTableVisible] = useState(false);
    const [isPlaylistTableVisible, setPlaylistTableVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    return (React.createElement(SelectedOptionContext.Provider, { value: { selectedOption, setSelectedOption } },
        React.createElement(PlaylistContext.Provider, { value: {
                playlists,
                setPlaylists,
                isUserPlaylistTableVisible,
                setUserPlaylistTableVisible,
                isPlaylistTableVisible,
                setPlaylistTableVisible,
                isLoading,
                setIsLoading
            } },
            React.createElement("div", { className: "App" },
                React.createElement("h1", { className: "text-3xl font-light ml-5 text-center py-5" }, "Playlist Viewer"),
                React.createElement(SideMenu, null),
                React.createElement(RadioButton, null),
                React.createElement(Form, { setIsLoading: setIsLoading, isLoading: isLoading }),
                isUserPlaylistTableVisible && React.createElement(UserPlaylistTable, null),
                isPlaylistTableVisible && React.createElement(PlaylistTable, { playlist: playlists[0] }),
                React.createElement(LoadingAnimation, { isLoading: isLoading })))));
};
export default App;
//# sourceMappingURL=App.js.map
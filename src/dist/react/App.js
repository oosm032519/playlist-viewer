import React, { useState } from 'react';
import RadioButton from './RadioButton';
import SideMenu from './SideMenu';
import Form from './FormComponent';
import UserPlaylistTable from './UserPlaylistTable';
import LoadingAnimation from './LoadingAnimation';
import { SelectedOptionContext } from './SelectedOptionContext';
import PlaylistContext from './PlaylistContext';
const App = () => {
    const [selectedOption, setSelectedOption] = useState(localStorage.getItem('selectedOption') || 'playlistIdOption');
    const [playlists, setPlaylists] = useState([]);
    const [isTableVisible, setTableVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    return (React.createElement(SelectedOptionContext.Provider, { value: { selectedOption, setSelectedOption } },
        React.createElement(PlaylistContext.Provider, { value: { playlists, setPlaylists, isTableVisible, setTableVisible, isLoading, setIsLoading } },
            React.createElement("div", { className: "App" },
                React.createElement("h1", { className: "text-3xl font-light ml-5 text-center py-5" }, "Playlist Viewer"),
                React.createElement(SideMenu, null),
                React.createElement(RadioButton, null),
                React.createElement(Form, { setIsLoading: setIsLoading, isLoading: isLoading }),
                isTableVisible && React.createElement(UserPlaylistTable, null),
                React.createElement(LoadingAnimation, { isLoading: isLoading })))));
};
export default App;
//# sourceMappingURL=App.js.map
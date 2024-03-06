import React, {useState} from 'react';
import RadioButton from './RadioButton'
import SideMenu from './SideMenu';
import Form from './FormComponent';
import UserPlaylistTable from './UserPlaylistTable';
import LoadingAnimation from './LoadingAnimation';
import {SelectedOptionContext} from './SelectedOptionContext';
import PlaylistContext from './PlaylistContext';

const App: React.FC = () => {
    const [selectedOption, setSelectedOption] = useState(localStorage.getItem('selectedOption') || 'playlistIdOption');
    const [playlists, setPlaylists] = useState([]);
    const [isTableVisible, setTableVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    
    return (
        <SelectedOptionContext.Provider value={{selectedOption, setSelectedOption}}>
            <PlaylistContext.Provider
                value={{playlists, setPlaylists, isTableVisible, setTableVisible, isLoading, setIsLoading}}>
                <div className="App">
                    <h1 className="text-3xl font-light ml-5 text-center py-5">Playlist Viewer</h1>
                    <SideMenu/>
                    <RadioButton/>
                    <Form setIsLoading={setIsLoading} isLoading={isLoading}/>
                    {isTableVisible && <UserPlaylistTable/>}
                    <LoadingAnimation isLoading={isLoading}/>
                </div>
            </PlaylistContext.Provider>
        </SelectedOptionContext.Provider>
    );
};

export default App;

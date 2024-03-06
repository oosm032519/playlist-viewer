import React, {useState} from 'react';
import RadioButton from './RadioButton'
import SideMenu from './SideMenu';
import Form from './FormComponent';
import PlaylistsTable from './PlaylistsTable';
import LoadingAnimation from './LoadingAnimation';
import CombinedContext from './CombinedContext';
import TracksTable from './TracksTable';
import {Option} from './CombinedContext';

const App: React.FC = () => {
    const [selectedOption, setSelectedOption] = useState(Option.PlaylistIdOption);
    const [playlists, setPlaylists] = useState([]);
    const [selectedPlaylist, setSelectedPlaylist] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showPlaylists, setShowPlaylists] = useState(false);
    const [showTracks, setShowTracks] = useState(false);
    
    return (
        <CombinedContext.Provider
            value={{
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
            }}>
            <div className="App">
                <h1 className="text-3xl font-light ml-5 text-center py-5">Playlist Viewer</h1>
                <SideMenu/>
                <RadioButton/>
                <Form setIsLoading={setIsLoading} isLoading={isLoading}/>
                {showPlaylists && <PlaylistsTable/>}
                {showTracks && <TracksTable playlist={selectedPlaylist}/>}
                <LoadingAnimation isLoading={isLoading}/>
            </div>
        </CombinedContext.Provider>
    );
};

export default App;

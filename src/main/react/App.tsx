import React, {useEffect, useState} from 'react';
import RadioButton from './RadioButton'
import SideMenu from './SideMenu';
import Form from './FormComponent';
import PlaylistsTable from './PlaylistsTable';
import LoadingAnimation from './LoadingAnimation';
import CombinedContext from './CombinedContext';
import TracksTable from './TracksTable';
import {Option} from './CombinedContext';
import VisitedPlaylistsTable from './VisitedPlaylistsTable';
import {useApi} from './useApi'

const App: React.FC = () => {
    const [selectedOption, setSelectedOption] = useState(Option.PlaylistIdOption);
    const [playlists, setPlaylists] = useState([]);
    const [selectedPlaylist, setSelectedPlaylist] = useState(null);
    const [visitedPlaylists, setVisitedPlaylists] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showPlaylists, setShowPlaylists] = useState(false);
    const [showTracks, setShowTracks] = useState(false);
    const [showVisitedPlaylists, setShowVisitedPlaylists] = useState(true);
    const {fetchVisitedPlaylists} = useApi();
    
    useEffect(() => {
        const fetchPlaylists = async () => {
            setIsLoading(true);
            try {
                const visitedPlaylists = await fetchVisitedPlaylists();
                setVisitedPlaylists(visitedPlaylists);
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };
        
        fetchPlaylists();
    }, []);
    
    return (
        <CombinedContext.Provider
            value={{
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
                setShowVisitedPlaylists
            }}>
            <div className="App">
                <h1 className="text-3xl font-light ml-5 text-center py-5">Playlist Viewer</h1>
                <SideMenu/>
                <RadioButton/>
                <Form setIsLoading={setIsLoading} isLoading={isLoading}/>
                {showPlaylists && <PlaylistsTable/>}
                {showTracks && <TracksTable playlist={selectedPlaylist}/>}
                {!isLoading && showVisitedPlaylists && <VisitedPlaylistsTable/>}
                <LoadingAnimation isLoading={isLoading}/>
            </div>
        </CombinedContext.Provider>
    );
};

export default App;

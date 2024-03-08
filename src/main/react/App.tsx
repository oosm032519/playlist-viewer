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
import RecommendationsTable from './RecommendationTable'
import PlaylistIdContext from './PlaylistIdContext';
import MessageDisplay from './MessageDisplay';
import {useSpotifyAuth} from './useSpotifyAuth';


const App: React.FC = () => {
    const [selectedOption, setSelectedOption] = useState(Option.PlaylistIdOption);
    const [playlists, setPlaylists] = useState([]);
    const [selectedPlaylist, setSelectedPlaylist] = useState(null);
    const [visitedPlaylists, setVisitedPlaylists] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showPlaylists, setShowPlaylists] = useState(false);
    const [showTracks, setShowTracks] = useState(false);
    const [showVisitedPlaylists, setShowVisitedPlaylists] = useState(false);
    const [showRecommendations, setShowRecommendations] = useState(false);
    const {fetchVisitedPlaylists} = useApi();
    const [playlistId, setPlaylistId] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [messageType, setMessageType] = useState<'success' | 'error' | null>(null);
    const authorize = useSpotifyAuth(setMessage, setMessageType);
    
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
                setShowVisitedPlaylists,
                showRecommendations,
                setShowRecommendations,
            }}>
            <PlaylistIdContext.Provider value={{playlistId, setPlaylistId}}>
            <div className="App">
                    <h1 className="text-3xl font-light ml-5 text-center py-5">Playlist Viewer</h1>
                <SideMenu authorize={authorize}/>
                <RadioButton/>
                    <Form setIsLoading={setIsLoading} isLoading={isLoading}/>
                    <div className="my-4">
                        {showPlaylists && <PlaylistsTable/>}
                    </div>
                    <div className="my-4">
                        {showTracks && <TracksTable playlist={selectedPlaylist}/>}
                    </div>
                    <div className="my-4">
                        {showRecommendations &&
                            <RecommendationsTable playlist={selectedPlaylist} setMessage={setMessage}
                                                  setMessageType={setMessageType}/>}
                    </div>
                    <div className="my-4">
                        {!isLoading && showVisitedPlaylists && <VisitedPlaylistsTable/>}
                    </div>
                    <LoadingAnimation isLoading={isLoading}/>
                    {message && messageType && <MessageDisplay message={message} type={messageType}/>}                </div>
            </PlaylistIdContext.Provider>
        </CombinedContext.Provider>
    );
};

export default App;

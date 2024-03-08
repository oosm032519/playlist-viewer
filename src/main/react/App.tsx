import React from 'react';
import RadioButton from './RadioButton'
import SideMenu from './SideMenu';
import Form from './FormComponent';
import PlaylistsTable from './PlaylistsTable';
import LoadingAnimation from './LoadingAnimation';
import CombinedContext from './CombinedContext';
import TracksTable from './TracksTable';
import VisitedPlaylistsTable from './VisitedPlaylistsTable';
import RecommendationsTable from './RecommendationTable'
import PlaylistIdContext from './PlaylistIdContext';
import MessageDisplay from './MessageDisplay';
import {useSpotifyAuth} from './useSpotifyAuth';
import {useApp} from './useApp';

const App: React.FC = () => {
    const {
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
        playlistId,
        setPlaylistId,
        message,
        setMessage,
        messageType,
        setMessageType,
    } = useApp();
    const authorize = useSpotifyAuth();
    
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
                    {message && messageType && <MessageDisplay message={message} type={messageType}/>}
                </div>
            </PlaylistIdContext.Provider>
        </CombinedContext.Provider>
    );
};

export default App;

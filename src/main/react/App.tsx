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
import Header from './Header';

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
    const [isOpen, setIsOpen] = React.useState(false);
    
    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };
    
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
                setMessage,
                setMessageType,
                isOpen,
                setIsOpen,
            }}>
            <PlaylistIdContext.Provider value={{playlistId, setPlaylistId}}>
                <div className="App pt-16">
                    <Header/>
                    <SideMenu authorize={authorize} isOpen={isOpen} toggleMenu={toggleMenu}/>
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
                        {showVisitedPlaylists && <VisitedPlaylistsTable/>}
                    </div>
                    <LoadingAnimation isLoading={isLoading}/>
                    {message && messageType && <MessageDisplay message={message} type={messageType}/>}
                </div>
            </PlaylistIdContext.Provider>
        </CombinedContext.Provider>
    );
}

export default App;

import {useState, useEffect} from 'react';
import {useApi} from './useApi';
import {Option} from './CombinedContext';

export const useApp = () => {
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
    
    return {
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
    };
};

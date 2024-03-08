import {useContext, useEffect, useState, useCallback} from 'react';
import CombinedContext from './CombinedContext';
import {useApi} from './useApi';

export const usePlaylistsTable = () => {
    const {playlists, setShowTracks, setShowPlaylists, setIsLoading, setShowRecommendations} = useContext(CombinedContext);
    const {fetchPlaylistById} = useApi();
    const [selectedPlaylistId, setSelectedPlaylistId] = useState(null);
    
    const fetchAndSetPlaylist = useCallback(async (id: string) => {
        if (id) {
            setIsLoading(true);
            await fetchPlaylistById(id);
            setShowPlaylists(false);
            setShowRecommendations(false);
            setIsLoading(false);
            setShowTracks(true);
        }
    }, [fetchPlaylistById, setIsLoading, setShowTracks, setShowPlaylists, setShowRecommendations]);
    useEffect(() => {
        fetchAndSetPlaylist(selectedPlaylistId);
    }, [selectedPlaylistId, fetchAndSetPlaylist]);
    
    return {playlists, setSelectedPlaylistId};
};

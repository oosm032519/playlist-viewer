import {useContext, useEffect, useState, useCallback} from 'react';
import CombinedContext from './CombinedContext';
import {useApi} from './useApi';

export const usePlaylistsTable = () => {
    const {playlists, setShowTracks, setShowPlaylists, setIsLoading, setShowRecommendations} = useContext(CombinedContext);
    const {fetchPlaylistById} = useApi();
    const [selectedPlaylistId, setSelectedPlaylistId] = useState(null);
    const [prevSelectedPlaylistId, setPrevSelectedPlaylistId] = useState(null);
    
    const fetchAndSetPlaylist = useCallback(async (id: string) => {
        if (id) {
            console.log('fetchAndSetPlaylistが呼び出されました');
            setIsLoading(true);
            await fetchPlaylistById(id);
            setShowPlaylists(false);
            setIsLoading(false);
            setShowTracks(true);
        }
    }, [fetchPlaylistById, setIsLoading, setShowTracks, setShowPlaylists, setShowRecommendations]);
    
    useEffect(() => {
        if (selectedPlaylistId !== prevSelectedPlaylistId) {
            console.log('selectedPlaylistIdが変更されました');
            fetchAndSetPlaylist(selectedPlaylistId);
            setPrevSelectedPlaylistId(selectedPlaylistId);
        }
    }, [selectedPlaylistId, prevSelectedPlaylistId, fetchAndSetPlaylist]);
    
    return {playlists, setSelectedPlaylistId};
};

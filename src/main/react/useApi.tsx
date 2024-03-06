import {useContext} from 'react';
import CombinedContext from './CombinedContext';

export function useApi() {
    const {
        setPlaylists,
        setSelectedPlaylist,
    } = useContext(CombinedContext);
    
    const fetchPlaylistById = async (playlistId: string) => {
        console.log('fetchPlaylistByIdが呼び出されました');
        const response = await fetch(`/java/playlist/${playlistId}`);
        const playlist = await response.json();
        console.log(playlist);
        setSelectedPlaylist(playlist);
    };
    
    const fetchPlaylistsByName = async (searchQuery: string) => {
        console.log('fetchPlaylistsByNameが呼び出されました');
        const response = await fetch(`/java/search/${searchQuery}`);
        const playlists = await response.json();
        console.log(playlists);
        setPlaylists(playlists);
        return playlists;
    };
    
    const fetchVisitedPlaylists = async () => {
        const response = await fetch('/java/user/visited-playlists');
        const playlists = await response.json();
        console.log(playlists);
        setPlaylists(playlists);
        return playlists;
    };
    
    return {fetchPlaylistById, fetchPlaylistsByName, fetchVisitedPlaylists};
}

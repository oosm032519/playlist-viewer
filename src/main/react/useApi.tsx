import {useContext} from 'react';
import CombinedContext from './CombinedContext';

export function useApi() {
    const {
        setPlaylists,
        setSelectedPlaylist,
    } = useContext(CombinedContext);
    
    const fetchPlaylistById = async (playlistId: string) => {
        const response = await fetch(`/java/playlist/${playlistId}`);
        const playlist = await response.json();
        console.log(playlist);
        setSelectedPlaylist(playlist);
    };
    
    const fetchPlaylistsByName = async (searchQuery: string) => {
        const response = await fetch(`/java/search/${searchQuery}`);
        const playlists = await response.json();
        console.log(playlists);
        setPlaylists(playlists);
    };
    
    return {fetchPlaylistById, fetchPlaylistsByName};
}

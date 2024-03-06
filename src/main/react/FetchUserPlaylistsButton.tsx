import React, {useContext, useCallback} from 'react';
import PlaylistContext from './PlaylistContext';

const FetchUserPlaylistsButton = () => {
    const {setPlaylists, setUserPlaylistTableVisible, setIsLoading} = useContext(PlaylistContext);
    const fetchUserPlaylists = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/java/spotify/user/playlists');
            if (!response.ok) {
                const message = await response.text();
                throw new Error(message);
            }
            const data = await response.json();
            setPlaylists(data);
            setUserPlaylistTableVisible(true);
        } catch (error) {
            console.error('There was a problem with the fetch operation: ', error);
        } finally {
            setIsLoading(false);
        }
    }, [setPlaylists, setUserPlaylistTableVisible, setIsLoading]);
    
    return (
        <button onClick={fetchUserPlaylists}
                className="w-full bg-green-500 hover:bg-green-600 text-white hover:text-gray-900 rounded-lg h-10 p-3 mt-4 flex items-center justify-center transition-colors duration-300">
            フォロー中のプレイリスト
        </button>
    );
};

export default FetchUserPlaylistsButton;

import React, {useContext} from 'react';
import CombinedContext from './CombinedContext';
import {useApi} from './useApi';

const FetchVisitedPlaylistsButton: React.FC = () => {
    const {setIsLoading, setShowPlaylists, setShowTracks} = useContext(CombinedContext);
    const {fetchVisitedPlaylists} = useApi();
    
    const handleClick = async () => {
        setIsLoading(true);
        try {
            await fetchVisitedPlaylists();
        } catch (error) {
            console.error(error);
        } finally {
            setShowPlaylists(true);
            setShowTracks(false);
            setIsLoading(false);
        }
    };
    
    return (
        <button onClick={handleClick}
                className="w-full bg-green-500 hover:bg-green-600 text-white hover:text-gray-900 rounded-lg h-10 p-3 mt-4 flex items-center justify-center transition-colors duration-300">
            参照履歴を表示
        </button>
    );
};

export default FetchVisitedPlaylistsButton;

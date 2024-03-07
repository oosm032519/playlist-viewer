import React, {useContext} from 'react';
import CombinedContext from './CombinedContext';

const FetchVisitedPlaylistsButton: React.FC = () => {
    const {
        setShowVisitedPlaylists,
        showVisitedPlaylists
    } = useContext(CombinedContext);
    
    const handleClick = () => {
        setShowVisitedPlaylists(!showVisitedPlaylists);
    };
    
    return (
        <button onClick={handleClick}
                className="w-full bg-green-500 hover:bg-green-600 text-white hover:text-gray-900 rounded-lg h-10 p-3 mt-4 flex items-center justify-center transition-colors duration-300">
            参照履歴を表示
        </button>
    );
};

export default FetchVisitedPlaylistsButton;

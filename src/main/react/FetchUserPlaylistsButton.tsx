import React from 'react';
import {useContext} from 'react';
import CombinedContext from './CombinedContext';
import {useApi} from './useApi';
import {Button} from './Button';

const FetchUserPlaylistsButton = () => {
    const {setPlaylists, setIsLoading, setShowPlaylists, setMessage, setMessageType} = useContext(CombinedContext);
    const {fetchUserPlaylists} = useApi();
    
    const handleClick = async () => {
        setIsLoading(true);
        try {
            const data = await fetchUserPlaylists();
            setPlaylists(data);
            setShowPlaylists(true);
        } catch (error) {
            setMessage('プレイリストの取得に失敗しました。');
            setMessageType('error');
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <Button onClick={handleClick}
                className="w-full bg-green-500 hover:bg-green-600 text-white hover:text-gray-900 rounded-lg h-10 p-3 mt-4 flex items-center justify-center transition-colors duration-300">
            フォロー中のプレイリスト
        </Button>
    );
};

export default FetchUserPlaylistsButton;

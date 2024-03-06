import React, {useState} from 'react';
import {useSpotifyAuth} from './useSpotifyAuth';
import FetchUserPlaylistsButton from './FetchUserPlaylistsButton';

const SideMenu = () => {
    const [isOpen, setIsOpen] = useState(false);
    const authorize = useSpotifyAuth();
    
    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };
    
    const menuClass = isOpen ? '' : 'translate-x-full';
    
    return (
        <div>
            <button onClick={toggleMenu}
                    className="bg-green-500 text-white rounded-lg h-10 p-3 absolute top-5 right-5 flex items-center justify-center transition-transform duration-500 ease-in-out hover:bg-green-600 hover:text-gray-900">
                メニューを開く
            </button>
            
            <div id="side-menu"
                 className={`fixed right-0 top-0 w-64 h-screen bg-gray-800 text-white p-5 shadow-md transform ${menuClass} transition-transform duration-300 ease-in-out rounded-l-lg border-l-4 border-green-500`}>
                <button onClick={toggleMenu}
                        className="w-full bg-green-500 hover:bg-green-600 text-white hover:text-gray-900 rounded-lg h-10 p-3 flex items-center justify-center transition-colors duration-300">
                    メニューを閉じる
                </button>
                <button id="spotify-login"
                        onClick={authorize}
                        className="w-full bg-green-500 hover:bg-green-600 text-white hover:text-gray-900 rounded-lg h-10 p-3 mt-4 flex items-center justify-center transition-colors duration-300">
                    Spotifyにログイン
                </button>
                <FetchUserPlaylistsButton/>
                <button id="visited-playlists"
                        className="w-full bg-green-500 hover:bg-green-600 text-white hover:text-gray-900 rounded-lg h-10 p-3 mt-4 flex items-center justify-center transition-colors duration-300">
                    参照履歴を表示
                </button>
            </div>
        </div>
    );
};

export default SideMenu;

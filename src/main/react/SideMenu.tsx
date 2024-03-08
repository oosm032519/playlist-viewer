import React, {useState} from 'react';
import FetchUserPlaylistsButton from './FetchUserPlaylistsButton';
import FetchVisitedPlaylistsButton from './FetchVisitedPlaylistsButton';
import MessageDisplay from './MessageDisplay';

type SideMenuProps = {
    authorize: () => Promise<void>;
};

const SideMenu: React.FC<SideMenuProps> = ({authorize}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState<'success' | 'error' | null>(null);
    
    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };
    
    const menuClass = isOpen ? '' : 'translate-x-full';
    
    const handleAuthorize = async () => {
        try {
            await authorize();
            setMessage("Spotifyへのログインが完了しました");
            setMessageType('success');
        } catch (error) {
            setMessage("Spotifyへのログインに失敗しました");
            setMessageType('error');
        }
    };
    
    return (
        <div>
            <button onClick={toggleMenu}
                    className="bg-green-500 text-white rounded-lg h-10 p-3 absolute top-5 right-5 flex items-center justify-center transition-transform duration-500 ease-in-out hover:bg-green-600 hover:text-gray-900">
                メニューを開く
            </button>
            
            <div id="side-menu"
                 className={`fixed right-0 top-0 w-64 h-screen bg-gray-800 text-white p-5 shadow-md transform ${menuClass} transition-transform duration-300 ease-in-out rounded-l-lg border-l-4 border-green-500 z-50`}>
                <button onClick={toggleMenu}
                        className="w-full bg-green-500 hover:bg-green-600 text-white hover:text-gray-900 rounded-lg h-10 p-3 flex items-center justify-center transition-colors duration-300">
                    メニューを閉じる
                </button>
                <button id="spotify-login"
                        onClick={handleAuthorize}
                        className="w-full bg-green-500 hover:bg-green-600 text-white hover:text-gray-900 rounded-lg h-10 p-3 mt-4 flex items-center justify-center transition-colors duration-300">
                    Spotifyにログイン
                </button>
                <FetchUserPlaylistsButton/>
                <FetchVisitedPlaylistsButton/>
            </div>
            {message && messageType && <MessageDisplay message={message} type={messageType}/>}
        </div>
    );
};

export default SideMenu;

import React, {useState} from 'react';
import FetchUserPlaylistsButton from './FetchUserPlaylistsButton';
import FetchVisitedPlaylistsButton from './FetchVisitedPlaylistsButton';
import MessageDisplay from './MessageDisplay';
import {Button} from './Button';

type SideMenuProps = {
    authorize: () => Promise<void>;
    isOpen: boolean;
    toggleMenu: () => void;
};

const SideMenu: React.FC<SideMenuProps> = ({authorize, isOpen, toggleMenu}) => {
    const [message] = useState("");
    const [messageType] = useState<'success' | 'error' | null>(null);
    
    const menuClass = isOpen ? '' : 'translate-x-full';
    
    const handleAuthorize = async () => {
        try {
            await authorize();
            console.log("認証が完了しました");
        } catch (error) {
            console.error('There was a problem with the fetch operation: ', error);
        }
    };
    
    return (
        <div>
            <div id="side-menu" className={`fixed top-16 right-0 w-1/4 h-screen bg-black text-white p-5 shadow-md transform ${menuClass} transition-transform duration-300 ease-in-out z-50`}>
                <Button onClick={toggleMenu}>メニューを閉じる</Button>
                <Button onClick={handleAuthorize}>Spotifyにログイン</Button>
                <FetchUserPlaylistsButton/>
                <FetchVisitedPlaylistsButton/>
            </div>
            {message && messageType && <MessageDisplay message={message} type={messageType}/>}
        </div>
    );
};

export default SideMenu;

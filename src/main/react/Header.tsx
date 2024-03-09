import React, {useContext} from 'react';
import CombinedContext from './CombinedContext';
import SideMenu from './SideMenu';
import {useSpotifyAuth} from './useSpotifyAuth';

const Header: React.FC = () => {
    const {isOpen, setIsOpen} = useContext(CombinedContext);
    const authorize = useSpotifyAuth();
    
    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };
    
    return (
        <header className="fixed top-0 w-full z-50 flex justify-between items-center bg-black text-white p-5 h-10 shadow-md">
            <h1 className="text-3xl font-light">Playlist Viewer</h1>
            <button onClick={toggleMenu} className="z-50 space-y-2 ml-auto" style={{width: '50px', height: '50px'}}>                <span
                className={
                    isOpen
                            ? "block w-8 h-0.5 bg-white translate-y-3.5 rotate-45 duration-300"
                            : "block w-8 h-0.5 bg-white duration-300"
                    }
                />
                <span
                    className={
                        isOpen ? "block opacity-0 duration-300" : "block w-8 h-0.5 bg-white duration-300"
                    }
                />
                <span
                    className={
                        isOpen
                            ? "block w-8 h-0.5 bg-white -rotate-45 duration-300"
                            : "block w-8 h-0.5 bg-white duration-300"
                    }
                />
            </button>
            <SideMenu authorize={authorize} isOpen={isOpen} toggleMenu={toggleMenu}/>
        </header>
    );
};

export default Header;

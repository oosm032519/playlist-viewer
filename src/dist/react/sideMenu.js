import React, { useState } from 'react';
import { useSpotifyAuth } from './useSpotifyAuth';
import FetchUserPlaylistsButton from './FetchUserPlaylistsButton';
import FetchVisitedPlaylistsButton from './FetchVisitedPlaylistsButton';
const SideMenu = () => {
    const [isOpen, setIsOpen] = useState(false);
    const authorize = useSpotifyAuth();
    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };
    const menuClass = isOpen ? '' : 'translate-x-full';
    return (React.createElement("div", null,
        React.createElement("button", { onClick: toggleMenu, className: "bg-green-500 text-white rounded-lg h-10 p-3 absolute top-5 right-5 flex items-center justify-center transition-transform duration-500 ease-in-out hover:bg-green-600 hover:text-gray-900" }, "\u30E1\u30CB\u30E5\u30FC\u3092\u958B\u304F"),
        React.createElement("div", { id: "side-menu", className: `fixed right-0 top-0 w-64 h-screen bg-gray-800 text-white p-5 shadow-md transform ${menuClass} transition-transform duration-300 ease-in-out rounded-l-lg border-l-4 border-green-500 z-50` },
            "            ",
            React.createElement("button", { onClick: toggleMenu, className: "w-full bg-green-500 hover:bg-green-600 text-white hover:text-gray-900 rounded-lg h-10 p-3 flex items-center justify-center transition-colors duration-300" }, "\u30E1\u30CB\u30E5\u30FC\u3092\u9589\u3058\u308B"),
            React.createElement("button", { id: "spotify-login", onClick: authorize, className: "w-full bg-green-500 hover:bg-green-600 text-white hover:text-gray-900 rounded-lg h-10 p-3 mt-4 flex items-center justify-center transition-colors duration-300" }, "Spotify\u306B\u30ED\u30B0\u30A4\u30F3"),
            React.createElement(FetchUserPlaylistsButton, null),
            React.createElement(FetchVisitedPlaylistsButton, null))));
};
export default SideMenu;
//# sourceMappingURL=SideMenu.js.map
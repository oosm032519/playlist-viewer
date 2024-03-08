var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import React, { useState } from 'react';
import FetchUserPlaylistsButton from './FetchUserPlaylistsButton';
import FetchVisitedPlaylistsButton from './FetchVisitedPlaylistsButton';
import MessageDisplay from './MessageDisplay';
const SideMenu = ({ authorize }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState(null);
    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };
    const menuClass = isOpen ? '' : 'translate-x-full';
    const handleAuthorize = () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield authorize();
            console.log("認証が完了しました");
        }
        catch (error) {
            console.error('There was a problem with the fetch operation: ', error);
        }
    });
    return (React.createElement("div", null,
        React.createElement("button", { onClick: toggleMenu, className: "bg-green-500 text-white rounded-lg h-10 p-3 absolute top-5 right-5 flex items-center justify-center transition-transform duration-500 ease-in-out hover:bg-green-600 hover:text-gray-900" }, "\u30E1\u30CB\u30E5\u30FC\u3092\u958B\u304F"),
        React.createElement("div", { id: "side-menu", className: `fixed right-0 top-0 w-64 h-screen bg-gray-800 text-white p-5 shadow-md transform ${menuClass} transition-transform duration-300 ease-in-out rounded-l-lg border-l-4 border-green-500 z-50` },
            React.createElement("button", { onClick: toggleMenu, className: "w-full bg-green-500 hover:bg-green-600 text-white hover:text-gray-900 rounded-lg h-10 p-3 flex items-center justify-center transition-colors duration-300" }, "\u30E1\u30CB\u30E5\u30FC\u3092\u9589\u3058\u308B"),
            React.createElement("button", { id: "spotify-login", onClick: handleAuthorize, className: "w-full bg-green-500 hover:bg-green-600 text-white hover:text-gray-900 rounded-lg h-10 p-3 mt-4 flex items-center justify-center transition-colors duration-300" }, "Spotify\u306B\u30ED\u30B0\u30A4\u30F3"),
            React.createElement(FetchUserPlaylistsButton, null),
            React.createElement(FetchVisitedPlaylistsButton, null)),
        message && messageType && React.createElement(MessageDisplay, { message: message, type: messageType })));
};
export default SideMenu;
//# sourceMappingURL=SideMenu.js.map
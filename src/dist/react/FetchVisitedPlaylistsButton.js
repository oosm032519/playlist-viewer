import React, { useContext } from 'react';
import CombinedContext from './CombinedContext';
const FetchVisitedPlaylistsButton = () => {
    const { setShowVisitedPlaylists, showVisitedPlaylists } = useContext(CombinedContext);
    const handleClick = () => {
        console.log('handleClickが呼び出されました');
        setShowVisitedPlaylists(!showVisitedPlaylists);
    };
    return (React.createElement("button", { onClick: handleClick, className: "w-full bg-green-500 hover:bg-green-600 text-white hover:text-gray-900 rounded-lg h-10 p-3 mt-4 flex items-center justify-center transition-colors duration-300" }, "\u53C2\u7167\u5C65\u6B74\u3092\u8868\u793A"));
};
export default FetchVisitedPlaylistsButton;
//# sourceMappingURL=FetchVisitedPlaylistsButton.js.map
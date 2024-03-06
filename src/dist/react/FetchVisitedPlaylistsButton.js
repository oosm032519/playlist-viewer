var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import React, { useContext } from 'react';
import CombinedContext from './CombinedContext';
import { useApi } from './useApi';
const FetchVisitedPlaylistsButton = () => {
    const { setIsLoading, setShowPlaylists, setShowTracks } = useContext(CombinedContext);
    const { fetchVisitedPlaylists } = useApi();
    const handleClick = () => __awaiter(void 0, void 0, void 0, function* () {
        setIsLoading(true);
        try {
            yield fetchVisitedPlaylists();
        }
        catch (error) {
            console.error(error);
        }
        finally {
            setShowPlaylists(true);
            setShowTracks(false);
            setIsLoading(false);
        }
    });
    return (React.createElement("button", { onClick: handleClick, className: "w-full bg-green-500 hover:bg-green-600 text-white hover:text-gray-900 rounded-lg h-10 p-3 mt-4 flex items-center justify-center transition-colors duration-300" }, "\u53C2\u7167\u5C65\u6B74\u3092\u8868\u793A"));
};
export default FetchVisitedPlaylistsButton;
//# sourceMappingURL=FetchVisitedPlaylistsButton.js.map
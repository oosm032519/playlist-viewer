var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import React, { useContext, useCallback } from 'react';
import PlaylistContext from './PlaylistContext';
const FetchUserPlaylistsButton = () => {
    const { setPlaylists, setTableVisible, setIsLoading } = useContext(PlaylistContext);
    const fetchUserPlaylists = useCallback(() => __awaiter(void 0, void 0, void 0, function* () {
        setIsLoading(true);
        try {
            const response = yield fetch('/java/spotify/user/playlists');
            if (!response.ok) {
                const message = yield response.text();
                throw new Error(message);
            }
            const data = yield response.json();
            setPlaylists(data);
            setTableVisible(true);
        }
        catch (error) {
            console.error('There was a problem with the fetch operation: ', error);
        }
        finally {
            setIsLoading(false);
        }
    }), [setPlaylists, setTableVisible, setIsLoading]);
    return (React.createElement("button", { onClick: fetchUserPlaylists, className: "w-full bg-green-500 hover:bg-green-600 text-white hover:text-gray-900 rounded-lg h-10 p-3 mt-4 flex items-center justify-center transition-colors duration-300" }, "\u30D5\u30A9\u30ED\u30FC\u4E2D\u306E\u30D7\u30EC\u30A4\u30EA\u30B9\u30C8"));
};
export default FetchUserPlaylistsButton;
//# sourceMappingURL=FetchUserPlaylistsButton.js.map
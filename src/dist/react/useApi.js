var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { useContext } from 'react';
import CombinedContext from './CombinedContext';
export function useApi() {
    const { setPlaylists, setSelectedPlaylist, } = useContext(CombinedContext);
    const fetchPlaylistById = (playlistId) => __awaiter(this, void 0, void 0, function* () {
        console.log('fetchPlaylistByIdが呼び出されました');
        const response = yield fetch(`/java/playlist/${playlistId}`);
        const playlist = yield response.json();
        console.log(playlist);
        setSelectedPlaylist(playlist);
    });
    const fetchPlaylistsByName = (searchQuery) => __awaiter(this, void 0, void 0, function* () {
        console.log('fetchPlaylistsByNameが呼び出されました');
        const response = yield fetch(`/java/search/${searchQuery}`);
        const playlists = yield response.json();
        console.log(playlists);
        setPlaylists(playlists);
        return playlists;
    });
    const fetchVisitedPlaylists = () => __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch('/java/user/visited-playlists');
        const playlists = yield response.json();
        console.log(playlists);
        setPlaylists(playlists);
        return playlists;
    });
    return { fetchPlaylistById, fetchPlaylistsByName, fetchVisitedPlaylists };
}
//# sourceMappingURL=useApi.js.map
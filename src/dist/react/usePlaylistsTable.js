var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { useContext, useEffect, useState, useCallback } from 'react';
import CombinedContext from './CombinedContext';
import { useApi } from './useApi';
export const usePlaylistsTable = () => {
    const { playlists, setShowTracks, setShowPlaylists, setIsLoading, setShowRecommendations } = useContext(CombinedContext);
    const { fetchPlaylistById } = useApi();
    const [selectedPlaylistId, setSelectedPlaylistId] = useState(null);
    const fetchAndSetPlaylist = useCallback((id) => __awaiter(void 0, void 0, void 0, function* () {
        if (id) {
            setIsLoading(true);
            yield fetchPlaylistById(id);
            setShowPlaylists(false);
            setShowRecommendations(false);
            setIsLoading(false);
            setShowTracks(true);
        }
    }), [fetchPlaylistById, setIsLoading, setShowTracks, setShowPlaylists, setShowRecommendations]);
    useEffect(() => {
        fetchAndSetPlaylist(selectedPlaylistId);
    }, [selectedPlaylistId, fetchAndSetPlaylist]);
    return { playlists, setSelectedPlaylistId };
};
//# sourceMappingURL=usePlaylistsTable.js.map
import { useState } from 'react';
export const usePlaylistState = () => {
    const [playlists, setPlaylists] = useState([]);
    const [selectedPlaylist, setSelectedPlaylist] = useState(null);
    const [visitedPlaylists, setVisitedPlaylists] = useState([]);
    return { playlists, setPlaylists, selectedPlaylist, setSelectedPlaylist, visitedPlaylists, setVisitedPlaylists };
};
//# sourceMappingURL=usePlaylistState.js.map
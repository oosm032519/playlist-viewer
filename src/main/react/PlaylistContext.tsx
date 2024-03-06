import React from 'react';

type PlaylistContextType = {
    playlists: any[];
    setPlaylists: (playlists: any[]) => void;
    isUserPlaylistTableVisible: boolean;
    setUserPlaylistTableVisible: (visible: boolean) => void;
    isPlaylistTableVisible: boolean;
    setPlaylistTableVisible: (visible: boolean) => void;
    isLoading: boolean;
    setIsLoading: (loading: boolean) => void;
};

const PlaylistContext = React.createContext<PlaylistContextType>({
    playlists: [],
    setPlaylists: () => {
    },
    isUserPlaylistTableVisible: false,
    setUserPlaylistTableVisible: () => {
    },
    isPlaylistTableVisible: false,
    setPlaylistTableVisible: () => {
    },
    isLoading: false,
    setIsLoading: () => {
    },
});

export default PlaylistContext;

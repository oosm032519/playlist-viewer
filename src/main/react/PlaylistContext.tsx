import React from 'react';

type PlaylistContextType = {
    playlists: any[];
    setPlaylists: (playlists: any[]) => void;
    isTableVisible: boolean;
    setTableVisible: (visible: boolean) => void;
    isLoading: boolean;
    setIsLoading: (loading: boolean) => void;
};

const PlaylistContext = React.createContext<PlaylistContextType>({
    playlists: [],
    setPlaylists: () => {
    },
    isTableVisible: false,
    setTableVisible: () => {
    },
    isLoading: false,
    setIsLoading: () => {
    },
});

export default PlaylistContext;

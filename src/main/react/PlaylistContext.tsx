import React from 'react';

type PlaylistContextType = {
    playlists: any[];
    setPlaylists: (playlists: any[]) => void;
    isTableVisible: boolean;
    setTableVisible: (visible: boolean) => void;
};

const PlaylistContext = React.createContext<PlaylistContextType>({
    playlists: [],
    setPlaylists: () => {
    },
    isTableVisible: false,
    setTableVisible: () => {
    },
});

export default PlaylistContext;

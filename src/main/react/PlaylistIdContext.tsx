import React from 'react';

const PlaylistIdContext = React.createContext<{ playlistId: string | null, setPlaylistId: (id: string | null) => void }>({ playlistId: null, setPlaylistId: () => {} });

export default PlaylistIdContext;

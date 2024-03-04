import React, { useEffect, useRef } from 'react';
import { PlaylistManager } from '../../typescript/playlistManager';
import { PageInitializer } from '../../typescript/pageInitializer';
import { ToggleVisitedPlaylists } from '../../typescript/toggleVisitedPlaylists';
import { SpotifyAuthorizer } from '../../typescript/spotifyAuthorizer';
import { TableManager } from '../../typescript/TableManager';
const Main = () => {
    const toggleVisitedPlaylists = useRef(new ToggleVisitedPlaylists());
    const spotifyAuthorizer = useRef(new SpotifyAuthorizer());
    const playlistManager = useRef(new PlaylistManager());
    const tableManager = useRef(new TableManager());
    useEffect(() => {
        new PageInitializer();
        window.addEventListener('resize', tableManager.current.checkTableWidth);
        tableManager.current.checkTableWidth();
    }, []);
    const handleVisitedPlaylistsClick = () => {
        toggleVisitedPlaylists.current.toggle();
    };
    const handleSpotifyLoginClick = () => {
        spotifyAuthorizer.current.authorize();
    };
    const handleShowPlaylistsClick = () => {
        playlistManager.current.fetchUserPlaylists();
    };
    return (React.createElement("div", null,
        React.createElement("button", { id: "visited-playlists", onClick: handleVisitedPlaylistsClick }, "Toggle Visited Playlists"),
        React.createElement("button", { id: "spotify-login", onClick: handleSpotifyLoginClick }, "Spotify Login"),
        React.createElement("button", { id: "show-playlists", onClick: handleShowPlaylistsClick }, "Show Playlists")));
};
export default Main;
//# sourceMappingURL=main.js.map
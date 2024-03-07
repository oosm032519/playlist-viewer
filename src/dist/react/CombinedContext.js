import React from 'react';
export var Option;
(function (Option) {
    Option["PlaylistIdOption"] = "playlistIdOption";
    Option["SearchOption"] = "searchOption";
})(Option || (Option = {}));
const CombinedContext = React.createContext({
    selectedOption: Option.PlaylistIdOption,
    setSelectedOption: () => {
    },
    playlists: [],
    setPlaylists: () => {
    },
    selectedPlaylist: null,
    setSelectedPlaylist: () => {
    },
    visitedPlaylists: [],
    setVisitedPlaylists: () => {
    },
    isLoading: false,
    setIsLoading: () => {
    },
    showPlaylists: false,
    setShowPlaylists: () => {
    },
    showTracks: false,
    setShowTracks: () => {
    },
    showVisitedPlaylists: false,
    setShowVisitedPlaylists: () => {
    },
    showRecommendations: false,
    setShowRecommendations: () => {
    },
});
export default CombinedContext;
//# sourceMappingURL=CombinedContext.js.map
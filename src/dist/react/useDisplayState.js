import { useState } from 'react';
export const useDisplayState = () => {
    const [showPlaylists, setShowPlaylists] = useState(false);
    const [showTracks, setShowTracks] = useState(false);
    const [showVisitedPlaylists, setShowVisitedPlaylists] = useState(false);
    const [showRecommendations, setShowRecommendations] = useState(false);
    return {
        showPlaylists,
        setShowPlaylists,
        showTracks,
        setShowTracks,
        showVisitedPlaylists,
        setShowVisitedPlaylists,
        showRecommendations,
        setShowRecommendations
    };
};
//# sourceMappingURL=useDisplayState.js.map
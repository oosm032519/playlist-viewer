import {useCallback, useContext} from 'react';
import CombinedContext from './CombinedContext';
import {RecommendationCalculator} from './RecommendationCalculator';
import PlaylistIdContext from './PlaylistIdContext'

export function useApi() {
    const {
        setPlaylists,
        setSelectedPlaylist
    } = useContext(CombinedContext);
    
    const {setPlaylistId} = useContext(PlaylistIdContext);
    
    const fetchPlaylistById = async (playlistId: string) => {
        console.log('fetchPlaylistByIdが呼び出されました');
        const response = await fetch(`/java/playlist/${playlistId}`);
        const playlist = await response.json();
        console.log(playlist);
        setSelectedPlaylist(playlist);
        setPlaylistId(playlistId);
        return playlist;
    };
    
    const fetchPlaylistsByName = async (searchQuery: string) => {
        console.log('fetchPlaylistsByNameが呼び出されました');
        const response = await fetch(`/java/search/${searchQuery}`);
        const playlists = await response.json();
        console.log(playlists);
        setPlaylists(playlists);
        return playlists;
    };
    
    const fetchVisitedPlaylists = async () => {
        console.log('fetchVisitedPlaylistsが呼び出されました');
        const response = await fetch('/java/user/visited-playlists');
        const visitedPlaylists = await response.json();
        console.log(visitedPlaylists);
        return visitedPlaylists;
    };
    
    const fetchRecommendations = useCallback(async (tracks: any[]) => {
        console.log('fetchRecommendationsが呼び出されました');
        const modeArtistNames = RecommendationCalculator.calculateModeArtistNames(tracks);
        const averageValues = RecommendationCalculator.calculateAverageValues(tracks);        const mode = RecommendationCalculator.calculateMode(tracks);
        const endpoint = `/java/recommendations?tempo=${averageValues.averageTempo}&key=${averageValues.modeKey}&danceability=${averageValues.averageDanceability}&energy=${averageValues.averageEnergy}&acousticness=${averageValues.averageAcousticness}&liveness=${averageValues.averageLiveness}&speechiness=${averageValues.averageSpeechiness}&valence=${averageValues.averageValence}&timeSignature=${averageValues.timeSignature}&durationMs=${averageValues.durationMs}&mode=${mode}&instrumentalness=${averageValues.instrumentalness}&loudness=${averageValues.loudness}&modeArtistNames=${modeArtistNames}`;
        const response = await fetch(endpoint);
        const data = await response.json();
        console.log(data);
        if (data && data.tracks) {
            const trackIds = tracks.map(track => track.audioFeatures.id);
            const uniqueRecommendations = data.tracks.filter((track: { id: any; }) => !trackIds.includes(track.id));
            console.log(uniqueRecommendations);
            return uniqueRecommendations;
        } else {
            console.error('data or data.tracks is null or undefined');
            return [];
        }
    }, []);
    
    return {fetchPlaylistById, fetchPlaylistsByName, fetchVisitedPlaylists, fetchRecommendations};
}

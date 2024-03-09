import {useCallback, useContext} from 'react';
import CombinedContext from './CombinedContext';
import {RecommendationCalculator} from './RecommendationCalculator';
import PlaylistIdContext from './PlaylistIdContext'

export function useApi() {
    const {
        setPlaylists,
        setSelectedPlaylist,
        setMessage,
        setMessageType
    } = useContext(CombinedContext);
    
    const {setPlaylistId} = useContext(PlaylistIdContext);
    
    const fetchPlaylistById = async (playlistId: string) => {
        try {
            console.log('fetchPlaylistByIdが呼び出されました');
            const response = await fetch(`/java/playlist/${playlistId}`);
            const playlist = await response.json();
            console.log(playlist);
            setSelectedPlaylist(playlist);
            setPlaylistId(playlistId);
            return playlist;
        } catch (error) {
            setMessage('プレイリストの取得に失敗しました。');
            setMessageType('error');
        }
    };
    
    const fetchPlaylistsByName = async (searchQuery: string) => {
        try {
            console.log('fetchPlaylistsByNameが呼び出されました');
            const response = await fetch(`/java/search/${searchQuery}`);
            const playlists = await response.json();
            console.log(playlists);
            setPlaylists(playlists);
            return playlists;
        } catch (error) {
            setMessage('プレイリストの検索に失敗しました。');
            setMessageType('error');
        }
    };
    
    const fetchVisitedPlaylists = async () => {
        try {
            console.log('fetchVisitedPlaylistsが呼び出されました');
            const response = await fetch('/java/user/visited-playlists');
            const visitedPlaylists = await response.json();
            console.log(visitedPlaylists);
            return visitedPlaylists;
        } catch (error) {
            setMessage('訪問したプレイリストの取得に失敗しました。');
            setMessageType('error');
        }
    };
    
    const fetchRecommendations = useCallback(async (tracks: any[]) => {
        try {
            console.log('fetchRecommendationsが呼び出されました');
            const modeArtistNames = RecommendationCalculator.calculateModeArtistNames(tracks);
            const averageValues = RecommendationCalculator.calculateAverageValues(tracks);
            const mode = RecommendationCalculator.calculateMode(tracks);
            const endpoint = `/java/recommendations?tempo=${averageValues.averageTempo}&key=${averageValues.modeKey}&danceability=${averageValues.averageDanceability}&energy=${averageValues.averageEnergy}&acousticness=${averageValues.averageAcousticness}&liveness=${averageValues.averageLiveness}&speechiness=${averageValues.averageSpeechiness}&valence=${averageValues.averageValence}&timeSignature=${averageValues.timeSignature}&durationMs=${averageValues.durationMs}&mode=${mode}&instrumentalness=${averageValues.instrumentalness}&loudness=${averageValues.loudness}&modeArtistNames=${modeArtistNames}`;
            const response = await fetch(endpoint);
            if (!response.ok) {
                console.error(`HTTP error! status: ${response.status}`);
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            if (response.headers.get("content-type")?.includes("application/json")) {
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
            } else {
                console.error('Received non-JSON response');
                return [];
            }
        } catch (error) {
            setMessage('おすすめの曲の取得に失敗しました。');
            setMessageType('error');
        }
    }, []);
    
    const fetchUserPlaylists = useCallback(async () => {
        const response = await fetch('/java/spotify/user/playlists');
        if (!response.ok) {
            const message = await response.text();
            throw new Error(message);
        }
        return await response.json();
    }, []);
    
    return {fetchPlaylistById, fetchPlaylistsByName, fetchVisitedPlaylists, fetchRecommendations, fetchUserPlaylists};
}

import React, {Dispatch, SetStateAction} from 'react';

export enum Option {
    PlaylistIdOption = 'playlistIdOption',
    SearchOption = 'searchOption',
}

type CombinedContextType = {
    selectedOption: Option;
    setSelectedOption: Dispatch<SetStateAction<Option>>;
    playlists: any[];
    setPlaylists: (playlists: any[]) => void;
    selectedPlaylist: any;
    setSelectedPlaylist: (playlist: any) => void;
    visitedPlaylists: any[];
    setVisitedPlaylists: (playlists: any[]) => void;
    isLoading: boolean;
    setIsLoading: (loading: boolean) => void;
    showPlaylists: boolean;
    setShowPlaylists: (show: boolean) => void;
    showTracks: boolean;
    setShowTracks: (show: boolean) => void;
    showVisitedPlaylists: boolean;
    setShowVisitedPlaylists: (show: boolean) => void;
    showRecommendations: boolean;
    setShowRecommendations: (show: boolean) => void;
    setMessage: React.Dispatch<React.SetStateAction<string | null>>;
    setMessageType: React.Dispatch<React.SetStateAction<'success' | 'error' | null>>;
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    selectedTrack: any;
    setSelectedTrack: (track: any) => void;
};

const CombinedContext = React.createContext<CombinedContextType>({
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
    setMessage: () => {
    },
    setMessageType: () => {
    },
    isOpen: false,
    setIsOpen: () => {
    },
    selectedTrack: null,
    setSelectedTrack: () => {
    },
});

export default CombinedContext;

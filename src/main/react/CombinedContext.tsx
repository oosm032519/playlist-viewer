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
    isLoading: boolean;
    setIsLoading: (loading: boolean) => void;
    showPlaylists: boolean;
    setShowPlaylists: (show: boolean) => void;
    showTracks: boolean;
    setShowTracks: (show: boolean) => void;
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
    isLoading: false,
    setIsLoading: () => {
    },
    showPlaylists: false,
    setShowPlaylists: () => {
    },
    showTracks: false,
    setShowTracks: () => {
    },
});

export default CombinedContext;

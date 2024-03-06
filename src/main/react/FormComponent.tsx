import React, {useContext} from 'react';
import {SelectedOptionContext} from './SelectedOptionContext';
import PlaylistContext from './PlaylistContext';

type FormComponentProps = {
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
    isLoading: boolean;
};

const FormComponent: React.FC<FormComponentProps> = ({setIsLoading, isLoading}) => {
    const {selectedOption} = useContext(SelectedOptionContext);
    const {setPlaylists, setPlaylistTableVisible, setUserPlaylistTableVisible} = useContext(PlaylistContext);
    
    const handlePlaylistIdSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true);
        const playlistId = (event.target as any).elements.playlistId.value;
        const response = await fetch(`/java/playlist/${playlistId}`);
        const playlist = await response.json();
        console.log(playlist);
        setPlaylists([playlist]);
        setPlaylistTableVisible(true);
        setIsLoading(false);
    };
    
    const handleSearchSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true);
        const searchQuery = (event.target as any).elements.searchQuery.value;
        const response = await fetch(`/java/search/${searchQuery}`);
        const playlists = await response.json();
        console.log(playlists);
        setPlaylists(playlists);
        setUserPlaylistTableVisible(true);
        setIsLoading(false);
    };
    
    return (
        <div>
            {selectedOption === 'playlistIdOption' ? (
                <form id="playlistForm" className="m-5 form-container flex items-center" onSubmit={handlePlaylistIdSubmit}>
                    <input type="text" id="playlistId" placeholder="プレイリストIDを入力してください"
                           className="border-2 border-gray-300 hover:border-green-500 transition-colors duration-300 rounded-lg h-10 w-11/12 p-3 mr-2"/>
                    <button type="submit"
                            className="bg-green-500 text-white rounded-lg h-10 p-3 flex items-center justify-center transition transform ease-in-out duration-500 hover:bg-green-500 hover:text-white hover:shadow-lg hover:border-transparent hover:ring-4 hover:ring-green-300">
                        送信
                    </button>
                </form>
            ) : (
                <form id="searchForm" className="m-5 form-container flex items-center" onSubmit={handleSearchSubmit}>
                    <input type="text" id="searchQuery" placeholder="プレイリスト名を入力してください"
                           className="border-2 border-gray-300 hover:border-green-500 transition-colors duration-300 rounded-lg h-10 w-11/12 p-3 mr-2"/>
                    <button type="submit"
                            className="bg-green-500 text-white rounded-lg h-10 p-3 flex items-center justify-center transition transform ease-in-out duration-500 hover:bg-green-500 hover:text-white hover:shadow-lg hover:border-transparent hover:ring-4 hover:ring-green-300">
                        検索
                    </button>
                </form>
            )}
        </div>
    );
};

export default FormComponent;

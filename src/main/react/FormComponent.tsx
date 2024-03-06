import React, {useContext} from 'react';
import CombinedContext, {Option} from './CombinedContext';
import {useApi} from './useApi'

type FormComponentProps = {
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
    isLoading: boolean;
};

const FormComponent: React.FC<FormComponentProps> = ({setIsLoading}) => {
    const {selectedOption, setShowPlaylists, setShowTracks, setPlaylists} = useContext(CombinedContext);
    const {fetchPlaylistById, fetchPlaylistsByName} = useApi();
    
    const handlePlaylistIdSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        console.log('handlePlaylistIdSubmitが呼び出されました');
        event.preventDefault();
        setIsLoading(true);
        const playlistId = (event.target as any).elements.playlistId.value;
        await fetchPlaylistById(playlistId);
        setShowTracks(true);
        setShowPlaylists(false);
        setIsLoading(false);
    };
    
    const handleSearchSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        console.log('handleSearchSubmitが呼び出されました');
        event.preventDefault();
        setIsLoading(true);
        const searchQuery = (event.target as any).elements.searchQuery.value;
        try {
            const playlists = await fetchPlaylistsByName(searchQuery);
            if (JSON.stringify(playlists) !== JSON.stringify(playlists)) {
                setPlaylists(playlists);
            }
            setShowPlaylists(true);
            setShowTracks(false);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            {selectedOption === Option.PlaylistIdOption ? (
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

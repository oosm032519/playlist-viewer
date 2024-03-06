import React, {useState, useContext} from 'react';
import {SelectedOptionContext} from './SelectedOptionContext';
import PlaylistTable from './PlaylistTable';

const FormComponent = () => {
    const {selectedOption} = useContext(SelectedOptionContext);
    const [playlist, setPlaylist] = useState(null);
    const [isLoading, setIsLoading] = useState(false); // New state for loading status
    
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true); // Set loading status to true when button is clicked
        let response;
        if (selectedOption === 'playlistIdOption') {
            const playlistId = (event.target as any).elements.playlistId.value;
            response = await fetch(`/java/playlist/${playlistId}`);
        } else {
            const searchQuery = (event.target as any).elements.searchQuery.value;
            response = await fetch(`/java/search/${searchQuery}`);
        }
        const playlist = await response.json();
        console.log(playlist);
        setPlaylist(playlist);
        setIsLoading(false); // Set loading status to false after data is fetched
    };
    
    return (
        <div>
            {selectedOption === 'playlistIdOption' ? (
                <form id="playlistForm" className="m-5 form-container flex items-center" onSubmit={handleSubmit}>
                    <input type="text" id="playlistId" placeholder="プレイリストIDを入力してください"
                           className="border-2 border-gray-300 hover:border-green-500 transition-colors duration-300 rounded-lg h-10 w-11/12 p-3 mr-2"/>
                    <button type="submit"
                            className="bg-green-500 text-white rounded-lg h-10 p-3 flex items-center justify-center transition transform ease-in-out duration-500 hover:bg-green-500 hover:text-white hover:shadow-lg hover:border-transparent hover:ring-4 hover:ring-green-300">
                        送信
                    </button>
                </form>
            ) : (
                <form id="searchForm" className="m-5 form-container flex items-center" onSubmit={handleSubmit}>
                    <input type="text" id="searchQuery" placeholder="プレイリスト名を入力してください"
                           className="border-2 border-gray-300 hover:border-green-500 transition-colors duration-300 rounded-lg h-10 w-11/12 p-3 mr-2"/>
                    <button type="submit"
                            className="bg-green-500 text-white rounded-lg h-10 p-3 flex items-center justify-center transition transform ease-in-out duration-500 hover:bg-green-500 hover:text-white hover:shadow-lg hover:border-transparent hover:ring-4 hover:ring-green-300">
                        検索
                    </button>
                </form>
            )}
            {isLoading ? (
                <div
                    className="loader animate-spin h-12 w-12 border-t-4 border-green-500 rounded-full absolute top-0 bottom-0 left-0 right-0 m-auto"></div>
            ) : (
                playlist && <PlaylistTable playlist={playlist}/>
            )}
        </div>
    );
};

export default FormComponent;

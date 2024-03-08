import React, {useContext, useEffect, useRef} from 'react';
import CombinedContext, {Option} from './CombinedContext';
import {useApi} from './useApi'

type FormComponentProps = {
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
    isLoading: boolean;
};

const FormComponent: React.FC<FormComponentProps> = ({setIsLoading}) => {
    const {selectedOption, setShowPlaylists, setShowTracks, setPlaylists} = useContext(CombinedContext);
    const {fetchPlaylistById, fetchPlaylistsByName} = useApi();
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.value = '';
        }
    }, [selectedOption]);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true);
        const inputValue = inputRef.current?.value;

        try {
            if (selectedOption === Option.PlaylistIdOption) {
                await fetchPlaylistById(inputValue);
                setShowTracks(true);
                setShowPlaylists(false);
            } else {
                const playlists = await fetchPlaylistsByName(inputValue);
                if (JSON.stringify(playlists) !== JSON.stringify(playlists)) {
                    setPlaylists(playlists);
                }
                setShowPlaylists(true);
                setShowTracks(false);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <form className="m-5 form-container flex items-center" onSubmit={handleSubmit}>
                <input ref={inputRef} type="text" name="inputField"
                       placeholder={selectedOption === Option.PlaylistIdOption ? "プレイリストIDを入力してください" : "プレイリスト名を入力してください"}
                       className="border-2 border-gray-300 hover:border-green-500 transition-colors duration-300 rounded-lg h-10 w-11/12 p-3 mr-2"/>
                <button type="submit"
                        className="bg-green-500 text-white rounded-lg h-10 p-3 flex items-center justify-center transition transform ease-in-out duration-500 hover:bg-green-500 hover:text-white hover:shadow-lg hover:border-transparent hover:ring-4 hover:ring-green-300 z-10">
                    {selectedOption === Option.PlaylistIdOption ? "送信" : "検索"}
                </button>
            </form>
        </div>
    );
};

export default FormComponent;

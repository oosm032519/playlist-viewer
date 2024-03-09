import React, {useContext, useEffect, useRef} from 'react';
import CombinedContext, {Option} from './CombinedContext';
import {useApi} from './useApi'

type FormComponentProps = {
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
    isLoading: boolean;
};

const FormComponent: React.FC<FormComponentProps> = ({setIsLoading}) => {
    const {selectedOption, setShowPlaylists, setShowTracks, setPlaylists, isOpen} = useContext(CombinedContext);
    const {fetchPlaylistById, fetchPlaylistsByName} = useApi();
    const inputRef = useRef<HTMLInputElement>(null);
    
    // Clear the input field when the selected option changes
    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.value = '';
        }
    }, [selectedOption]);
    
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true);
        const inputValue = inputRef.current?.value;
        
        if (selectedOption === Option.PlaylistIdOption) {
            console.log('fetchPlaylistByIdを呼び出します');
            await fetchPlaylistById(inputValue);
            setShowTracks(true);
            setShowPlaylists(false);
        } else {
            console.log('fetchPlaylistsByNameを呼び出します');
            const playlists = await fetchPlaylistsByName(inputValue);
            setPlaylists(playlists);
            setShowPlaylists(true);
            setShowTracks(false);
        }
        
        setIsLoading(false);
    };
    
    useEffect(() => {
        console.log('isOpen:', isOpen);
    }, [isOpen]);
    
    // Calculate the width of the input field based on the isOpen state
    const inputWidthClass = isOpen ? 'w-8/12' : 'w-11/12';
    
    return (
        <div>
            <form className="m-5 form-container flex items-center w-auto" onSubmit={handleSubmit}>
                <input ref={inputRef} type="text" name="inputField"
                       placeholder={selectedOption === Option.PlaylistIdOption ? "プレイリストIDを入力してください" : "プレイリスト名を入力してください"}
                       className={`border-2 border-gray-300 hover:border-green-500 transition-colors duration-300 rounded-lg h-10 ${inputWidthClass} p-3 mr-2 transition-width duration-500 ease-in-out hover:shadow-md`}
                       style={{transition: 'width 0.2s ease-in-out'}}/>
                <button type="submit"
                        className="bg-green-500 text-white rounded-lg h-10 p-3 flex items-center justify-center transition transform ease-in-out duration-500 hover:bg-green-500 hover:text-white hover:shadow-md hover:border-transparent">
                    {selectedOption === Option.PlaylistIdOption ? "送信" : "検索"}
                </button>
            </form>
        </div>
    );
};

export default FormComponent;

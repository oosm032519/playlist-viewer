import React, {useContext} from 'react';
import CombinedContext, {Option} from './CombinedContext';

const RadioButton = () => {
    const {selectedOption, setSelectedOption} = useContext(CombinedContext);

    const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedOption(event.target.value as Option);
    };

    return (
        <div className="radio-group flex justify-center my-5">
            <div className="mx-2">
                <input type="radio" id="playlistIdOption" value={Option.PlaylistIdOption} name="option" className="hidden"
                       onChange={handleOptionChange}
                       checked={selectedOption === Option.PlaylistIdOption} style={{position: 'absolute', opacity: 0}}/>
                <label htmlFor="playlistIdOption"
                       className={`inline-block p-2 px-5 m-2 border-2 border-green-500 rounded-md ${selectedOption === Option.PlaylistIdOption ? 'bg-green-500 text-white' : 'bg-white text-green-500'} transition-all duration-300 ease-in-out cursor-pointer w-11/10 hover:bg-green-500 hover:text-white hover:shadow-lg hover:border-transparent hover:ring-4 hover:ring-green-300`}>
                    プレイリストIDを入力
                </label>
            </div>
            <div className="mx-2">
                <input type="radio" id="searchQueryOption" value={Option.SearchOption} name="option" className="hidden"
                       onChange={handleOptionChange} checked={selectedOption === Option.SearchOption}
                       style={{position: 'absolute', opacity: 0}}/>
                <label htmlFor="searchQueryOption"
                       className={`inline-block p-2 px-5 m-2 border-2 border-green-500 rounded-md ${selectedOption === Option.SearchOption ? 'bg-green-500 text-white' : 'bg-white text-green-500'} transition-all duration-300 ease-in-out cursor-pointer w-11/10 hover:bg-green-500 hover:text-white hover:shadow-lg hover:border-transparent hover:ring-4 hover:ring-green-300`}>
                    プレイリスト名で検索
                </label>
            </div>
        </div>
    );
};

export default RadioButton;

import React, {useContext} from 'react';
import CombinedContext, {Option} from './CombinedContext';
import { useWindowWidth } from './useWindowWidth';

const RadioButton = () => {
    const {selectedOption, setSelectedOption, isOpen} = useContext(CombinedContext);
    const windowWidth = useWindowWidth();

    const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedOption(event.target.value as Option);
    };

    const options = [
        { id: 'playlistIdOption', value: Option.PlaylistIdOption, label: 'プレイリストIDを入力' },
        { id: 'searchQueryOption', value: Option.SearchOption, label: 'プレイリスト名で検索' },
    ];

    // Calculate the position of the radio buttons based on the isOpen state
    const positionStyle = isOpen ? {marginRight: (windowWidth / 4)} : {};
    
    return (
        <div className={`radio-group flex justify-center my-5 transition-all duration-200 ease-in-out`}
             style={positionStyle}>
            {options.map((option) => (
                <div className="mx-2" key={option.id}>
                    <input type="radio" id={option.id} value={option.value} name="option" className="hidden"
                           onChange={handleOptionChange}
                           checked={selectedOption === option.value} style={{position: 'absolute', opacity: 0}}/>
                    <label htmlFor={option.id}
                           className={`inline-block p-2 px-5 m-2 border-2 border-green-500 rounded-full ${selectedOption === option.value ? 'bg-green-500 text-white' : 'bg-white text-green-500'} transition-all duration-300 ease-in-out cursor-pointer w-11/10 hover:bg-green-500 hover:text-white hover:shadow-lg hover:border-transparent`}>
                        {option.label}
                    </label>
                </div>
            ))}
        </div>
    );
};

export default RadioButton;

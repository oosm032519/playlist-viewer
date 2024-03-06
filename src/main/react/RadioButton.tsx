import React, {useState, useEffect, useContext} from 'react';
import {SelectedOptionContext} from './SelectedOptionContext';

const RadioButton = () => {
    const {selectedOption, setSelectedOption} = useContext(SelectedOptionContext);
    
    const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedOption(event.target.id);
        localStorage.setItem('selectedOption', event.target.id);
    };
    
    useEffect(() => {
        const savedOption = localStorage.getItem('selectedOption');
        if (savedOption) {
            setSelectedOption(savedOption);
        }
    }, [selectedOption]);

    return (
        <div className="radio-group flex justify-center my-5">
            <div className="mx-2">
                <input type="radio" id="playlistIdOption" name="option" className="hidden" onChange={handleOptionChange}
                       checked={selectedOption === 'playlistIdOption'} style={{position: 'absolute', opacity: 0}}/>
                <label htmlFor="playlistIdOption"
                       className={`inline-block p-2 px-5 m-2 border-2 border-green-500 rounded-md ${selectedOption === 'playlistIdOption' ? 'bg-green-500 text-white' : 'bg-white text-green-500'} transition-all duration-300 ease-in-out cursor-pointer w-11/10 hover:bg-green-500 hover:text-white hover:shadow-lg hover:border-transparent hover:ring-4 hover:ring-green-300`}>
                    プレイリストIDを入力
                </label>
            </div>
            <div className="mx-2">
                <input type="radio" id="searchQueryOption" name="option" className="hidden"
                       onChange={handleOptionChange} checked={selectedOption === 'searchQueryOption'}
                       style={{position: 'absolute', opacity: 0}}/>
                <label htmlFor="searchQueryOption"
                       className={`inline-block p-2 px-5 m-2 border-2 border-green-500 rounded-md ${selectedOption === 'searchQueryOption' ? 'bg-green-500 text-white' : 'bg-white text-green-500'} transition-all duration-300 ease-in-out cursor-pointer w-11/10 hover:bg-green-500 hover:text-white hover:shadow-lg hover:border-transparent hover:ring-4 hover:ring-green-300`}>
                    プレイリスト名で検索
                </label>
            </div>
        </div>
    );
};

export default RadioButton;

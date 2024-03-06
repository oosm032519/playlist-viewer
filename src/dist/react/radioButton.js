import React, { useEffect, useContext } from 'react';
import { SelectedOptionContext } from './SelectedOptionContext';
const RadioButton = () => {
    const { selectedOption, setSelectedOption } = useContext(SelectedOptionContext);
    const handleOptionChange = (event) => {
        setSelectedOption(event.target.id);
        localStorage.setItem('selectedOption', event.target.id);
    };
    useEffect(() => {
        const savedOption = localStorage.getItem('selectedOption');
        if (savedOption) {
            setSelectedOption(savedOption);
        }
    }, [selectedOption]);
    return (React.createElement("div", { className: "radio-group flex justify-center my-5" },
        React.createElement("div", { className: "mx-2" },
            React.createElement("input", { type: "radio", id: "playlistIdOption", name: "option", className: "hidden", onChange: handleOptionChange, checked: selectedOption === 'playlistIdOption', style: { position: 'absolute', opacity: 0 } }),
            React.createElement("label", { htmlFor: "playlistIdOption", className: `inline-block p-2 px-5 m-2 border-2 border-green-500 rounded-md ${selectedOption === 'playlistIdOption' ? 'bg-green-500 text-white' : 'bg-white text-green-500'} transition-all duration-300 ease-in-out cursor-pointer w-11/10 hover:bg-green-500 hover:text-white hover:shadow-lg hover:border-transparent hover:ring-4 hover:ring-green-300` }, "\u30D7\u30EC\u30A4\u30EA\u30B9\u30C8ID\u3092\u5165\u529B")),
        React.createElement("div", { className: "mx-2" },
            React.createElement("input", { type: "radio", id: "searchQueryOption", name: "option", className: "hidden", onChange: handleOptionChange, checked: selectedOption === 'searchQueryOption', style: { position: 'absolute', opacity: 0 } }),
            React.createElement("label", { htmlFor: "searchQueryOption", className: `inline-block p-2 px-5 m-2 border-2 border-green-500 rounded-md ${selectedOption === 'searchQueryOption' ? 'bg-green-500 text-white' : 'bg-white text-green-500'} transition-all duration-300 ease-in-out cursor-pointer w-11/10 hover:bg-green-500 hover:text-white hover:shadow-lg hover:border-transparent hover:ring-4 hover:ring-green-300` }, "\u30D7\u30EC\u30A4\u30EA\u30B9\u30C8\u540D\u3067\u691C\u7D22"))));
};
export default RadioButton;
//# sourceMappingURL=RadioButton.js.map
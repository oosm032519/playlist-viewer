import React, { useContext } from 'react';
import CombinedContext, { Option } from './CombinedContext';
const RadioButton = () => {
    const { selectedOption, setSelectedOption } = useContext(CombinedContext);
    const handleOptionChange = (event) => {
        setSelectedOption(event.target.value);
    };
    const options = [
        { id: 'playlistIdOption', value: Option.PlaylistIdOption, label: 'プレイリストIDを入力' },
        { id: 'searchQueryOption', value: Option.SearchOption, label: 'プレイリスト名で検索' },
    ];
    return (React.createElement("div", { className: "radio-group flex justify-center my-5" }, options.map((option) => (React.createElement("div", { className: "mx-2", key: option.id },
        React.createElement("input", { type: "radio", id: option.id, value: option.value, name: "option", className: "hidden", onChange: handleOptionChange, checked: selectedOption === option.value, style: { position: 'absolute', opacity: 0 } }),
        React.createElement("label", { htmlFor: option.id, className: `inline-block p-2 px-5 m-2 border-2 border-green-500 rounded-md ${selectedOption === option.value ? 'bg-green-500 text-white' : 'bg-white text-green-500'} transition-all duration-300 ease-in-out cursor-pointer w-11/10 hover:bg-green-500 hover:text-white hover:shadow-lg hover:border-transparent hover:ring-4 hover:ring-green-300` }, option.label))))));
};
export default RadioButton;
//# sourceMappingURL=RadioButton.js.map
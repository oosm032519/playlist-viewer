import React, { useState, useEffect } from 'react';
import RadioButton from './RadioButton';
const OptionManager = () => {
    const [selectedOption, setSelectedOption] = useState(localStorage.getItem('selectedOption') || 'playlistIdOption');
    const handleOptionChange = (event) => {
        console.log(event); // Add this line to debug the event object
        setSelectedOption(event.target.id);
        localStorage.setItem('selectedOption', event.target.id);
    };
    useEffect(() => {
        const savedOption = localStorage.getItem('selectedOption');
        if (savedOption) {
            setSelectedOption(savedOption);
        }
        console.log(selectedOption === 'playlistIdOption'); // Move this line here to debug the checked property
        console.log(selectedOption === 'searchQueryOption'); // Move this line here to debug the checked property
    }, [selectedOption]); // Add selectedOption as a dependency to the useEffect hook
    return (React.createElement("div", { className: "radio-group flex justify-center my-5" },
        React.createElement(RadioButton, { optionId: "playlistIdOption", showFormId: "playlistForm", hideFormId: "searchForm", labelText: "\u30D7\u30EC\u30A4\u30EA\u30B9\u30C8ID\u3092\u5165\u529B", onChange: handleOptionChange, checked: selectedOption === 'playlistIdOption' }),
        React.createElement(RadioButton, { optionId: "searchQueryOption", showFormId: "searchForm", hideFormId: "playlistForm", labelText: "\u30D7\u30EC\u30A4\u30EA\u30B9\u30C8\u540D\u3067\u691C\u7D22", onChange: handleOptionChange, checked: selectedOption === 'searchQueryOption' })));
};
export default OptionManager;
//# sourceMappingURL=OptionManager.js.map
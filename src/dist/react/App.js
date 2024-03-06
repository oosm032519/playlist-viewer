import React, { useState } from 'react';
import RadioButton from './RadioButton';
import SideMenu from './SideMenu';
import Form from './Form';
import { SelectedOptionContext } from './SelectedOptionContext';
const App = () => {
    const [selectedOption, setSelectedOption] = useState(localStorage.getItem('selectedOption') || 'playlistIdOption');
    return (React.createElement(SelectedOptionContext.Provider, { value: { selectedOption, setSelectedOption } },
        React.createElement("div", { className: "App" },
            React.createElement("h1", { className: "text-3xl font-light ml-5 text-center py-5" }, "Playlist Viewer"),
            React.createElement(SideMenu, null),
            React.createElement(RadioButton, null),
            React.createElement(Form, null))));
};
export default App;
//# sourceMappingURL=App.js.map
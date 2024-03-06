import React, { useState } from 'react';
import RadioButton from './RadioButton'
import SideMenu from './SideMenu';
import Form from './Form';
import {SelectedOptionContext} from './SelectedOptionContext';

const App: React.FC = () => {
    const [selectedOption, setSelectedOption] = useState(localStorage.getItem('selectedOption') || 'playlistIdOption');

    return (
        <SelectedOptionContext.Provider value={{selectedOption, setSelectedOption}}>
            <div className="App">
                <h1 className="text-3xl font-light ml-5 text-center py-5">Playlist Viewer</h1>
                <SideMenu/>
                <RadioButton/>
                <Form/>
            </div>
        </SelectedOptionContext.Provider>
    );
};

export default App;

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import React, { useState, useContext } from 'react';
import { SelectedOptionContext } from './SelectedOptionContext';
import PlaylistTable from './PlaylistTable';
const FormComponent = ({ setIsLoading, isLoading }) => {
    const { selectedOption } = useContext(SelectedOptionContext);
    const [playlist, setPlaylist] = useState(null);
    const handleSubmit = (event) => __awaiter(void 0, void 0, void 0, function* () {
        event.preventDefault();
        setIsLoading(true);
        let response;
        if (selectedOption === 'playlistIdOption') {
            const playlistId = event.target.elements.playlistId.value;
            response = yield fetch(`/java/playlist/${playlistId}`);
        }
        else {
            const searchQuery = event.target.elements.searchQuery.value;
            response = yield fetch(`/java/search/${searchQuery}`);
        }
        const playlist = yield response.json();
        console.log(playlist);
        setPlaylist(playlist);
        setIsLoading(false);
    });
    return (React.createElement("div", null,
        selectedOption === 'playlistIdOption' ? (React.createElement("form", { id: "playlistForm", className: "m-5 form-container flex items-center", onSubmit: handleSubmit },
            React.createElement("input", { type: "text", id: "playlistId", placeholder: "\u30D7\u30EC\u30A4\u30EA\u30B9\u30C8ID\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044", className: "border-2 border-gray-300 hover:border-green-500 transition-colors duration-300 rounded-lg h-10 w-11/12 p-3 mr-2" }),
            React.createElement("button", { type: "submit", className: "bg-green-500 text-white rounded-lg h-10 p-3 flex items-center justify-center transition transform ease-in-out duration-500 hover:bg-green-500 hover:text-white hover:shadow-lg hover:border-transparent hover:ring-4 hover:ring-green-300" }, "\u9001\u4FE1"))) : (React.createElement("form", { id: "searchForm", className: "m-5 form-container flex items-center", onSubmit: handleSubmit },
            React.createElement("input", { type: "text", id: "searchQuery", placeholder: "\u30D7\u30EC\u30A4\u30EA\u30B9\u30C8\u540D\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044", className: "border-2 border-gray-300 hover:border-green-500 transition-colors duration-300 rounded-lg h-10 w-11/12 p-3 mr-2" }),
            React.createElement("button", { type: "submit", className: "bg-green-500 text-white rounded-lg h-10 p-3 flex items-center justify-center transition transform ease-in-out duration-500 hover:bg-green-500 hover:text-white hover:shadow-lg hover:border-transparent hover:ring-4 hover:ring-green-300" }, "\u691C\u7D22"))),
        !isLoading && playlist && React.createElement(PlaylistTable, { playlist: playlist })));
};
export default FormComponent;
//# sourceMappingURL=Form.js.map
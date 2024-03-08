var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import React, { useContext, useEffect, useRef } from 'react';
import CombinedContext, { Option } from './CombinedContext';
import { useApi } from './useApi';
const FormComponent = ({ setIsLoading }) => {
    const { selectedOption, setShowPlaylists, setShowTracks, setPlaylists } = useContext(CombinedContext);
    const { fetchPlaylistById, fetchPlaylistsByName } = useApi();
    const inputRef = useRef(null);
    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.value = '';
        }
    }, [selectedOption]);
    const handleSubmit = (event) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        event.preventDefault();
        setIsLoading(true);
        const inputValue = (_a = inputRef.current) === null || _a === void 0 ? void 0 : _a.value;
        try {
            if (selectedOption === Option.PlaylistIdOption) {
                yield fetchPlaylistById(inputValue);
                setShowTracks(true);
                setShowPlaylists(false);
            }
            else {
                const playlists = yield fetchPlaylistsByName(inputValue);
                if (JSON.stringify(playlists) !== JSON.stringify(playlists)) {
                    setPlaylists(playlists);
                }
                setShowPlaylists(true);
                setShowTracks(false);
            }
        }
        catch (error) {
            console.error(error);
        }
        finally {
            setIsLoading(false);
        }
    });
    return (React.createElement("div", null,
        React.createElement("form", { className: "m-5 form-container flex items-center", onSubmit: handleSubmit },
            React.createElement("input", { ref: inputRef, type: "text", name: "inputField", placeholder: selectedOption === Option.PlaylistIdOption ? "プレイリストIDを入力してください" : "プレイリスト名を入力してください", className: "border-2 border-gray-300 hover:border-green-500 transition-colors duration-300 rounded-lg h-10 w-11/12 p-3 mr-2" }),
            React.createElement("button", { type: "submit", className: "bg-green-500 text-white rounded-lg h-10 p-3 flex items-center justify-center transition transform ease-in-out duration-500 hover:bg-green-500 hover:text-white hover:shadow-lg hover:border-transparent hover:ring-4 hover:ring-green-300 z-10" }, selectedOption === Option.PlaylistIdOption ? "送信" : "検索"))));
};
export default FormComponent;
//# sourceMappingURL=FormComponent.js.map
import React, { useRef } from 'react';
const PlaylistTable = ({ playlist }) => {
    var _a;
    const headerElements = useRef(null);
    const onHeaderClick = (field) => {
        console.log(field);
    };
    return (React.createElement("table", { className: "min-w-full divide-y divide-gray-200" },
        React.createElement("thead", { className: "bg-gray-50", ref: headerElements },
            React.createElement("tr", null,
                React.createElement("th", { onClick: () => onHeaderClick('Track Name'), className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" }, "Track Name"),
                React.createElement("th", { onClick: () => onHeaderClick('Artist'), className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" }, "Artist"),
                React.createElement("th", { onClick: () => onHeaderClick('Tempo'), className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" }, "Tempo"),
                React.createElement("th", { onClick: () => onHeaderClick('Time Signature'), className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" }, "Time Signature"),
                React.createElement("th", { onClick: () => onHeaderClick('Duration (ms)'), className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" }, "Duration (ms)"),
                React.createElement("th", { onClick: () => onHeaderClick('Key'), className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" }, "Key"),
                React.createElement("th", { onClick: () => onHeaderClick('Mode'), className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" }, "Mode"),
                React.createElement("th", { onClick: () => onHeaderClick('Acousticness'), className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" }, "Acousticness"),
                React.createElement("th", { onClick: () => onHeaderClick('Danceability'), className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" }, "Danceability"),
                React.createElement("th", { onClick: () => onHeaderClick('Energy'), className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" }, "Energy"),
                React.createElement("th", { onClick: () => onHeaderClick('Instrumentalness'), className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" }, "Instrumentalness"),
                React.createElement("th", { onClick: () => onHeaderClick('Liveness'), className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" }, "Liveness"),
                React.createElement("th", { onClick: () => onHeaderClick('Loudness'), className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" }, "Loudness"),
                React.createElement("th", { onClick: () => onHeaderClick('Speechiness'), className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" }, "Speechiness"),
                React.createElement("th", { onClick: () => onHeaderClick('Valence'), className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" }, "Valence"),
                React.createElement("th", { onClick: () => onHeaderClick('Popularity'), className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" }, "Popularity"))),
        React.createElement("tbody", { className: "bg-white divide-y divide-gray-200" }, (_a = playlist.tracks) === null || _a === void 0 ? void 0 : _a.filter((track) => track && track.playlistTrack.track).map((track, index) => (React.createElement("tr", { key: index },
            React.createElement("td", { className: "px-6 py-4 whitespace-nowrap" }, track.playlistTrack.track.name),
            React.createElement("td", { className: "px-6 py-4 whitespace-nowrap" }, track.playlistTrack.track.artists[0].name),
            React.createElement("td", { className: "px-6 py-4 whitespace-nowrap" }, track.audioFeatures.tempo),
            React.createElement("td", { className: "px-6 py-4 whitespace-nowrap" }, track.audioFeatures.timeSignature),
            React.createElement("td", { className: "px-6 py-4 whitespace-nowrap" }, track.audioFeatures.durationMs),
            React.createElement("td", { className: "px-6 py-4 whitespace-nowrap" }, track.audioFeatures.key),
            React.createElement("td", { className: "px-6 py-4 whitespace-nowrap" }, track.audioFeatures.mode),
            React.createElement("td", { className: "px-6 py-4 whitespace-nowrap" }, track.audioFeatures.acousticness),
            React.createElement("td", { className: "px-6 py-4 whitespace-nowrap" }, track.audioFeatures.danceability),
            React.createElement("td", { className: "px-6 py-4 whitespace-nowrap" }, track.audioFeatures.energy),
            React.createElement("td", { className: "px-6 py-4 whitespace-nowrap" }, track.audioFeatures.instrumentalness),
            React.createElement("td", { className: "px-6 py-4 whitespace-nowrap" }, track.audioFeatures.liveness),
            React.createElement("td", { className: "px-6 py-4 whitespace-nowrap" }, track.audioFeatures.loudness),
            React.createElement("td", { className: "px-6 py-4 whitespace-nowrap" }, track.audioFeatures.speechiness),
            React.createElement("td", { className: "px-6 py-4 whitespace-nowrap" }, track.audioFeatures.valence),
            React.createElement("td", { className: "px-6 py-4 whitespace-nowrap" }, track.playlistTrack.track.popularity)))))));
};
export default PlaylistTable;
//# sourceMappingURL=PlaylistTable.js.map
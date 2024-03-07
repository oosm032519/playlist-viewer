import React, { useEffect, useState } from 'react';
import { useTable } from 'react-table';
import { calculateAverageValues, calculateMode, calculateModeArtistNames } from './RecommendationCalculator';
const RecommendationsTable = ({ playlist }) => {
    const [recommendations, setRecommendations] = useState([]);
    useEffect(() => {
        const modeArtistNames = calculateModeArtistNames(playlist.tracks);
        const averageValues = calculateAverageValues(playlist.tracks);
        const mode = calculateMode(playlist.tracks);
        const endpoint = `/java/recommendations?tempo=${averageValues.averageTempo}&key=${averageValues.modeKey}&danceability=${averageValues.averageDanceability}&energy=${averageValues.averageEnergy}&acousticness=${averageValues.averageAcousticness}&liveness=${averageValues.averageLiveness}&speechiness=${averageValues.averageSpeechiness}&valence=${averageValues.averageValence}&timeSignature=${averageValues.timeSignature}&durationMs=${averageValues.durationMs}&mode=${mode}&instrumentalness=${averageValues.instrumentalness}&loudness=${averageValues.loudness}&modeArtistNames=${modeArtistNames}`;
        fetch(endpoint)
            .then(response => response.json())
            .then(data => {
            console.log("Response:", Response);
            console.log("data:", data);
            // Get the ids of the tracks in the playlist
            const trackIds = playlist.tracks.map(track => track.audioFeatures.id);
            // Filter out the recommendations that are already in the playlist
            const uniqueRecommendations = data.tracks.filter((track) => !trackIds.includes(track.id));
            setRecommendations(uniqueRecommendations);
        })
            .catch(error => console.error(error));
    }, [playlist]);
    const data = React.useMemo(() => recommendations, [recommendations]);
    const columns = React.useMemo(() => [
        { Header: 'Track Name', accessor: 'name' },
        { Header: 'Artist', accessor: 'artists[0].name' },
    ], []);
    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow, } = useTable({ columns, data });
    return (React.createElement("table", Object.assign({}, getTableProps(), { className: "min-w-full divide-y divide-gray-200" }),
        React.createElement("thead", { className: "bg-gray-50" }, headerGroups.map((headerGroup) => (React.createElement("tr", Object.assign({}, headerGroup.getHeaderGroupProps()), headerGroup.headers.map(column => (React.createElement("th", Object.assign({}, column.getHeaderProps(), { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" }), column.render('Header')))))))),
        React.createElement("tbody", Object.assign({}, getTableBodyProps(), { className: "bg-white divide-y divide-gray-200" }), rows.map((row) => {
            prepareRow(row);
            return (React.createElement("tr", Object.assign({}, row.getRowProps()), row.cells.map(cell => (React.createElement("td", Object.assign({}, cell.getCellProps(), { className: "px-6 py-4 whitespace-nowrap" }), cell.render('Cell'))))));
        }))));
};
export default RecommendationsTable;
//# sourceMappingURL=RecommendationTable.js.map
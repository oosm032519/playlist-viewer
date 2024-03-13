"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_table_1 = require("react-table");
// プレイリストの総再生時間と平均曲長を計算する関数
function calculatePlaylistStats(tracks) {
    let totalDurationMs = 0;
    tracks.forEach(track => {
        totalDurationMs += track.audioFeatures.durationMs;
    });
    const averageDurationMs = totalDurationMs / tracks.length;
    return { totalDurationMs, averageDurationMs };
}
// プレイリスト情報を表示するコンポーネント
const PlaylistInfo = ({ playlist }) => {
    const { totalDurationMs, averageDurationMs } = calculatePlaylistStats(playlist.tracks);
    const totalDuration = formatDuration(totalDurationMs);
    const averageDuration = formatDuration(averageDurationMs);
    return (react_1.default.createElement("div", { className: "p-4 bg-primary text-white rounded-md shadow-md" },
        react_1.default.createElement("h2", { className: "text-2xl font-bold mb-2" }, playlist.name),
        react_1.default.createElement("p", { className: "text-lg" },
            "Tracks: ",
            react_1.default.createElement("span", { className: "font-semibold" }, playlist.tracks.length)),
        react_1.default.createElement("p", { className: "text-lg" },
            "Total Duration: ",
            react_1.default.createElement("span", { className: "font-semibold" }, totalDuration)),
        react_1.default.createElement("p", { className: "text-lg" },
            "Average Track Length: ",
            react_1.default.createElement("span", { className: "font-semibold" }, averageDuration))));
};
const formatDuration = (durationMs) => {
    const minutes = Math.floor(durationMs / 60000);
    const seconds = ((durationMs % 60000) / 1000).toFixed(0);
    return minutes + ":" + (parseFloat(seconds) < 10 ? '0' : '') + seconds;
};
// TracksTableコンポーネントにPlaylistInfoコンポーネントを追加
const TracksTable = ({ playlist, setSelectedTrack }) => {
    const data = react_1.default.useMemo(() => playlist.tracks, [playlist]);
    function keyToNote(key) {
        const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
        return notes[key];
    }
    function timeSignatureToString(timeSignature) {
        return timeSignature + "/4";
    }
    const columns = react_1.default.useMemo(() => [
        {
            Header: 'Album',
            accessor: (row) => row.playlistTrack.track.album.images[0].url,
            Cell: ({ value }) => (react_1.default.createElement("img", { src: value, alt: "Album Cover", width: "50", height: "50" })),
            disableSortBy: true,
        },
        { Header: 'Track Name', accessor: 'playlistTrack.track.name' },
        { Header: 'Artist', accessor: 'playlistTrack.track.artists[0].name' },
        {
            Header: 'Duration',
            accessor: 'audioFeatures.durationMs',
            Cell: ({ value }) => (react_1.default.createElement("div", null, formatDuration(value))),
        },
        { Header: 'Popularity', accessor: 'playlistTrack.track.popularity' },
        { Header: 'Tempo', accessor: 'audioFeatures.tempo' },
        {
            Header: 'Time Signature',
            accessor: 'audioFeatures.timeSignature',
            Cell: ({ value }) => timeSignatureToString(value)
        },
        { Header: 'Key', accessor: 'audioFeatures.key', Cell: ({ value }) => keyToNote(value) },
        { Header: 'Mode', accessor: 'audioFeatures.mode' },
        { Header: 'Acousticness', accessor: 'audioFeatures.acousticness' },
        { Header: 'Danceability', accessor: 'audioFeatures.danceability' },
        { Header: 'Energy', accessor: 'audioFeatures.energy' },
        { Header: 'Instrumentalness', accessor: 'audioFeatures.instrumentalness' },
        { Header: 'Liveness', accessor: 'audioFeatures.liveness' },
        { Header: 'Loudness', accessor: 'audioFeatures.loudness' },
        { Header: 'Speechiness', accessor: 'audioFeatures.speechiness' },
        { Header: 'Valence', accessor: 'audioFeatures.valence' },
    ], []);
    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow, } = (0, react_table_1.useTable)({ columns, data }, react_table_1.useSortBy);
    const handleRowClick = (row) => {
        setSelectedTrack(row.original);
    };
    return (react_1.default.createElement("div", null,
        react_1.default.createElement(PlaylistInfo, { playlist: playlist }),
        react_1.default.createElement("div", { className: "whitespace-nowrap overflow-auto h-full w-full divide-y divide-gray-200 shadow-md" },
            react_1.default.createElement("table", Object.assign({}, getTableProps(), { className: "min-w-full divide-y divide-gray-200 shadow-md table-auto" }),
                react_1.default.createElement("thead", { className: "bg-gray-50 sticky top-0 z-10" }, headerGroups.map((headerGroup) => (react_1.default.createElement("tr", Object.assign({}, headerGroup.getHeaderGroupProps()), headerGroup.headers.map((column, i) => (react_1.default.createElement("th", Object.assign({}, column.getHeaderProps(column.getSortByToggleProps()), { className: `px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider h-50 ${i === 0 ? 'sticky left-0 z-10 bg-gray-50' : ''}` }),
                    column.render('Header'),
                    react_1.default.createElement("span", null, column.isSorted
                        ? column.isSortedDesc
                            ? ' ▼'
                            : ' ▲'
                        : '')))))))),
                react_1.default.createElement("tbody", Object.assign({}, getTableBodyProps(), { className: "bg-white divide-y divide-gray-200" }), rows.map((row) => {
                    prepareRow(row);
                    return (react_1.default.createElement("tr", Object.assign({}, row.getRowProps(), { className: "h-50", onClick: () => handleRowClick(row) }), row.cells.map((cell, i) => (react_1.default.createElement("td", Object.assign({}, cell.getCellProps(), { className: `px-6 py-4 whitespace-nowrap ${i === 0 ? 'sticky left-0 z-10 bg-white' : ''}` }), cell.render('Cell'))))));
                }))))));
};
exports.default = TracksTable;
//# sourceMappingURL=TracksTable.js.map
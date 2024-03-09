"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_table_1 = require("react-table");
const TracksTable = ({ playlist }) => {
    const data = react_1.default.useMemo(() => playlist.tracks, [playlist]);
    const columns = react_1.default.useMemo(() => [
        { Header: 'Track Name', accessor: 'playlistTrack.track.name' },
        { Header: 'Artist', accessor: 'playlistTrack.track.artists[0].name' },
        { Header: 'Tempo', accessor: 'audioFeatures.tempo' },
        { Header: 'Time Signature', accessor: 'audioFeatures.timeSignature' },
        { Header: 'Duration (ms)', accessor: 'audioFeatures.durationMs' },
        { Header: 'Key', accessor: 'audioFeatures.key' },
        { Header: 'Mode', accessor: 'audioFeatures.mode' },
        { Header: 'Acousticness', accessor: 'audioFeatures.acousticness' },
        { Header: 'Danceability', accessor: 'audioFeatures.danceability' },
        { Header: 'Energy', accessor: 'audioFeatures.energy' },
        { Header: 'Instrumentalness', accessor: 'audioFeatures.instrumentalness' },
        { Header: 'Liveness', accessor: 'audioFeatures.liveness' },
        { Header: 'Loudness', accessor: 'audioFeatures.loudness' },
        { Header: 'Speechiness', accessor: 'audioFeatures.speechiness' },
        { Header: 'Valence', accessor: 'audioFeatures.valence' },
        { Header: 'Popularity', accessor: 'playlistTrack.track.popularity' },
    ], []);
    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow, } = (0, react_table_1.useTable)({ columns, data }, react_table_1.useSortBy);
    return (react_1.default.createElement("div", { className: "whitespace-nowrap overflow-auto h-full w-full" },
        react_1.default.createElement("table", Object.assign({}, getTableProps(), { className: "min-w-full divide-y divide-gray-200 table-auto" }),
            react_1.default.createElement("thead", { className: "bg-gray-50 sticky top-0 z-10" }, headerGroups.map((headerGroup) => (react_1.default.createElement("tr", Object.assign({}, headerGroup.getHeaderGroupProps()), headerGroup.headers.map((column, i) => (react_1.default.createElement("th", Object.assign({}, column.getHeaderProps(column.getSortByToggleProps()), { className: `px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider h-50 ${i === 0 ? 'sticky left-0 z-10 bg-white' : ''}` }),
                column.render('Header'),
                react_1.default.createElement("span", null, column.isSorted
                    ? column.isSortedDesc
                        ? ' ▼'
                        : ' ▲'
                    : '')))))))),
            react_1.default.createElement("tbody", Object.assign({}, getTableBodyProps(), { className: "bg-white divide-y divide-gray-200" }), rows.map((row) => {
                prepareRow(row);
                return (react_1.default.createElement("tr", Object.assign({}, row.getRowProps(), { className: "h-50" }), row.cells.map((cell, i) => (react_1.default.createElement("td", Object.assign({}, cell.getCellProps(), { className: `px-6 py-4 whitespace-nowrap ${i === 0 ? 'sticky left-0 z-10 bg-white' : ''}` }), cell.render('Cell'))))));
            })))));
};
exports.default = TracksTable;
//# sourceMappingURL=TracksTable.js.map
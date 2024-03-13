"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const react_table_1 = require("react-table");
const PlaylistInfo_1 = __importDefault(require("./PlaylistInfo"));
const utils_1 = require("./utils");
const TracksTable = ({ playlist, setSelectedTrack }) => {
    const data = (0, react_1.useMemo)(() => playlist.tracks, [playlist]);
    const columns = (0, react_1.useMemo)(() => [
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
            Cell: ({ value }) => (react_1.default.createElement("div", null, (0, utils_1.formatDuration)(value))),
        },
        { Header: 'Popularity', accessor: 'playlistTrack.track.popularity' },
        { Header: 'Tempo', accessor: 'audioFeatures.tempo' },
        {
            Header: 'Time Signature',
            accessor: 'audioFeatures.timeSignature',
            Cell: ({ value }) => (0, utils_1.timeSignatureToString)(value)
        },
        { Header: 'Key', accessor: 'audioFeatures.key', Cell: ({ value }) => (0, utils_1.keyToNote)(value) },
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
        react_1.default.createElement(PlaylistInfo_1.default, { playlist: playlist }),
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
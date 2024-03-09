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
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const react_table_1 = require("react-table");
const usePlaylistsTable_1 = require("./usePlaylistsTable");
const PreviewCell = ({ value, row }) => (react_1.default.createElement("a", { href: `https://open.spotify.com/playlist/${row.original.id}`, target: "_blank", rel: "noopener noreferrer" },
    react_1.default.createElement("img", { src: value, alt: "Playlist", style: { width: '50px', height: '50px' } })));
const PlaylistNameCell = ({ row, setSelectedPlaylistId }) => (react_1.default.createElement("div", { onClick: () => {
        console.log('NameCellがクリックされました');
        setSelectedPlaylistId(row.original.id);
    } }, row.values.name));
const columns = (setSelectedPlaylistId) => [
    {
        Header: 'Preview',
        accessor: 'images[0].url',
        Cell: PreviewCell
    },
    {
        Header: 'Playlist Name',
        accessor: 'name',
        Cell: (props) => PlaylistNameCell(Object.assign(Object.assign({}, props), { setSelectedPlaylistId }))
    },
    {
        Header: 'Tracks',
        accessor: 'tracks.total',
    },
    {
        Header: 'Owner',
        accessor: 'owner.displayName',
    },
];
const PlaylistsTable = () => {
    const { playlists, setSelectedPlaylistId } = (0, usePlaylistsTable_1.usePlaylistsTable)();
    const data = (0, react_1.useMemo)(() => playlists, [playlists]);
    const columnData = (0, react_1.useMemo)(() => columns(setSelectedPlaylistId), [setSelectedPlaylistId]);
    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow, } = (0, react_table_1.useTable)({ columns: columnData, data });
    return (react_1.default.createElement("div", { className: "overflow-auto" },
        react_1.default.createElement("table", Object.assign({}, getTableProps(), { className: "w-full table-auto" }),
            react_1.default.createElement("thead", null, headerGroups.map((headerGroup) => (react_1.default.createElement("tr", Object.assign({}, headerGroup.getHeaderGroupProps()), headerGroup.headers.map((column, i) => (react_1.default.createElement("th", Object.assign({}, column.getHeaderProps(), { className: `px-4 py-2 ${i === 0 ? 'sticky left-0' : ''} sticky top-0` }), column.render('Header')))))))),
            react_1.default.createElement("tbody", Object.assign({}, getTableBodyProps()), rows.map((row) => {
                prepareRow(row);
                return (react_1.default.createElement("tr", Object.assign({}, row.getRowProps()), row.cells.map((cell, i) => (react_1.default.createElement("td", Object.assign({}, cell.getCellProps(), { className: `border px-4 py-2 ${i === 0 ? 'sticky left-0' : ''}` }), cell.render('Cell'))))));
            })))));
};
exports.default = PlaylistsTable;
//# sourceMappingURL=PlaylistsTable.js.map
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const react_table_1 = require("react-table");
const CombinedContext_1 = __importDefault(require("./CombinedContext"));
const utils_1 = require("./utils");
const AddedTracksTable = () => {
    const { addedTracks, setMessage, setMessageType } = (0, react_1.useContext)(CombinedContext_1.default);
    const handleTrackAction = (0, react_1.useCallback)((trackId) => __awaiter(void 0, void 0, void 0, function* () {
        console.log(`楽曲${trackId}をプレイリストから削除します`);
        const url = `/java/playlist/removeTrack?trackId=${trackId}`;
        const successMessage = '楽曲がプレイリストから削除されました';
        const errorMessage = '楽曲の削除に失敗しました';
        try {
            const response = yield fetch(url, { method: 'GET' });
            if (response.status === 200) {
                setMessage(successMessage);
                setMessageType('success');
            }
            else {
                setMessage(errorMessage);
                setMessageType('error');
            }
        }
        catch (error) {
            setMessage(errorMessage);
            setMessageType('error');
        }
    }), [setMessage, setMessageType]);
    (0, react_1.useEffect)(() => {
        console.log('AddedTracksTable has been re-rendered due to addedTracks update');
        console.log("addedTracks:", addedTracks);
    }, [addedTracks]);
    const data = react_1.default.useMemo(() => addedTracks, [addedTracks]);
    const columns = react_1.default.useMemo(() => [
        {
            Header: 'Album',
            accessor: (row) => ({
                imageUrl: row.track.album.images[0].url,
                albumUrl: row.track.album.externalUrls.externalUrls.spotify,
            }),
            Cell: ({ value }) => (react_1.default.createElement("a", { href: value.albumUrl, target: "_blank", rel: "noopener noreferrer" },
                react_1.default.createElement("img", { src: value.imageUrl, alt: "Album Cover", width: "50", height: "50" }))),
            disableSortBy: true,
        },
        {
            Header: 'Track Name',
            accessor: 'track.name',
            Cell: ({ row, value }) => (react_1.default.createElement("a", { href: `https://open.spotify.com/track/${row.original.id}`, target: "_blank", rel: "noopener noreferrer" }, value)),
        },
        {
            Header: 'Artist',
            accessor: 'track.artists[0].name',
            Cell: ({ row, value }) => (react_1.default.createElement("a", { href: row.original.track.artists[0].externalUrls.externalUrls.spotify, target: "_blank", rel: "noopener noreferrer" }, value)),
        },
        {
            Header: 'Duration',
            accessor: 'track.durationMs',
            Cell: ({ value }) => (react_1.default.createElement("div", null, (0, utils_1.formatDuration)(value))),
        },
        {
            Header: 'Popularity',
            accessor: 'track.popularity',
            Cell: ({ value }) => (react_1.default.createElement("div", null, value)),
        },
        {
            Header: 'Action',
            accessor: 'track.id',
            Cell: ({ value }) => (react_1.default.createElement("div", { className: "flex justify-around" },
                react_1.default.createElement("button", { onClick: () => handleTrackAction(value), className: `flex justify-center items-center px-4 py-2 min-w-28 rounded-md text-white transition-colors duration-300 bg-red-500 hover:bg-red-700` }, "Remove"))),
            disableSortBy: true,
        },
    ], [addedTracks]);
    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow, } = (0, react_table_1.useTable)({ columns, data }, react_table_1.useSortBy);
    return (react_1.default.createElement("div", { className: "whitespace-nowrap overflow-auto h-full w-full divide-y divide-gray-200 shadow-md" },
        react_1.default.createElement("table", Object.assign({}, getTableProps(), { className: "overflow-auto h-full w-full divide-y divide-gray-200 shadow-md table-auto" }),
            react_1.default.createElement("thead", { className: "bg-gray-50" }, headerGroups.map((headerGroup) => (react_1.default.createElement("tr", Object.assign({}, headerGroup.getHeaderGroupProps()), headerGroup.headers.map((column, i) => (react_1.default.createElement("th", Object.assign({}, column.getHeaderProps(column.getSortByToggleProps()), { className: `px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider h-50 ${i === 0 ? 'sticky left-0 z-10 bg-gray-50' : ''}` }),
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
exports.default = AddedTracksTable;
//# sourceMappingURL=AddedTracksTable.js.map
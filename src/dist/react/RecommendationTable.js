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
const useApi_1 = require("./useApi");
const PlaylistIdContext_1 = __importDefault(require("./PlaylistIdContext"));
const RecommendationsTable = ({ playlist, setMessage, setMessageType }) => {
    const playlistId = (0, react_1.useContext)(PlaylistIdContext_1.default);
    const [recommendations, setRecommendations] = (0, react_1.useState)([]);
    const { fetchRecommendations } = (0, useApi_1.useApi)();
    const [trackStatus, setTrackStatus] = (0, react_1.useState)({});
    const [, setShowPlaylists] = (0, react_1.useState)(false);
    const handleTrackAction = (0, react_1.useCallback)((trackId, action) => __awaiter(void 0, void 0, void 0, function* () {
        console.log(`楽曲${trackId}をプレイリスト${playlistId.playlistId}に${action === 'add' ? '追加' : '削除'}します`);
        const actionMap = {
            add: {
                url: `/java/playlist/addTrack?trackId=${trackId}&playlistId=${playlistId.playlistId}`,
                successMessage: '楽曲がプレイリストに追加されました',
                errorMessage: '楽曲の追加に失敗しました',
                statusUpdate: true
            },
            remove: {
                url: `/java/playlist/removeTrack?trackId=${trackId}&playlistId=${playlistId.playlistId}`,
                successMessage: '楽曲がプレイリストから削除されました',
                errorMessage: '楽曲の削除に失敗しました',
                statusUpdate: false
            }
        };
        try {
            const response = yield fetch(actionMap[action].url, { method: 'GET' });
            if (response.status === 200) {
                setMessage(actionMap[action].successMessage);
                setMessageType('success');
                setTrackStatus(prevStatus => (Object.assign(Object.assign({}, prevStatus), { [trackId]: actionMap[action].statusUpdate })));
            }
            else {
                setMessage(actionMap[action].errorMessage);
                setMessageType('error');
            }
        }
        catch (error) {
            setMessage(actionMap[action].errorMessage);
            setMessageType('error');
        }
    }), [playlistId, setMessage, setMessageType]);
    const fetchAndSetRecommendations = (0, react_1.useCallback)(() => {
        fetchRecommendations(playlist.tracks)
            .then(data => {
            setRecommendations(data);
        })
            .catch(error => console.error(error));
    }, [fetchRecommendations, playlist]);
    (0, react_1.useEffect)(() => {
        fetchAndSetRecommendations();
    }, [fetchAndSetRecommendations, setShowPlaylists]);
    const data = react_1.default.useMemo(() => recommendations, [recommendations]);
    const columns = react_1.default.useMemo(() => [
        { Header: 'Track Name', accessor: 'name' },
        { Header: 'Artist', accessor: 'artists[0].name' },
        {
            Header: 'Actions',
            accessor: 'id',
            Cell: ({ row }) => (react_1.default.createElement("div", null,
                react_1.default.createElement("button", { onClick: () => handleTrackAction(row.values.id, 'add') }, "+"),
                react_1.default.createElement("button", { onClick: () => handleTrackAction(row.values.id, 'remove') }, "-"))),
        },
    ], [handleTrackAction]);
    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow, } = (0, react_table_1.useTable)({ columns, data });
    return (react_1.default.createElement("table", Object.assign({}, getTableProps(), { className: "min-w-full divide-y divide-gray-200" }),
        react_1.default.createElement("thead", { className: "bg-gray-50" }, headerGroups.map((headerGroup) => (react_1.default.createElement("tr", Object.assign({}, headerGroup.getHeaderGroupProps()), headerGroup.headers.map(column => (react_1.default.createElement("th", Object.assign({}, column.getHeaderProps(), { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" }), column.render('Header')))))))),
        react_1.default.createElement("tbody", Object.assign({}, getTableBodyProps(), { className: "bg-white divide-y divide-gray-200" }), rows.map((row) => {
            prepareRow(row);
            return (react_1.default.createElement("tr", Object.assign({}, row.getRowProps(), { style: { backgroundColor: trackStatus[row.original.id] ? 'lightgreen' : 'white' } }), row.cells.map(cell => (react_1.default.createElement("td", Object.assign({}, cell.getCellProps(), { className: "px-6 py-4 whitespace-nowrap" }), cell.render('Cell'))))));
        }))));
};
exports.default = RecommendationsTable;
//# sourceMappingURL=RecommendationTable.js.map
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useTable } from 'react-table';
import { useApi } from './useApi';
import PlaylistIdContext from './PlaylistIdContext';
const RecommendationsTable = ({ playlist, setMessage, setMessageType }) => {
    const playlistId = useContext(PlaylistIdContext);
    const [recommendations, setRecommendations] = useState([]);
    const { fetchRecommendations } = useApi();
    const [trackStatus, setTrackStatus] = useState({});
    const [, setShowPlaylists] = useState(false);
    const handleTrackAction = useCallback((trackId, action) => __awaiter(void 0, void 0, void 0, function* () {
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
    const fetchAndSetRecommendations = useCallback(() => {
        fetchRecommendations(playlist.tracks)
            .then(data => {
            setRecommendations(data);
        })
            .catch(error => console.error(error));
    }, [fetchRecommendations, playlist]);
    useEffect(() => {
        fetchAndSetRecommendations();
    }, [fetchAndSetRecommendations, setShowPlaylists]);
    const data = React.useMemo(() => recommendations, [recommendations]);
    const columns = React.useMemo(() => [
        { Header: 'Track Name', accessor: 'name' },
        { Header: 'Artist', accessor: 'artists[0].name' },
        {
            Header: 'Actions',
            accessor: 'id',
            Cell: ({ row }) => (React.createElement("div", null,
                React.createElement("button", { onClick: () => handleTrackAction(row.values.id, 'add') }, "+"),
                React.createElement("button", { onClick: () => handleTrackAction(row.values.id, 'remove') }, "-"))),
        },
    ], [handleTrackAction]);
    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow, } = useTable({ columns, data });
    return (React.createElement("table", Object.assign({}, getTableProps(), { className: "min-w-full divide-y divide-gray-200" }),
        React.createElement("thead", { className: "bg-gray-50" }, headerGroups.map((headerGroup) => (React.createElement("tr", Object.assign({}, headerGroup.getHeaderGroupProps()), headerGroup.headers.map(column => (React.createElement("th", Object.assign({}, column.getHeaderProps(), { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" }), column.render('Header')))))))),
        React.createElement("tbody", Object.assign({}, getTableBodyProps(), { className: "bg-white divide-y divide-gray-200" }), rows.map((row) => {
            prepareRow(row);
            return (React.createElement("tr", Object.assign({}, row.getRowProps(), { style: { backgroundColor: trackStatus[row.original.id] ? 'lightgreen' : 'white' } }), row.cells.map(cell => (React.createElement("td", Object.assign({}, cell.getCellProps(), { className: "px-6 py-4 whitespace-nowrap" }), cell.render('Cell'))))));
        }))));
};
export default RecommendationsTable;
//# sourceMappingURL=RecommendationTable.js.map
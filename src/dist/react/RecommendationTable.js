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
    const addTrackToPlaylist = (trackId, playlistId) => __awaiter(void 0, void 0, void 0, function* () {
        console.log('addTrackToPlaylistが呼び出されました');
        try {
            const response = yield fetch(`/java/playlist/addTrack?trackId=${trackId}&playlistId=${playlistId}`, {
                method: 'GET',
            });
            if (response.status === 200) {
                const data = yield response.text();
                console.log('Track added successfully:', data);
                setMessage('楽曲がプレイリストに追加されました');
                setMessageType('success');
                setTrackStatus(prevStatus => (Object.assign(Object.assign({}, prevStatus), { [trackId]: true })));
            }
            else {
                console.error('Error adding track:', response.status);
                setMessage('楽曲の追加に失敗しました');
                setMessageType('error');
            }
        }
        catch (error) {
            console.error('Error adding track:', error);
            setMessage('楽曲の追加に失敗しました');
            setMessageType('error');
        }
    });
    const removeTrackFromPlaylist = (trackId, playlistId) => __awaiter(void 0, void 0, void 0, function* () {
        console.log('removeTrackFromPlaylistが呼び出されました');
        try {
            const response = yield fetch(`/java/playlist/removeTrack?trackId=${trackId}&playlistId=${playlistId}`, {
                method: 'GET',
            });
            if (response.status === 200) {
                const data = yield response.text();
                console.log('Track removed successfully:', data);
                setMessage('楽曲がプレイリストから削除されました');
                setMessageType('success');
                setTrackStatus(prevStatus => (Object.assign(Object.assign({}, prevStatus), { [trackId]: false })));
            }
            else {
                console.error('Error removing track:', response.status);
                setMessage('楽曲の削除に失敗しました');
                setMessageType('error');
            }
        }
        catch (error) {
            console.error('Error removing track:', error);
            setMessage('楽曲の削除に失敗しました');
            setMessageType('error');
        }
    });
    const fetchAndSetRecommendations = useCallback(() => {
        fetchRecommendations(playlist.tracks)
            .then(data => {
            setRecommendations(data);
        })
            .catch(error => console.error(error));
    }, [fetchRecommendations, playlist]);
    useEffect(() => {
        fetchAndSetRecommendations();
    }, [fetchAndSetRecommendations]);
    const data = React.useMemo(() => recommendations, [recommendations]);
    const columns = React.useMemo(() => [
        { Header: 'Track Name', accessor: 'name' },
        { Header: 'Artist', accessor: 'artists[0].name' },
        {
            Header: 'Actions',
            accessor: 'id',
            Cell: ({ row }) => (React.createElement("div", null,
                React.createElement("button", { onClick: () => {
                        console.log('Plus button clicked for', row.values.name);
                        console.log('Playlist ID:', playlistId);
                        addTrackToPlaylist(row.values.id, playlistId.playlistId);
                    } }, "+"),
                React.createElement("button", { onClick: () => {
                        console.log('Minus button clicked for', row.values.name);
                        console.log('Playlist ID:', playlistId);
                        removeTrackFromPlaylist(row.values.id, playlistId.playlistId);
                    } }, "-"))),
        },
    ], [playlistId]);
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
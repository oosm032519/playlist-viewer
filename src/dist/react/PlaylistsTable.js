var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import React, { useContext, useEffect, useState } from 'react';
import CombinedContext from './CombinedContext';
import { useTable } from 'react-table';
import { useApi } from './useApi';
const PlaylistsTable = () => {
    const { playlists, setShowTracks, setShowPlaylists, setIsLoading } = useContext(CombinedContext);
    const { fetchPlaylistById } = useApi();
    const [selectedPlaylistId, setSelectedPlaylistId] = useState(null);
    useEffect(() => {
        const fetchAndSetPlaylist = () => __awaiter(void 0, void 0, void 0, function* () {
            if (selectedPlaylistId) {
                setIsLoading(true);
                yield fetchPlaylistById(selectedPlaylistId);
                setIsLoading(false);
                setShowTracks(true);
                setShowPlaylists(false);
            }
        });
        fetchAndSetPlaylist();
    }, [selectedPlaylistId, fetchPlaylistById, setShowTracks, setShowPlaylists]);
    const data = React.useMemo(() => playlists, [playlists]);
    const columns = React.useMemo(() => [
        {
            Header: 'Preview',
            accessor: 'images[0].url',
            Cell: ({ value, row }) => (React.createElement("a", { href: `https://open.spotify.com/playlist/${row.original.id}`, target: "_blank", rel: "noopener noreferrer" },
                React.createElement("img", { src: value, alt: "Playlist", style: { width: '50px', height: '50px' } })))
        },
        {
            Header: 'Playlist Name',
            accessor: 'name',
            Cell: ({ row }) => (React.createElement("div", { onClick: () => setSelectedPlaylistId(row.original.id) }, row.values.name)),
        },
        {
            Header: 'Tracks',
            accessor: 'tracks.total',
        },
        {
            Header: 'Owner',
            accessor: 'owner.displayName',
        },
    ], [setSelectedPlaylistId]);
    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow, } = useTable({ columns, data });
    return (React.createElement("table", Object.assign({}, getTableProps(), { className: "w-full table-auto" }),
        React.createElement("thead", null, headerGroups.map((headerGroup) => (React.createElement("tr", Object.assign({}, headerGroup.getHeaderGroupProps()), headerGroup.headers.map(column => (React.createElement("th", Object.assign({}, column.getHeaderProps(), { className: "px-4 py-2" }), column.render('Header')))))))),
        React.createElement("tbody", Object.assign({}, getTableBodyProps()), rows.map((row) => {
            prepareRow(row);
            return (React.createElement("tr", Object.assign({}, row.getRowProps()), row.cells.map(cell => (React.createElement("td", Object.assign({}, cell.getCellProps(), { className: "border px-4 py-2" }), cell.render('Cell'))))));
        }))));
};
export default PlaylistsTable;
//# sourceMappingURL=PlaylistsTable.js.map
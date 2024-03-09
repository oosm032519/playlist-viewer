import React, { useMemo } from 'react';
import { useTable } from 'react-table';
import { usePlaylistsTable } from './usePlaylistsTable';
const PreviewCell = ({ value, row }) => (React.createElement("a", { href: `https://open.spotify.com/playlist/${row.original.id}`, target: "_blank", rel: "noopener noreferrer" },
    React.createElement("img", { src: value, alt: "Playlist", style: { width: '50px', height: '50px' } })));
const PlaylistNameCell = ({ row, setSelectedPlaylistId }) => (React.createElement("div", { onClick: () => {
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
    const { playlists, setSelectedPlaylistId } = usePlaylistsTable();
    const data = useMemo(() => playlists, [playlists]);
    const columnData = useMemo(() => columns(setSelectedPlaylistId), [setSelectedPlaylistId]);
    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow, } = useTable({ columns: columnData, data });
    return (React.createElement("table", Object.assign({}, getTableProps(), { className: "w-full table-auto" }),
        React.createElement("thead", null, headerGroups.map((headerGroup) => (React.createElement("tr", Object.assign({}, headerGroup.getHeaderGroupProps()), headerGroup.headers.map(column => (React.createElement("th", Object.assign({}, column.getHeaderProps(), { className: "px-4 py-2" }), column.render('Header')))))))),
        React.createElement("tbody", Object.assign({}, getTableBodyProps()), rows.map((row) => {
            prepareRow(row);
            return (React.createElement("tr", Object.assign({}, row.getRowProps()), row.cells.map(cell => (React.createElement("td", Object.assign({}, cell.getCellProps(), { className: "border px-4 py-2" }), cell.render('Cell'))))));
        }))));
};
export default PlaylistsTable;
//# sourceMappingURL=PlaylistsTable.js.map
import React, { useContext } from 'react';
import PlaylistContext from './PlaylistContext';
import { useTable } from 'react-table';
const UserPlaylistTable = () => {
    const { playlists } = useContext(PlaylistContext);
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
        },
        {
            Header: 'Tracks',
            accessor: 'tracks.total',
        },
        {
            Header: 'Owner',
            accessor: 'owner.displayName',
        },
    ], []);
    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow, } = useTable({ columns, data });
    return (React.createElement("table", Object.assign({}, getTableProps(), { className: "w-full table-auto" }),
        React.createElement("thead", null, headerGroups.map((headerGroup) => (React.createElement("tr", Object.assign({}, headerGroup.getHeaderGroupProps()), headerGroup.headers.map(column => (React.createElement("th", Object.assign({}, column.getHeaderProps(), { className: "px-4 py-2" }), column.render('Header')))))))),
        React.createElement("tbody", Object.assign({}, getTableBodyProps()), rows.map((row) => {
            prepareRow(row);
            return (React.createElement("tr", Object.assign({}, row.getRowProps()), row.cells.map(cell => (React.createElement("td", Object.assign({}, cell.getCellProps(), { className: "border px-4 py-2" }), cell.render('Cell'))))));
        }))));
};
export default UserPlaylistTable;
//# sourceMappingURL=UserPlaylistTable.js.map
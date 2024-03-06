import React, {useContext} from 'react';
import PlaylistContext from './PlaylistContext';
import {useTable} from 'react-table';

const UserPlaylistTable = () => {
    const {playlists} = useContext(PlaylistContext);
    const data = React.useMemo(() => playlists, [playlists]);
    const columns = React.useMemo(() => [
        {
            Header: 'Playlist Name',
            accessor: 'name',
        },
        {
            Header: 'Owner',
            accessor: 'owner.displayName',
        },
    ], []);

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable({ columns, data });

    return (
        <table {...getTableProps()} className="w-full table-auto">
            <thead>
                {headerGroups.map((headerGroup: { getHeaderGroupProps: () => React.JSX.IntrinsicAttributes & React.ClassAttributes<HTMLTableRowElement> & React.HTMLAttributes<HTMLTableRowElement>; headers: any[]; }) => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map(column => (
                            <th {...column.getHeaderProps()} className="px-4 py-2">{column.render('Header')}</th>
                        ))}
                    </tr>
                ))}
            </thead>
            <tbody {...getTableBodyProps()}>
                {rows.map((row: { getRowProps: () => React.JSX.IntrinsicAttributes & React.ClassAttributes<HTMLTableRowElement> & React.HTMLAttributes<HTMLTableRowElement>; cells: any[]; }) => {
                    prepareRow(row);
                    return (
                        <tr {...row.getRowProps()}>
                            {row.cells.map(cell => (
                                <td {...cell.getCellProps()} className="border px-4 py-2">{cell.render('Cell')}</td>
                            ))}
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
};

export default UserPlaylistTable;

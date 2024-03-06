import React, {useContext} from 'react';
import CombinedContext from './CombinedContext';
import {useTable} from 'react-table';

const PlaylistsTable = () => {
    const {playlists} = useContext(CombinedContext);
    const data = React.useMemo(() => playlists, [playlists]);
    const columns = React.useMemo(() => [
        {
            Header: 'Preview',
            accessor: 'images[0].url',
            Cell: ({value, row}: { value: string, row: any }) => (
                <a href={`https://open.spotify.com/playlist/${row.original.id}`} target="_blank"
                   rel="noopener noreferrer">
                    <img src={value} alt="Playlist" style={{width: '50px', height: '50px'}}/>
                </a>
            )
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

export default PlaylistsTable;

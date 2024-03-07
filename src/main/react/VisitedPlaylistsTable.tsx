import React, {useContext, useEffect} from 'react';
import {useTable} from 'react-table';
import CombinedContext from './CombinedContext';
import {useApi} from './useApi';

const VisitedPlaylistsTable: React.FC = () => {
    const {visitedPlaylists, setShowTracks, setShowPlaylists, setIsLoading} = useContext(CombinedContext);
    const {fetchPlaylistById} = useApi();

    useEffect(() => {
        console.log('visitedPlaylists:', visitedPlaylists);
    }, [visitedPlaylists]);

    const data = React.useMemo(() => visitedPlaylists, [visitedPlaylists]);
    const columns = React.useMemo(() => [
        {
            Header: 'Playlist Name',
            accessor: 'name',
            Cell: ({row}: { row: any }) => (
                <div onClick={async () => {
                    setIsLoading(true);
                    try {
                        await fetchPlaylistById(row.original.id);
                        setShowTracks(true);
                        setShowPlaylists(false);
                    } catch (error) {
                        console.error(error);
                    } finally {
                        setIsLoading(false);
                    }
                }}>
                    {row.values.name}
                </div>
            ),
        },
        {
            Header: 'ID',
            accessor: 'id',
        },
    ], [fetchPlaylistById, setIsLoading, setShowTracks, setShowPlaylists]);

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable({columns, data});

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

export default VisitedPlaylistsTable;

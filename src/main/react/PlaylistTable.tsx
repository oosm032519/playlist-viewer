import React from 'react';
import {useTable, useSortBy} from 'react-table';

const PlaylistTable = ({playlist}: { playlist: { name: string, tracks: any[] } }) => {
    const data = React.useMemo(() => playlist.tracks, [playlist.tracks]);
    
    const columns = React.useMemo(() => [
        { Header: 'Track Name', accessor: 'playlistTrack.track.name' },
        { Header: 'Artist', accessor: 'playlistTrack.track.artists[0].name' },
        { Header: 'Tempo', accessor: 'audioFeatures.tempo' },
        { Header: 'Time Signature', accessor: 'audioFeatures.timeSignature' },
        { Header: 'Duration (ms)', accessor: 'audioFeatures.durationMs' },
        { Header: 'Key', accessor: 'audioFeatures.key' },
        { Header: 'Mode', accessor: 'audioFeatures.mode' },
        { Header: 'Acousticness', accessor: 'audioFeatures.acousticness' },
        { Header: 'Danceability', accessor: 'audioFeatures.danceability' },
        { Header: 'Energy', accessor: 'audioFeatures.energy' },
        { Header: 'Instrumentalness', accessor: 'audioFeatures.instrumentalness' },
        { Header: 'Liveness', accessor: 'audioFeatures.liveness' },
        { Header: 'Loudness', accessor: 'audioFeatures.loudness' },
        { Header: 'Speechiness', accessor: 'audioFeatures.speechiness' },
        { Header: 'Valence', accessor: 'audioFeatures.valence' },
        { Header: 'Popularity', accessor: 'playlistTrack.track.popularity' },
    ], []);
    
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable({columns, data}, useSortBy);
    
    return (
        <table {...getTableProps()} className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
            {headerGroups.map((headerGroup: { getHeaderGroupProps: () => React.JSX.IntrinsicAttributes & React.ClassAttributes<HTMLTableRowElement> & React.HTMLAttributes<HTMLTableRowElement>; headers: any[]; }) => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map(column => (
                        <th {...column.getHeaderProps(column.getSortByToggleProps())}
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider h-50">
                            {column.render('Header')}
                            <span>
                                {column.isSorted
                                    ? column.isSortedDesc
                                        ? ' ▼'
                                        : ' ▲'
                                    : ''}
                            </span>
                        </th>
                    ))}
                </tr>
            ))}
            </thead>
            <tbody {...getTableBodyProps()} className="bg-white divide-y divide-gray-200">
            {rows.map((row: { getRowProps: () => React.JSX.IntrinsicAttributes & React.ClassAttributes<HTMLTableRowElement> & React.HTMLAttributes<HTMLTableRowElement>; cells: any[]; }) => {
                prepareRow(row);
                return (
                    <tr {...row.getRowProps()} className="h-50">
                        {row.cells.map(cell => (
                            <td {...cell.getCellProps()} className="px-6 py-4 whitespace-nowrap">
                                {cell.render('Cell')}
                            </td>
                        ))}
                    </tr>
                );
            })}
            </tbody>
        </table>
    );
};

export default PlaylistTable;

import React from 'react';
import {useTable, useSortBy} from 'react-table';

const TracksTable = ({playlist, setSelectedTrack}: {
    playlist: { name: string, tracks: any[] },
    setSelectedTrack: (track: any) => void
}) => {
    const data = React.useMemo(() => playlist.tracks, [playlist]);
    
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
    
    const handleRowClick = (row: {
        [x: string]: any;
        getRowProps?: () => React.JSX.IntrinsicAttributes & React.ClassAttributes<HTMLTableRowElement> & React.HTMLAttributes<HTMLTableRowElement>;
        cells?: any[];
        original?: any;
    }) => {
        setSelectedTrack(row.original);
    };
    
    return (
        <div className="whitespace-nowrap overflow-auto h-full w-full divide-y divide-gray-200 shadow-md">
            <table {...getTableProps()} className="min-w-full divide-y divide-gray-200 shadow-md table-auto">
                <thead className="bg-gray-50 sticky top-0 z-10">
                {headerGroups.map((headerGroup: {
                    getHeaderGroupProps: () => React.JSX.IntrinsicAttributes & React.ClassAttributes<HTMLTableRowElement> & React.HTMLAttributes<HTMLTableRowElement>;
                    headers: any[];
                }) => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map((column, i) => (
                            <th {...column.getHeaderProps(column.getSortByToggleProps())}
                                className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider h-50 ${i === 0 ? 'sticky left-0 z-10 bg-white' : ''}`}>
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
                {rows.map((row: {
                    [x: string]: any;
                    getRowProps: () => React.JSX.IntrinsicAttributes & React.ClassAttributes<HTMLTableRowElement> & React.HTMLAttributes<HTMLTableRowElement>;
                    cells: any[];
                }) => {
                    prepareRow(row);
                    return (
                        <tr {...row.getRowProps()} className="h-50" onClick={() => handleRowClick(row)}>
                            {row.cells.map((cell, i) => (
                                <td {...cell.getCellProps()}
                                    className={`px-6 py-4 whitespace-nowrap ${i === 0 ? 'sticky left-0 z-10 bg-white' : ''}`}>
                                    {cell.render('Cell')}
                                </td>
                            ))}
                        </tr>
                    );
                })}
                </tbody>
            </table>
        </div>
    );
};

export default TracksTable;

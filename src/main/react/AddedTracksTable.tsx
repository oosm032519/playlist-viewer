import React, {useContext, useCallback, useEffect} from 'react';
import {useTable, useSortBy} from 'react-table';
import CombinedContext from './CombinedContext';
import {formatDuration} from './utils'

const AddedTracksTable: React.FC = () => {
    const {addedTracks, setMessage, setMessageType} = useContext(CombinedContext);
    
    const handleTrackAction = useCallback(async (trackId: string) => {
        console.log(`楽曲${trackId}をプレイリストから削除します`);
        const url = `/java/playlist/removeTrack?trackId=${trackId}`;
        const successMessage = '楽曲がプレイリストから削除されました';
        const errorMessage = '楽曲の削除に失敗しました';
        
        try {
            const response = await fetch(url, {method: 'GET'});
            if (response.status === 200) {
                setMessage(successMessage);
                setMessageType('success');
            } else {
                setMessage(errorMessage);
                setMessageType('error');
            }
        } catch (error) {
            setMessage(errorMessage);
            setMessageType('error');
        }
    }, [setMessage, setMessageType]);
    
    useEffect(() => {
        console.log('AddedTracksTable has been re-rendered due to addedTracks update');
        console.log("addedTracks:", addedTracks);
    }, [addedTracks]);
    
    const data = React.useMemo(() => addedTracks, [addedTracks]);
    
    const columns = React.useMemo(() => [
        {
            Header: 'Album',
            accessor: (row: {
                track: { album: { images: { url: any; }[]; externalUrls: { externalUrls: { spotify: any; }; }; }; };
            }) => ({
                imageUrl: row.track.album.images[0].url,
                albumUrl: row.track.album.externalUrls.externalUrls.spotify,
            }),
            Cell: ({value}: { value: { imageUrl: string, albumUrl: string } }) => (
                <a href={value.albumUrl} target="_blank" rel="noopener noreferrer">
                    <img src={value.imageUrl} alt="Album Cover" width="50" height="50"/>
                </a>
            ),
            disableSortBy: true,
        },
        {
            Header: 'Track Name',
            accessor: 'track.name',
            Cell: ({row, value}: { row: { original: { id: string } }, value: string }) => (
                <a href={`https://open.spotify.com/track/${row.original.id}`} target="_blank" rel="noopener noreferrer">
                    {value}
                </a>
            ),
        },
        {
            Header: 'Artist',
            accessor: 'track.artists[0].name',
            Cell: ({row, value}: { row: { original: {
                [x: string]: any; artists: any[]
                    } }, value: string }) => (
                <a href={row.original.track.artists[0].externalUrls.externalUrls.spotify} target="_blank"
                   rel="noopener noreferrer">
                    {value}
                </a>
            ),
        },
        {
            Header: 'Duration',
            accessor: 'track.durationMs',
            Cell: ({value}: { value: number }) => (
                <div>{formatDuration(value)}</div>
            ),
        },
        {
            Header: 'Popularity',
            accessor: 'track.popularity',
            Cell: ({value}: { value: number }) => (
                <div>{value}</div>
            ),
        },
        {
            Header: 'Action',
            accessor: 'track.id',
            Cell: ({value}: { value: string }) => (
                <div className="flex justify-around">
                    <button onClick={() => handleTrackAction(value)}
                            className={`flex justify-center items-center px-4 py-2 min-w-28 rounded-md text-white transition-colors duration-300 bg-red-500 hover:bg-red-700`}>
                        Remove
                    </button>
                </div>
            ),
            disableSortBy: true,
        },
    ], [addedTracks]);
    
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable({columns, data}, useSortBy);
    
    return (
        <div className="whitespace-nowrap overflow-auto h-full w-full divide-y divide-gray-200 shadow-md">
            <table {...getTableProps()}
                   className="overflow-auto h-full w-full divide-y divide-gray-200 shadow-md table-auto">
                <thead className="bg-gray-50">
                {
                    headerGroups.map((headerGroup: { getHeaderGroupProps: () => React.JSX.IntrinsicAttributes & React.ClassAttributes<HTMLTableRowElement> & React.HTMLAttributes<HTMLTableRowElement>; headers: any[]; }) => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map((column, i) => (
                                <th {...column.getHeaderProps(column.getSortByToggleProps())}
                                    className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider h-50 ${i === 0 ? 'sticky left-0 z-10 bg-gray-50' : ''}`}>
                                    {column.render('Header')}
                                    <span>
                                        {
                                            column.isSorted
                                                ? column.isSortedDesc
                                                    ? ' ▼'
                                                    : ' ▲'
                                                : ''
                                        }
                                    </span>
                                </th>
                            ))}
                        </tr>
                    ))
                }
                </thead>
                <tbody {...getTableBodyProps()} className="bg-white divide-y divide-gray-200">
                {
                    rows.map((row: { getRowProps: () => React.JSX.IntrinsicAttributes & React.ClassAttributes<HTMLTableRowElement> & React.HTMLAttributes<HTMLTableRowElement>; cells: any[]; }) => {
                        prepareRow(row);
                        return (
                            <tr {...row.getRowProps()} className="h-50">
                                {row.cells.map((cell, i) => (
                                    <td {...cell.getCellProps()}
                                        className={`px-6 py-4 whitespace-nowrap ${i === 0 ? 'sticky left-0 z-10 bg-white' : ''}`}>
                                        {cell.render('Cell')}
                                    </td>
                                ))}
                            </tr>
                        );
                    })
                }
                </tbody>
            </table>
        </div>
    );
};

export default AddedTracksTable;

import React, {useCallback, useContext, useEffect, useState} from 'react';
import {useTable} from 'react-table';
import {useApi} from './useApi'
import PlaylistIdContext from './PlaylistIdContext';


const RecommendationsTable = ({playlist}: { playlist: { name: string, tracks: any[] } }) => {
    const playlistId = useContext(PlaylistIdContext);
    const [recommendations, setRecommendations] = useState([]);
    const {fetchRecommendations} = useApi();
    
    const addTrackToPlaylist = async (trackId: string, playlistId: string) => {
        console.log('addTrackToPlaylistが呼び出されました');
        await fetch(`/java/playlist/addTrack?trackId=${trackId}&playlistId=${playlistId}`, {
            method: 'GET',
        })
            .then(async response => {
                const data = await response.text();
                console.log('Track added successfully:', data);
                return data;
            })
            .catch(error => {
                console.error('Error adding track:', error);
            });
    };
    
    const removeTrackFromPlaylist = async (trackId: string, playlistId: string) => {
        console.log('removeTrackFromPlaylistが呼び出されました');
        await fetch(`/java/playlist/removeTrack?trackId=${trackId}&playlistId=${playlistId}`, {
            method: 'GET',
        })
            .then(async response => {
                const data = await response.text();
                console.log('Track removed successfully:', data);
                return data;
            })
            .catch(error => {
                console.error('Error removing track:', error);
            });
    };

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
            Cell: ({row}: { row: any }) => (
                <div>
                    <button onClick={() => {
                        console.log('Plus button clicked for', row.values.name);
                        console.log('Playlist ID:', playlistId);
                        addTrackToPlaylist(row.values.id, playlistId.playlistId);
                    }}>+
                    </button>
                    <button onClick={() => {
                        console.log('Minus button clicked for', row.values.name);
                        console.log('Playlist ID:', playlistId);
                        removeTrackFromPlaylist(row.values.id, playlistId.playlistId);
                    }}>-
                    </button>
                </div>
            ),
        },
    ], [playlistId]);

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable({ columns, data });

    return (
        <table {...getTableProps()} className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
            {headerGroups.map((headerGroup: { getHeaderGroupProps: () => React.JSX.IntrinsicAttributes & React.ClassAttributes<HTMLTableRowElement> & React.HTMLAttributes<HTMLTableRowElement>; headers: any[]; }) => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map(column => (
                        <th {...column.getHeaderProps()} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {column.render('Header')}
                        </th>
                    ))}
                </tr>
            ))}
            </thead>
            <tbody {...getTableBodyProps()} className="bg-white divide-y divide-gray-200">
            {rows.map((row: { getRowProps: () => React.JSX.IntrinsicAttributes & React.ClassAttributes<HTMLTableRowElement> & React.HTMLAttributes<HTMLTableRowElement>; cells: any[]; }) => {
                prepareRow(row);
                return (
                    <tr {...row.getRowProps()}>
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

export default RecommendationsTable;

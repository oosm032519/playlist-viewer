import React, {Dispatch, SetStateAction, useCallback, useContext, useEffect, useState} from 'react';
import {useTable} from 'react-table';
import {useApi} from './useApi'
import PlaylistIdContext from './PlaylistIdContext';

type RecommendationsTableProps = {
    playlist: { name: string, tracks: any[] },
    setMessage: Dispatch<SetStateAction<string | null>>,
    setMessageType: Dispatch<SetStateAction<'success' | 'error' | null>>
};

const RecommendationsTable: React.FC<RecommendationsTableProps> = ({playlist, setMessage, setMessageType}) => {
    const playlistId = useContext(PlaylistIdContext);
    const [recommendations, setRecommendations] = useState([]);
    const {fetchRecommendations} = useApi();
    const [trackStatus, setTrackStatus] = useState<{ [key: string]: boolean }>({});
    const [, setShowPlaylists] = useState(false);
    
    const addTrackToPlaylist = async (trackId: string, playlistId: string) => {
        console.log('addTrackToPlaylistが呼び出されました');
        try {
            const response = await fetch(`/java/playlist/addTrack?trackId=${trackId}&playlistId=${playlistId}`, {
                method: 'GET',
            });
            if (response.status === 200) {
                const data = await response.text();
                console.log('Track added successfully:', data);
                setMessage('楽曲がプレイリストに追加されました');
                setMessageType('success');
                setTrackStatus(prevStatus => ({...prevStatus, [trackId]: true}));
            } else {
                console.error('Error adding track:', response.status);
                setMessage('楽曲の追加に失敗しました');
                setMessageType('error');
            }
        } catch (error) {
            console.error('Error adding track:', error);
            setMessage('楽曲の追加に失敗しました');
            setMessageType('error');
        }
    };
    
    const removeTrackFromPlaylist = async (trackId: string, playlistId: string) => {
        console.log('removeTrackFromPlaylistが呼び出されました');
        try {
            const response = await fetch(`/java/playlist/removeTrack?trackId=${trackId}&playlistId=${playlistId}`, {
                method: 'GET',
            });
            if (response.status === 200) {
                const data = await response.text();
                console.log('Track removed successfully:', data);
                setMessage('楽曲がプレイリストから削除されました');
                setMessageType('success');
                setTrackStatus(prevStatus => ({...prevStatus, [trackId]: false}));
            } else {
                console.error('Error removing track:', response.status);
                setMessage('楽曲の削除に失敗しました');
                setMessageType('error');
            }
        } catch (error) {
            console.error('Error removing track:', error);
            setMessage('楽曲の削除に失敗しました');
            setMessageType('error');
        }
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
        setShowPlaylists(false);
    }, [fetchAndSetRecommendations, setShowPlaylists]);

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
            {rows.map((row: {
                getRowProps: () => React.JSX.IntrinsicAttributes & React.ClassAttributes<HTMLTableRowElement> & React.HTMLAttributes<HTMLTableRowElement>;
                cells: any[];
                original: any;
            }) => {
                prepareRow(row);
                return (
                    <tr {...row.getRowProps()}
                        style={{backgroundColor: trackStatus[row.original.id] ? 'lightgreen' : 'white'}}>
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

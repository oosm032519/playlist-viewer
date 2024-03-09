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
    
    const handleTrackAction = useCallback(async (trackId: string, action: 'add' | 'remove') => {
        console.log(`楽曲${trackId}をプレイリスト${playlistId.playlistId}に${action === 'add' ? '追加' : '削除'}します`);
        const actionMap = {
            add: {
                url: `/java/playlist/addTrack?trackId=${trackId}&playlistId=${playlistId.playlistId}`,
                successMessage: '楽曲がプレイリストに追加されました',
                errorMessage: '楽曲の追加に失敗しました',
                statusUpdate: true
            },
            remove: {
                url: `/java/playlist/removeTrack?trackId=${trackId}&playlistId=${playlistId.playlistId}`,
                successMessage: '楽曲がプレイリストから削除されました',
                errorMessage: '楽曲の削除に失敗しました',
                statusUpdate: false
            }
        };
        
        try {
            const response = await fetch(actionMap[action].url, {method: 'GET'});
            if (response.status === 200) {
                setMessage(actionMap[action].successMessage);
                setMessageType('success');
                setTrackStatus(prevStatus => ({...prevStatus, [trackId]: actionMap[action].statusUpdate}));
            } else {
                setMessage(actionMap[action].errorMessage);
                setMessageType('error');
            }
        } catch (error) {
            setMessage(actionMap[action].errorMessage);
            setMessageType('error');
        }
    }, [playlistId, setMessage, setMessageType]);
    
    const fetchAndSetRecommendations = useCallback(() => {
        fetchRecommendations(playlist.tracks)
            .then(data => {
                setRecommendations(data);
            })
            .catch(error => console.error(error));
    }, [fetchRecommendations, playlist]);
    
    useEffect(() => {
        fetchAndSetRecommendations();
    }, [fetchAndSetRecommendations, setShowPlaylists]);
    
    const data = React.useMemo(() => recommendations, [recommendations]);
    
    const columns = React.useMemo(() => [
        {Header: 'Track Name', accessor: 'name'},
        {Header: 'Artist', accessor: 'artists[0].name'},
        {
            Header: 'Actions',
            accessor: 'id',
            Cell: ({row}: { row: any }) => (
                <div>
                    <button onClick={() => handleTrackAction(row.values.id, 'add')}>+</button>
                    <button onClick={() => handleTrackAction(row.values.id, 'remove')}>-</button>
                </div>
            ),
        },
    ], [handleTrackAction]);
    
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable({columns, data});
    
    return (
        <table {...getTableProps()} className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
            {headerGroups.map((headerGroup: { getHeaderGroupProps: () => React.JSX.IntrinsicAttributes & React.ClassAttributes<HTMLTableRowElement> & React.HTMLAttributes<HTMLTableRowElement>; headers: any[]; }) => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map(column => (
                        <th {...column.getHeaderProps()}
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {column.render('Header')}
                        </th>
                    ))}
                </tr>
            ))}
            </thead>
            <tbody {...getTableBodyProps()} className="bg-white divide-y divide-gray-200">
            {rows.map((row: { getRowProps: () => React.JSX.IntrinsicAttributes & React.ClassAttributes<HTMLTableRowElement> & React.HTMLAttributes<HTMLTableRowElement>; original: { id: string | number; }; cells: any[]; }) => {
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

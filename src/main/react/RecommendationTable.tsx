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
            Header: 'Action',
            accessor: 'id',
            Cell: ({value}: { value: string }) => (
                <div className="flex justify-around">
                    <button onClick={() => handleTrackAction(value, trackStatus[value] ? 'remove' : 'add')}
                            className={`flex justify-center items-center px-4 py-2 min-w-28 rounded-md text-white transition-colors duration-300 ${trackStatus[value] ? 'bg-red-500 hover:bg-red-700' : 'bg-green-500 hover:bg-green-700'}`}>
                    {trackStatus[value] ? 'Remove' : 'Add'}
                    </button>
                </div>
            ),
        },
    ], [handleTrackAction, trackStatus]);
    
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable({columns, data});
    
    return (
        <table {...getTableProps()} className="min-w-full divide-y divide-gray-200 shadow-md table-auto">
            <thead className="bg-gray-50">
            {headerGroups.map((headerGroup: {
                getHeaderGroupProps: () => React.JSX.IntrinsicAttributes & React.ClassAttributes<HTMLTableRowElement> & React.HTMLAttributes<HTMLTableRowElement>;
                headers: any[];
            }) => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map(column => (
                        <th {...column.getHeaderProps()}
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded">
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
            }) => {
                prepareRow(row);
                return (
                    <tr {...row.getRowProps()} className="rounded">
                        {row.cells.map((cell, i) => (
                            <td {...cell.getCellProps()}
                                className={`px-6 py-4 whitespace-nowrap ${i === 0 ? 'rounded-l' : ''} ${i === row.cells.length - 1 ? 'rounded-r' : ''}`}>
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

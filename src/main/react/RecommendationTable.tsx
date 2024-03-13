import React, {Dispatch, SetStateAction, useCallback, useContext, useEffect, useState} from 'react';
import {useTable, useSortBy} from 'react-table';
import {useApi} from './useApi'
import PlaylistIdContext from './PlaylistIdContext';
import {Bars} from 'react-loader-spinner';
type RecommendationsTableProps = {
    playlist: { name: string, tracks: any[] },
    setMessage: Dispatch<SetStateAction<string | null>>,
    setMessageType: Dispatch<SetStateAction<'success' | 'error' | null>>
};

let audio = new Audio();

const RecommendationsTable: React.FC<RecommendationsTableProps> = ({playlist, setMessage, setMessageType}) => {
    const playlistId = useContext(PlaylistIdContext);
    const [recommendations, setRecommendations] = useState([]);
    const {fetchRecommendations} = useApi();
    const [trackStatus, setTrackStatus] = useState<{ [key: string]: boolean }>({});
    const [setShowPlaylists] = useState(false);
    const [playingTrackId, setPlayingTrackId] = useState<string | null>(null);
    
    const handlePreviewClick = (trackId: string, previewUrl: string) => {
        if (audio) {
            audio.pause();
            audio.currentTime = 0;
        }
        if (playingTrackId === trackId) {
            setPlayingTrackId(null);
        } else {
            audio = new Audio(previewUrl);
            audio.play();
            setPlayingTrackId(trackId);
            audio.onended = () => {
                setPlayingTrackId(null);
            };
        }
    };
    
    const formatDuration = (durationMs: number) => {
        const minutes = Math.floor(durationMs / 60000);
        const seconds = ((durationMs % 60000) / 1000).toFixed(0);
        return minutes + ":" + (parseFloat(seconds) < 10 ? '0' : '') + seconds;
    }
    
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
        {
            Header: 'Album',
            accessor: (row: { album: { images: { url: any; }[]; externalUrls: { externalUrls: { spotify: any; }; }; }; }) => ({
                imageUrl: row.album.images[0].url,
                albumUrl: row.album.externalUrls.externalUrls.spotify
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
            accessor: 'name',
            Cell: ({row, value}: { row: { original: { id: string } }, value: string }) => (
                <a href={`https://open.spotify.com/track/${row.original.id}`} target="_blank" rel="noopener noreferrer">
                    {value}
                </a>
            ),
        },
        {
            Header: 'Artist',
            accessor: 'artists[0].name',
            Cell: ({row, value}: { row: { original: { artists: any[] } }, value: string }) => (
                <a href={row.original.artists[0].externalUrls.externalUrls.spotify} target="_blank" rel="noopener noreferrer">
                    {value}
                </a>
            ),
        },
        {
            Header: 'Duration',
            accessor: 'durationMs',
            Cell: ({value}: { value: number }) => (
                <div>{formatDuration(value)}</div>
            ),
        },
        {
            Header: 'Popularity',
            accessor: 'popularity',
            Cell: ({value}: { value: number }) => (
                <div>{value}</div>
            ),
        },
        {
            Header: 'Preview',
            accessor: 'previewUrl',
            Cell: ({row, value}: { row: { original: { id: string } }, value: string }) => (
                <button onClick={() => handlePreviewClick(row.original.id, value)}
                        className="flex justify-center items-center px-4 py-2 rounded-md text-white bg-blue-500 hover:bg-blue-700">
                    {playingTrackId === row.original.id ?
                        <Bars
                            height="70%"
                            width="80%"
                            color="#FFF"
                            ariaLabel="audio-loading"
                            wrapperStyle={{height: '70%', width: '80%'}}
                            wrapperClass="wrapper-class"
                            visible={true}
                        /> : '試聴'}
                </button>
            ),
            disableSortBy: true,
        },
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
            disableSortBy: true,
        },
    ], [handleTrackAction, trackStatus, playingTrackId]);
    
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable({columns, data}, useSortBy);
    
    return (
        <div className="whitespace-nowrap overflow-auto h-full w-full divide-y divide-gray-200 shadow-md">
        <table {...getTableProps()} className="overflow-auto h-full w-full divide-y divide-gray-200 shadow-md table-auto">
            <thead className="bg-gray-50">
            {
                headerGroups.map((headerGroup: {
                    getHeaderGroupProps: () => React.JSX.IntrinsicAttributes & React.ClassAttributes<HTMLTableRowElement> & React.HTMLAttributes<HTMLTableRowElement>;
                    headers: any[];
                }) => (
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
                rows.map((row: {
                    [x: string]: any;
                    getRowProps: () => React.JSX.IntrinsicAttributes & React.ClassAttributes<HTMLTableRowElement> & React.HTMLAttributes<HTMLTableRowElement>;
                    cells: any[];
                }) => {
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

export default RecommendationsTable;

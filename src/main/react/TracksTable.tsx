import React from 'react';
import {useTable, useSortBy} from 'react-table';

// プレイリストの総再生時間と平均曲長を計算する関数
function calculatePlaylistStats(tracks: any[]) {
    let totalDurationMs = 0;
    tracks.forEach(track => {
        totalDurationMs += track.audioFeatures.durationMs;
    });
    const averageDurationMs = totalDurationMs / tracks.length;
    return {totalDurationMs, averageDurationMs};
}

// プレイリスト情報を表示するコンポーネント
const PlaylistInfo: React.FC<{ playlist: { name: string, tracks: any[] } }> = ({playlist}) => {
    const {totalDurationMs, averageDurationMs} = calculatePlaylistStats(playlist.tracks);
    const totalDuration = formatDuration(totalDurationMs);
    const averageDuration = formatDuration(averageDurationMs);
    
    return (
        <div className="p-4 bg-primary text-white rounded-md shadow-md">
            <h2 className="text-2xl font-bold mb-2">{playlist.name}</h2>
            <p className="text-lg">Tracks: <span className="font-semibold">{playlist.tracks.length}</span></p>
            <p className="text-lg">Total Duration: <span className="font-semibold">{totalDuration}</span></p>
            <p className="text-lg">Average Track Length: <span className="font-semibold">{averageDuration}</span></p>
        </div>
    );
};

const formatDuration = (durationMs: number) => {
    const minutes = Math.floor(durationMs / 60000);
    const seconds = ((durationMs % 60000) / 1000).toFixed(0);
    return minutes + ":" + (parseFloat(seconds) < 10 ? '0' : '') + seconds;
}

// TracksTableコンポーネントにPlaylistInfoコンポーネントを追加
const TracksTable = ({playlist, setSelectedTrack}: {
    playlist: { name: string, tracks: any[] },
    setSelectedTrack: (track: any) => void
}) => {
    const data = React.useMemo(() => playlist.tracks, [playlist]);
    
    function keyToNote(key: number): string {
        const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
        return notes[key];
    }
    
    function timeSignatureToString(timeSignature: number) {
                return timeSignature + "/4";
        }
    
    const columns = React.useMemo(() => [
        {
            Header: 'Album',
            accessor: (row: {
                playlistTrack: { track: { album: { images: { url: any; }[]; }; }; };
            }) => row.playlistTrack.track.album.images[0].url,
            Cell: ({value}: { value: string }) => (
                <img src={value} alt="Album Cover" width="50" height="50"/>
            ),
            disableSortBy: true,
        },
        {Header: 'Track Name', accessor: 'playlistTrack.track.name'},
        {Header: 'Artist', accessor: 'playlistTrack.track.artists[0].name'},
        {
            Header: 'Duration',
            accessor: 'audioFeatures.durationMs',
            Cell: ({value}: { value: number }) => (
                <div>{formatDuration(value)}</div>
            ),
        },
        {Header: 'Popularity', accessor: 'playlistTrack.track.popularity'},
        {Header: 'Tempo', accessor: 'audioFeatures.tempo'},
        {
            Header: 'Time Signature',
            accessor: 'audioFeatures.timeSignature',
            Cell: ({value}: { value: number }) => timeSignatureToString(value)
        },
        {Header: 'Key', accessor: 'audioFeatures.key', Cell: ({value}: { value: number }) => keyToNote(value)},
        {Header: 'Mode', accessor: 'audioFeatures.mode'},
        {Header: 'Acousticness', accessor: 'audioFeatures.acousticness'},
        {Header: 'Danceability', accessor: 'audioFeatures.danceability'},
        {Header: 'Energy', accessor: 'audioFeatures.energy'},
        {Header: 'Instrumentalness', accessor: 'audioFeatures.instrumentalness'},
        {Header: 'Liveness', accessor: 'audioFeatures.liveness'},
        {Header: 'Loudness', accessor: 'audioFeatures.loudness'},
        {Header: 'Speechiness', accessor: 'audioFeatures.speechiness'},
        {Header: 'Valence', accessor: 'audioFeatures.valence'},
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
        <div>
        <PlaylistInfo playlist={playlist} />
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
                                className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider h-50 ${i === 0 ? 'sticky left-0 z-10 bg-gray-50' : ''}`}>
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
    </div>
    );
};

export default TracksTable;

import React, { useEffect, useState } from 'react';
import { useTable } from 'react-table';
import {calculateAverageValues, calculateMode, calculateModeArtistNames} from './RecommendationCalculator'
import {Track} from '../typescript/track'

const RecommendationsTable = ({ playlist }: { playlist: { name: string, tracks: any[] }}) => {
    const [recommendations, setRecommendations] = useState([]);
    
    useEffect(() => {
        const modeArtistNames = calculateModeArtistNames(playlist.tracks);
        const averageValues = calculateAverageValues(playlist.tracks);
        const mode = calculateMode(playlist.tracks);
        
        const endpoint = `/java/recommendations?tempo=${averageValues.averageTempo}&key=${averageValues.modeKey}&danceability=${averageValues.averageDanceability}&energy=${averageValues.averageEnergy}&acousticness=${averageValues.averageAcousticness}&liveness=${averageValues.averageLiveness}&speechiness=${averageValues.averageSpeechiness}&valence=${averageValues.averageValence}&timeSignature=${averageValues.timeSignature}&durationMs=${averageValues.durationMs}&mode=${mode}&instrumentalness=${averageValues.instrumentalness}&loudness=${averageValues.loudness}&modeArtistNames=${modeArtistNames}`;
        fetch(endpoint)
            .then(response => response.json())
            .then(data => {
                console.log("Response:", Response);
                console.log("data:", data);
                // Get the ids of the tracks in the playlist
                const trackIds = playlist.tracks.map(track => track.audioFeatures.id);
                // Filter out the recommendations that are already in the playlist
                const uniqueRecommendations = data.tracks.filter((track: Track) => !trackIds.includes(track.id));
                setRecommendations(uniqueRecommendations);
            })
            .catch(error => console.error(error));
    }, [playlist]);
    
    const data = React.useMemo(() => recommendations, [recommendations]);

    const columns = React.useMemo(() => [
        { Header: 'Track Name', accessor: 'name' },
        { Header: 'Artist', accessor: 'artists[0].name' },
    ], []);

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

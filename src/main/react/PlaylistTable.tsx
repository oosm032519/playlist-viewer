import React, {useRef} from 'react';

const PlaylistTable = ({playlist}: { playlist: { name: string, tracks: any[] } }) => {
    const headerElements = useRef(null);
    
    const onHeaderClick = (field: string) => {
        console.log(field);
    };

    return (
        <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50" ref={headerElements}>
            <tr>
                <th onClick={() => onHeaderClick('Track Name')} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Track Name</th>
                <th onClick={() => onHeaderClick('Artist')} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Artist</th>
                <th onClick={() => onHeaderClick('Tempo')} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tempo</th>
                <th onClick={() => onHeaderClick('Time Signature')} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time Signature</th>
                <th onClick={() => onHeaderClick('Duration (ms)')} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration (ms)</th>
                <th onClick={() => onHeaderClick('Key')} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Key</th>
                <th onClick={() => onHeaderClick('Mode')} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mode</th>
                <th onClick={() => onHeaderClick('Acousticness')} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acousticness</th>
                <th onClick={() => onHeaderClick('Danceability')} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Danceability</th>
                <th onClick={() => onHeaderClick('Energy')} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Energy</th>
                <th onClick={() => onHeaderClick('Instrumentalness')} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Instrumentalness</th>
                <th onClick={() => onHeaderClick('Liveness')} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Liveness</th>
                <th onClick={() => onHeaderClick('Loudness')} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Loudness</th>
                <th onClick={() => onHeaderClick('Speechiness')} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Speechiness</th>
                <th onClick={() => onHeaderClick('Valence')} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valence</th>
                <th onClick={() => onHeaderClick('Popularity')} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Popularity</th>
            </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
            {playlist.tracks?.filter((track: any) => track && track.playlistTrack.track).map((track: any, index: number) => (
                <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap">{track.playlistTrack.track.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{track.playlistTrack.track.artists[0].name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{track.audioFeatures.tempo}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{track.audioFeatures.timeSignature}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{track.audioFeatures.durationMs}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{track.audioFeatures.key}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{track.audioFeatures.mode}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{track.audioFeatures.acousticness}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{track.audioFeatures.danceability}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{track.audioFeatures.energy}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{track.audioFeatures.instrumentalness}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{track.audioFeatures.liveness}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{track.audioFeatures.loudness}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{track.audioFeatures.speechiness}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{track.audioFeatures.valence}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{track.playlistTrack.track.popularity}</td>
                </tr>
            ))}
            </tbody>
        </table>
    );
};

export default PlaylistTable;

import React from 'react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip, Legend } from 'recharts';
import { RecommendationCalculator } from './RecommendationCalculator';

const PlaylistAverageInfo = ({ playlist }: { playlist: { name: string, tracks: any[] }}) => {
    const data = RecommendationCalculator.calculateAverageValues(playlist.tracks);

    const chartData = [
        {name: 'Acousticness', value: data.averageAcousticness},
        { name: 'Danceability', value: data.averageDanceability },
        { name: 'Energy', value: data.averageEnergy },
        {name: 'Instrumentalness', value: data.instrumentalness},
        { name: 'Liveness', value: data.averageLiveness },
        { name: 'Speechiness', value: data.averageSpeechiness },
        { name: 'Valence', value: data.averageValence },
    ];

    return (
        <RadarChart cx={300} cy={150} outerRadius={100} width={600} height={300} data={chartData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="name" />
            <PolarRadiusAxis />
            <Tooltip />
            <Legend />
            <Radar name="Average" dataKey="value" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
        </RadarChart>
    );
};

export default PlaylistAverageInfo;

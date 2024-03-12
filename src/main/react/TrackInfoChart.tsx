import React from 'react';
import {RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip, Legend} from 'recharts';

const TrackInfoChart = ({track}: { track: any }) => {
    const chartData = [
        {name: 'Acousticness', value: track.audioFeatures.acousticness},
        {name: 'Danceability', value: track.audioFeatures.danceability},
        {name: 'Energy', value: track.audioFeatures.energy},
        {name: 'Instrumentalness', value: track.audioFeatures.instrumentalness},
        {name: 'Liveness', value: track.audioFeatures.liveness},
        {name: 'Speechiness', value: track.audioFeatures.speechiness},
        {name: 'Valence', value: track.audioFeatures.valence},
    ];
    
    return (
        <RadarChart cx={300} cy={150} outerRadius={100} width={600} height={300} data={chartData}>
            <PolarGrid/>
            <PolarAngleAxis dataKey="name"/>
            <PolarRadiusAxis/>
            <Tooltip/>
            <Legend/>
            <Radar name="Track Info" dataKey="value" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6}/>
        </RadarChart>
    );
};

export default TrackInfoChart;

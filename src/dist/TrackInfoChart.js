"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const recharts_1 = require("recharts");
const TrackInfoChart = ({ track }) => {
    const chartData = [
        { name: 'Acousticness', value: track.audioFeatures.acousticness },
        { name: 'Danceability', value: track.audioFeatures.danceability },
        { name: 'Energy', value: track.audioFeatures.energy },
        { name: 'Instrumentalness', value: track.audioFeatures.instrumentalness },
        { name: 'Liveness', value: track.audioFeatures.liveness },
        { name: 'Speechiness', value: track.audioFeatures.speechiness },
        { name: 'Valence', value: track.audioFeatures.valence },
    ];
    return (react_1.default.createElement(recharts_1.RadarChart, { cx: 300, cy: 150, outerRadius: 100, width: 600, height: 300, data: chartData },
        react_1.default.createElement(recharts_1.PolarGrid, null),
        react_1.default.createElement(recharts_1.PolarAngleAxis, { dataKey: "name" }),
        react_1.default.createElement(recharts_1.PolarRadiusAxis, null),
        react_1.default.createElement(recharts_1.Tooltip, null),
        react_1.default.createElement(recharts_1.Legend, null),
        react_1.default.createElement(recharts_1.Radar, { name: "Track Info", dataKey: "value", stroke: "#8884d8", fill: "#8884d8", fillOpacity: 0.6 })));
};
exports.default = TrackInfoChart;
//# sourceMappingURL=TrackInfoChart.js.map
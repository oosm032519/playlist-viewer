"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const recharts_1 = require("recharts");
const RecommendationCalculator_1 = require("./RecommendationCalculator");
const PlaylistAverageInfo = ({ playlist }) => {
    const data = RecommendationCalculator_1.RecommendationCalculator.calculateAverageValues(playlist.tracks);
    const chartData = [
        { name: 'Acousticness', value: data.averageAcousticness },
        { name: 'Danceability', value: data.averageDanceability },
        { name: 'Energy', value: data.averageEnergy },
        { name: 'Instrumentalness', value: data.instrumentalness },
        { name: 'Liveness', value: data.averageLiveness },
        { name: 'Speechiness', value: data.averageSpeechiness },
        { name: 'Valence', value: data.averageValence },
    ];
    return (react_1.default.createElement(recharts_1.RadarChart, { cx: 300, cy: 150, outerRadius: 100, width: 600, height: 300, data: chartData },
        react_1.default.createElement(recharts_1.PolarGrid, null),
        react_1.default.createElement(recharts_1.PolarAngleAxis, { dataKey: "name" }),
        react_1.default.createElement(recharts_1.PolarRadiusAxis, null),
        react_1.default.createElement(recharts_1.Tooltip, null),
        react_1.default.createElement(recharts_1.Legend, null),
        react_1.default.createElement(recharts_1.Radar, { name: "Average", dataKey: "value", stroke: "#8884d8", fill: "#8884d8", fillOpacity: 0.6 })));
};
exports.default = PlaylistAverageInfo;
//# sourceMappingURL=PlaylistAverageInfoChart.js.map
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const recharts_1 = require("recharts");
const CombinedContext_1 = __importDefault(require("./CombinedContext"));
const TrackAverageInfo = () => {
    const { selectedTrack } = (0, react_1.useContext)(CombinedContext_1.default);
    const data = selectedTrack ? [
        { name: 'Acousticness', value: selectedTrack.audioFeatures.acousticness },
        { name: 'Danceability', value: selectedTrack.audioFeatures.danceability },
        { name: 'Energy', value: selectedTrack.audioFeatures.energy },
        { name: 'Instrumentalness', value: selectedTrack.audioFeatures.instrumentalness },
        { name: 'Liveness', value: selectedTrack.audioFeatures.liveness },
        { name: 'Speechiness', value: selectedTrack.audioFeatures.speechiness },
        { name: 'Valence', value: selectedTrack.audioFeatures.valence },
    ] : [];
    return (react_1.default.createElement(recharts_1.RadarChart, { cx: 300, cy: 150, outerRadius: 100, width: 600, height: 300, data: data },
        react_1.default.createElement(recharts_1.PolarGrid, null),
        react_1.default.createElement(recharts_1.PolarAngleAxis, { dataKey: "name" }),
        react_1.default.createElement(recharts_1.PolarRadiusAxis, null),
        react_1.default.createElement(recharts_1.Tooltip, null),
        react_1.default.createElement(recharts_1.Legend, null),
        react_1.default.createElement(recharts_1.Radar, { name: "Average", dataKey: "value", stroke: "#8884d8", fill: "#8884d8", fillOpacity: 0.6 })));
};
exports.default = TrackAverageInfo;
//# sourceMappingURL=TrackAverageInfo.js.map
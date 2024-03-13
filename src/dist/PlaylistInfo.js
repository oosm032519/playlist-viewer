"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
// プレイリストの総再生時間と平均曲長を計算する関数
function calculatePlaylistStats(tracks) {
    let totalDurationMs = 0;
    tracks.forEach(track => {
        totalDurationMs += track.audioFeatures.durationMs;
    });
    const averageDurationMs = totalDurationMs / tracks.length;
    return { totalDurationMs, averageDurationMs };
}
const formatDuration = (durationMs) => {
    const minutes = Math.floor(durationMs / 60000);
    const seconds = ((durationMs % 60000) / 1000).toFixed(0);
    return minutes + ":" + (parseFloat(seconds) < 10 ? '0' : '') + seconds;
};
// プレイリスト情報を表示するコンポーネント
const PlaylistInfo = ({ playlist }) => {
    const { totalDurationMs, averageDurationMs } = calculatePlaylistStats(playlist.tracks);
    const totalDuration = formatDuration(totalDurationMs);
    const averageDuration = formatDuration(averageDurationMs);
    return (react_1.default.createElement("div", { className: "p-4 bg-primary text-white rounded-md shadow-md" },
        react_1.default.createElement("h2", { className: "text-2xl font-bold mb-2" }, playlist.name),
        react_1.default.createElement("p", { className: "text-lg" },
            "Tracks: ",
            react_1.default.createElement("span", { className: "font-semibold" }, playlist.tracks.length)),
        react_1.default.createElement("p", { className: "text-lg" },
            "Total Duration: ",
            react_1.default.createElement("span", { className: "font-semibold" }, totalDuration)),
        react_1.default.createElement("p", { className: "text-lg" },
            "Average Track Length: ",
            react_1.default.createElement("span", { className: "font-semibold" }, averageDuration))));
};
exports.default = PlaylistInfo;
//# sourceMappingURL=PlaylistInfo.js.map
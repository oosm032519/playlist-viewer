import React from 'react';

// プレイリストの総再生時間と平均曲長を計算する関数
function calculatePlaylistStats(tracks: any[]) {
    let totalDurationMs = 0;
    tracks.forEach(track => {
        totalDurationMs += track.audioFeatures.durationMs;
    });
    const averageDurationMs = totalDurationMs / tracks.length;
    return {totalDurationMs, averageDurationMs};
}

const formatDuration = (durationMs: number) => {
    const minutes = Math.floor(durationMs / 60000);
    const seconds = ((durationMs % 60000) / 1000).toFixed(0);
    return minutes + ":" + (parseFloat(seconds) < 10 ? '0' : '') + seconds;
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

export default PlaylistInfo;
